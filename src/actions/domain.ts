// src/actions/domain.ts
"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import dns from "dns";
import { promisify } from "util";

const resolveTxt = promisify(dns.resolveTxt);

export const addDomain = async (data: { name: string; siteId: string }) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 401, message: "Unauthorized" };

    const userData = await client.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!userData) return { status: 404, message: "User not found" };

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

    // Check DNS TXT record
    try {
      const records = await resolveTxt(`_linkbuilder-verify.${domain.name}`);
      const isVerified = records.some((record) =>
        record.some((txt) => txt === domain.verificationId)
      );

      if (isVerified) {
        await client.domain.update({
          where: { id: domainId },
          data: {
            isVerified: true,
            sslStatus: "pending", // Start SSL provisioning
          },
        });

        // Here you would trigger SSL certificate provisioning
        // This depends on your hosting provider (Vercel, Netlify, etc.)

        revalidatePath("/admin/domains");

        return {
          status: 200,
          message: "Domain verified successfully",
        };
      } else {
        return {
          status: 400,
          message: "Verification TXT record not found",
        };
      }
    } catch (dnsError) {
      return {
        status: 400,
        message: "Could not verify domain. Please check DNS settings.",
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