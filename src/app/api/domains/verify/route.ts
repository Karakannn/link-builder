// src/app/api/domains/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/lib/prisma";
import { vercelAPI } from "@/lib/vercel";
import dns from "dns";
import { promisify } from "util";

const resolveTxt = promisify(dns.resolveTxt);

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userData = await client.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!userData) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { domainId } = body;

    if (!domainId) {
      return NextResponse.json(
        { error: "Domain ID is required" },
        { status: 400 }
      );
    }

    const domain = await client.domain.findFirst({
      where: {
        id: domainId,
        userId: userData.id,
      },
    });

    if (!domain) {
      return NextResponse.json(
        { error: "Domain not found" },
        { status: 404 }
      );
    }

    // If already verified, return success
    if (domain.isVerified) {
      return NextResponse.json({
        success: true,
        message: "Domain is already verified",
        isVerified: true,
      });
    }

    // Check DNS TXT record for ownership verification
    let isOwnershipVerified = false;
    try {
      const records = await resolveTxt(`_linkbuilder-verify.${domain.name}`);
      isOwnershipVerified = records.some((record) =>
        record.some((txt) => txt === domain.verificationId)
      );
    } catch (dnsError) {
      console.log("DNS lookup failed:", dnsError);
    }

    if (!isOwnershipVerified) {
      return NextResponse.json({
        success: false,
        error: "Ownership verification TXT record not found",
        details: {
          required: {
            type: "TXT",
            name: `_linkbuilder-verify.${domain.name}`,
            value: domain.verificationId,
          },
        },
      }, { status: 400 });
    }

    // Check Vercel domain verification
    const vercelVerification = await vercelAPI.checkDomainVerification(domain.name);
    if (!vercelVerification.success) {
      return NextResponse.json({
        success: false,
        error: `Vercel verification failed: ${vercelVerification.error}`,
      }, { status: 400 });
    }

    const isVercelVerified = vercelVerification.isVerified;

    if (isVercelVerified) {
      // Update domain as verified
      await client.domain.update({
        where: { id: domainId },
        data: {
          isVerified: true,
          sslStatus: "active",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Domain verified successfully",
        isVerified: true,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: "Domain verification is still pending",
        details: {
          verification: vercelVerification.verification,
          message: "Please ensure your domain points to our servers and try again in a few minutes.",
        },
      }, { status: 400 });
    }

  } catch (error) {
    console.error("Domain verification API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userData = await client.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!userData) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get("domainId");

    if (!domainId) {
      return NextResponse.json(
        { error: "Domain ID is required" },
        { status: 400 }
      );
    }

    const domain = await client.domain.findFirst({
      where: {
        id: domainId,
        userId: userData.id,
      },
    });

    if (!domain) {
      return NextResponse.json(
        { error: "Domain not found" },
        { status: 404 }
      );
    }

    // Get domain status from Vercel
    const vercelInfo = await vercelAPI.getDomainInfo(domain.name);
    
    return NextResponse.json({
      success: true,
      domain: {
        name: domain.name,
        isVerified: domain.isVerified,
        sslStatus: domain.sslStatus,
        verificationId: domain.verificationId,
      },
      vercel: vercelInfo.success ? vercelInfo.data : null,
    });

  } catch (error) {
    console.error("Domain status API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}