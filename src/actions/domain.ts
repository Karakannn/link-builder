"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import dns from 'dns/promises';

const DNS_CONFIG = {
    EXPECTED_A_RECORD: process.env.DOMAIN_A_RECORD || "216.198.79.193",
    EXPECTED_CNAME_TARGET: process.env.DOMAIN_CNAME_TARGET || "f88de97402c3efd7.vercel-dns-017.com"
};

export const addDomain = async (data: { name: string; siteId: string }) => {
    try {
        const user = await currentUser();
        if (!user) return { status: 401, message: "Unauthorized" };

        const userData = await client.user.findUnique({
            where: { clerkId: user.id },
        });

        if (!userData) return { status: 404, message: "User not found" };

        // Validate domain format
        /*  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{1,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{1,61}[a-zA-Z0-9])?)*$/;
         if (!domainRegex.test(data.name)) {
             return { status: 400, message: "Invalid domain format" };
         } */

        // Check if domain already exists
        const existingDomain = await client.domain.findUnique({
            where: { name: data.name },
        });

        if (existingDomain) {
            return { status: 400, message: "Domain already exists in our system" };
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

        // Check if site has a homepage
        const homePage = await client.page.findFirst({
            where: {
                siteId: site.id,
                isHome: true,
            },
        });

        if (!homePage) {
            return { status: 400, message: "Site must have a homepage before adding a domain" };
        }

        // Create domain with verification ID
        const verificationId = `linkbuilder-verify-${uuidv4()}`;

        const domain = await client.domain.create({
            data: {
                name: data.name,
                userId: userData.id,
                siteId: data.siteId,
                verificationId: verificationId,
                isVerified: false,
                sslStatus: "pending",
            },
        });

        revalidatePath("/admin/domains");

        return {
            status: 200,
            message: "Domain added successfully. Please configure DNS settings.",
            domain,
            verificationId,
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

        if (process.env.NODE_ENV === "development" && (domain.name.includes("localhost") || domain.name.includes("127.0.0.1"))) {
            await client.domain.update({
                where: { id: domainId },
                data: {
                    isVerified: true,
                    sslStatus: "active",
                },
            });

            revalidatePath("/admin/domains");

            return {
                status: 200,
                message: "Domain verified successfully (development mode)",
                details: {
                    aRecord: true,
                    cname: true,
                    message: "Development mode - automatically verified"
                }
            };
        }

        const dnsResult = await verifyDomainDNS(domain.name);

        if (!dnsResult.success) {
            return {
                status: 400,
                message: "DNS verification failed",
                details: dnsResult.details
            };
        }

        await client.domain.update({
            where: { id: domainId },
            data: {
                isVerified: true,
                sslStatus: "active",
            },
        });

        revalidatePath("/admin/domains");

        return {
            status: 200,
            message: "Domain verified successfully!",
            details: dnsResult.details
        };

    } catch (error) {
        console.error("Error verifying domain:", error);
        return {
            status: 500,
            message: "Failed to verify domain",
            details: {
                aRecord: false,
                cname: false,
                message: "Server error during verification"
            }
        };
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
            include: {
                site: {
                    select: {
                        id: true,
                        name: true,
                        isPublished: true,
                    },
                },
            },
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

// Admin fonksiyonları
export const adminGetAllDomains = async () => {
    try {
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();

        if (admin.status !== 200) {
            return { status: admin.status, message: admin.message };
        }

        const domains = await client.domain.findMany({
            where: {
                user: {
                    role: "USER", 
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstname: true,
                        lastname: true,
                        email: true,
                    },
                },
                site: {
                    select: {
                        id: true,
                        name: true,
                        isPublished: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return {
            status: 200,
            domains,
        };
    } catch (error) {
        console.error("[ADMIN_GET_ALL_DOMAINS]", error);
        return {
            status: 500,
            message: "Domainler yüklenirken bir hata oluştu"
        };
    }
};

export const adminAddDomain = async (data: { name: string; siteId: string; userId: string }) => {
    try {
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();

        if (admin.status !== 200) {
            return { status: admin.status, message: admin.message };
        }

        // Check if domain already exists
        const existingDomain = await client.domain.findUnique({
            where: { name: data.name },
        });

        if (existingDomain) {
            return { status: 400, message: "Bu domain zaten sistemde mevcut" };
        }

        // Check if site belongs to user
        const site = await client.site.findFirst({
            where: {
                id: data.siteId,
                userId: data.userId,
            },
        });

        if (!site) {
            return { status: 404, message: "Site bulunamadı" };
        }

        const homePage = await client.page.findFirst({
            where: {
                siteId: site.id,
                isHome: true,
            },
        });

        if (!homePage) {
            return { status: 400, message: "Site ana sayfaya sahip olmalıdır" };
        }

        const verificationId = `linkbuilder-verify-${uuidv4()}`;

        const domain = await client.domain.create({
            data: {
                name: data.name,
                userId: data.userId,
                siteId: data.siteId,
                verificationId: verificationId,
                isVerified: false,
                sslStatus: "pending",
            },
        });

        revalidatePath("/admin/domains");

        return {
            status: 200,
            message: "Domain başarıyla eklendi. DNS ayarlarını yapılandırın.",
            domain,
            verificationId,
        };
    } catch (error) {
        console.error("[ADMIN_ADD_DOMAIN]", error);
        return { status: 500, message: "Domain eklenirken bir hata oluştu" };
    }
};

export const adminDeleteDomain = async (domainId: string) => {
    try {
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();

        if (admin.status !== 200) {
            return { status: admin.status, message: admin.message };
        }

        const domain = await client.domain.findUnique({
            where: { id: domainId },
        });

        if (!domain) {
            return { status: 404, message: "Domain bulunamadı" };
        }

        await client.domain.delete({
            where: { id: domainId },
        });

        revalidatePath("/admin/domains");

        return {
            status: 200,
            message: "Domain başarıyla silindi",
        };
    } catch (error) {
        console.error("[ADMIN_DELETE_DOMAIN]", error);
        return { status: 500, message: "Domain silinirken bir hata oluştu" };
    }
};

export const adminVerifyDomain = async (domainId: string) => {
    try {
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();

        if (admin.status !== 200) {
            return { status: admin.status, message: admin.message };
        }

        const domain = await client.domain.findUnique({
            where: { id: domainId },
        });

        if (!domain) {
            return { status: 404, message: "Domain bulunamadı" };
        }

        // Admin için de DNS verification yap
        const dnsResult = await verifyDomainDNS(domain.name);

        if (!dnsResult.success) {
            return {
                status: 400,
                message: "DNS doğrulaması başarısız",
                details: dnsResult.details
            };
        }

        await client.domain.update({
            where: { id: domainId },
            data: {
                isVerified: true,
                sslStatus: "active",
            },
        });

        revalidatePath("/admin/domains");

        return {
            status: 200,
            message: "Domain başarıyla doğrulandı",
            details: dnsResult.details
        };

    } catch (error) {
        console.error("[ADMIN_VERIFY_DOMAIN]", error);
        return {
            status: 500,
            message: "Domain doğrulanırken bir hata oluştu",
            details: {
                aRecord: false,
                cname: false,
                message: "Server error during verification"
            }
        };
    }
};


// 3. YENİ DNS VERİFİCATİON FONKSİYONLARI EKLE
export const verifyDomainDNS = async (domainName: string) => {
    try {
        console.log(`[DNS] Verifying domain: ${domainName}`);

        // 1. A Record kontrolü (root domain)
        const aRecordValid = await checkARecord(domainName);

        // 2. CNAME kontrolü (www subdomain)  
        const cnameValid = await checkCNAME(`www.${domainName}`);

        console.log(`[DNS] A Record valid: ${aRecordValid}, CNAME valid: ${cnameValid}`);

        // Her ikisi de geçerli olmalı
        const isValid = aRecordValid && cnameValid;

        return {
            success: isValid,
            details: {
                aRecord: aRecordValid,
                cname: cnameValid,
                message: isValid
                    ? "DNS records are correctly configured"
                    : "DNS records are not properly configured"
            }
        };

    } catch (error) {
        console.error(`[DNS] Verification error for ${domainName}:`, error);
        return {
            success: false,
            details: {
                aRecord: false,
                cname: false,
                message: "DNS verification failed - please try again later"
            }
        };
    }
};

const checkARecord = async (domain: string): Promise<boolean> => {
    try {
        const addresses = await dns.resolve4(domain);
        console.log(`[DNS] A records for ${domain}:`, addresses);

        // Expected IP'nin listede olup olmadığını kontrol et
        return addresses.includes(DNS_CONFIG.EXPECTED_A_RECORD);

    } catch (error) {
        console.log(`[DNS] A record not found for ${domain}:`, error);
        return false;
    }
};

const checkCNAME = async (subdomain: string): Promise<boolean> => {
    try {
        const records = await dns.resolveCname(subdomain);
        console.log(`[DNS] CNAME records for ${subdomain}:`, records);

        // Expected CNAME target'ın listede olup olmadığını kontrol et
        return records.some((record: any) => record === DNS_CONFIG.EXPECTED_CNAME_TARGET);

    } catch (error) {
        console.log(`[DNS] CNAME record not found for ${subdomain}:`, error);
        return false;
    }
};

