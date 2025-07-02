// src/actions/domain.ts
"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

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

        // For localhost testing, automatically verify
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
            };
        }

        // Simple DNS check - in production, you'd implement proper DNS verification
        // For now, we'll mark as verified for testing
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
            message: "Domain verified successfully",
        };
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

export const getDnsInstructions = async (domainName: string) => {
    try {
        const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost:3000";

        return {
            status: 200,
            instructions: {
                cname: {
                    type: "CNAME",
                    name: "www",
                    value: appDomain,
                    description: "Point www subdomain to our servers",
                },
                a: {
                    type: "A",
                    name: "@",
                    value: "127.0.0.1", // In production, use your server IP
                    description: "Point root domain to our servers",
                },
                verification: {
                    type: "TXT",
                    name: "_linkbuilder-verify",
                    description: "Domain ownership verification",
                },
            },
            domain: domainName,
        };
    } catch (error) {
        console.error("Error getting DNS instructions:", error);
        return {
            status: 500,
            message: "Failed to get DNS instructions",
        };
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
                    role: "USER", // Sadece normal kullanıcıların domainlerini getir
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

        // Check if site has a homepage
        const homePage = await client.page.findFirst({
            where: {
                siteId: site.id,
                isHome: true,
            },
        });

        if (!homePage) {
            return { status: 400, message: "Site ana sayfaya sahip olmalıdır" };
        }

        // Create domain with verification ID
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
        };
    } catch (error) {
        console.error("[ADMIN_VERIFY_DOMAIN]", error);
        return { status: 500, message: "Domain doğrulanırken bir hata oluştu" };
    }
};
