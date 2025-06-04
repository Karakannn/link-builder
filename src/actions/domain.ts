// src/actions/domain.ts
"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import dns from "dns";
import { promisify } from "util";
import { vercelAPI } from "@/lib/vercel";

const resolveTxt = promisify(dns.resolveTxt);

export const addDomain = async (data: { name: string; siteId: string }) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 401, message: "Unauthorized" };

    const userData = await client.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!userData) return { status: 404, message: "User not found" };

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{1,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{1,61}[a-zA-Z0-9])?)*$/;
    if (!domainRegex.test(data.name)) {
      return { status: 400, message: "Invalid domain format" };
    }

    // Check if domain already exists
    const existingDomain = await client.domain.findUnique({
      where: { name: data.name },
    });

    if (existingDomain) {
      return { status: 400, message: "Domain already exists" };
    }

    // Check if site belongs to user
    const site = await client.site.findFirst({
      where: {
        id: data.siteId,
        userId: userData.id,
      },
    });

    if (!site) {
      return { status: 404, message: "Site not found or access denied" };
    }

    console.log("data.name", data.name);
    
    // Add domain to Vercel first
    const vercelResult = await vercelAPI.addDomain(data.name);
    if (!vercelResult.success) {
      console.error("Vercel domain addition failed:", vercelResult.error);
      return { 
        status: 400, 
        message: `Failed to configure domain: ${vercelResult.error}` 
      };
    }

    // Create domain with verification ID
    const verificationId = `linkbuilder-verify-${uuidv4()}`;

    const domain = await client.domain.create({
      data: {
        name: data.name,
        userId: userData.id,
        siteId: data.siteId,
        verificationId: verificationId,
      },
    });

    revalidatePath("/admin/domains");

    return {
      status: 200,
      message: "Domain added successfully",
      domain,
      vercelData: vercelResult.data,
    };
  } catch (error) {
    console.error("Error adding domain:", error);
    return { status: 500, message: "Failed to add domain" };
  }
};

export const verifyDomain = async (domainId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 401, message: "Unauthorized" };

    const userData = await client.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!userData) return { status: 404, message: "User not found" };

    const domain = await client.domain.findFirst({
      where: {
        id: domainId,
        userId: userData.id,
      },
    });

    if (!domain) {
      return { status: 404, message: "Domain not found" };
    }

    // Check DNS TXT record for ownership verification
    try {
      const records = await resolveTxt(`_linkbuilder-verify.${domain.name}`);
      const isOwnershipVerified = records.some((record) =>
        record.some((txt) => txt === domain.verificationId)
      );

      if (!isOwnershipVerified) {
        return {
          status: 400,
          message: "Ownership verification TXT record not found. Please add the TXT record and try again.",
        };
      }
    } catch (dnsError) {
      return {
        status: 400,
        message: "Could not verify domain ownership. Please check DNS settings and try again.",
      };
    }

    // Check Vercel domain verification
    const vercelVerification = await vercelAPI.checkDomainVerification(domain.name);
    if (!vercelVerification.success) {
      return {
        status: 400,
        message: `Vercel verification failed: ${vercelVerification.error}`,
      };
    }

    const isVerified = vercelVerification.isVerified;

    if (isVerified) {
      await client.domain.update({
        where: { id: domainId },
        data: {
          isVerified: true,
          sslStatus: "active", // Vercel automatically provisions SSL
        },
      });

      revalidatePath("/admin/domains");

      return {
        status: 200,
        message: "Domain verified successfully",
      };
    } else {
      return {
        status: 400,
        message: "Domain verification is still pending. Please ensure your domain points to our servers and try again in a few minutes.",
        verification: vercelVerification.verification,
      };
    }
  } catch (error) {
    console.error("Error verifying domain:", error);
    return { status: 500, message: "Failed to verify domain" };
  }
};

export const deleteDomain = async (domainId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 401, message: "Unauthorized" };

    const userData = await client.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!userData) return { status: 404, message: "User not found" };

    const domain = await client.domain.findFirst({
      where: {
        id: domainId,
        userId: userData.id,
      },
    });

    if (!domain) {
      return { status: 404, message: "Domain not found" };
    }

    // Remove domain from Vercel first
    const vercelResult = await vercelAPI.removeDomain(domain.name);
    if (!vercelResult.success) {
      console.warn("Failed to remove domain from Vercel:", vercelResult.error);
      // Continue with database deletion even if Vercel removal fails
    }

    await client.domain.delete({
      where: { id: domainId },
    });

    revalidatePath("/admin/domains");

    return {
      status: 200,
      message: "Domain deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting domain:", error);
    return { status: 500, message: "Failed to delete domain" };
  }
};

export const getUserDomains = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 401, domains: [] };

    const userData = await client.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!userData) return { status: 404, domains: [] };

    const domains = await client.domain.findMany({
      where: { userId: userData.id },
      include: { site: true },
      orderBy: { createdAt: "desc" },
    });

    return {
      status: 200,
      domains,
    };
  } catch (error) {
    console.error("Error fetching domains:", error);
    return { status: 500, domains: [] };
  }
};

export const getDomainSetupInfo = async (domainName: string) => {
  try {
    const cnameTarget = vercelAPI.getCnameTarget();
    const aRecord = vercelAPI.getARecord();

    return {
      status: 200,
      cnameTarget,
      aRecord,
      domain: domainName,
    };
  } catch (error) {
    console.error("Error getting domain setup info:", error);
    return { 
      status: 500, 
      message: "Failed to get domain setup information" 
    };
  }
};