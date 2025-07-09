"use server";

import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/lib/prisma";

export async function saveOverlayContent(content: any, overlayId?: string) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            throw new Error("Unauthorized");
        }

        // Get the user's database ID using clerkId
        const user = await client.user.findUnique({
            where: {
                clerkId: clerkUser.id
            }
        });

        if (!user) {
            throw new Error("User not found");
        }

        if (overlayId) {
            // Update existing overlay
            const overlay = await client.landingModal.update({
                where: {
                    id: overlayId,
                    userId: user.id
                },
                data: {
                    content
                }
            });
            return overlay;
        } else {
            // Create new overlay
            const overlay = await client.landingModal.create({
                data: {
                    content,
                    name: "Yeni Overlay",
                    userId: user.id
                }
            });
            return overlay;
        }
    } catch (error) {
        console.error("[SAVE_OVERLAY]", error);
        throw error;
    }
}

export async function getOverlayContent(overlayId?: string) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            throw new Error("Unauthorized");
        }

        // Get the user's database ID using clerkId
        const user = await client.user.findUnique({
            where: {
                clerkId: clerkUser.id
            }
        });

        if (!user) {
            throw new Error("User not found");
        }

        if (overlayId) {
            // Get specific overlay
            const overlay = await client.landingModal.findFirst({
                where: {
                    id: overlayId,
                    userId: user.id
                }
            });
            return overlay;
        } else {
            // Get first overlay (for backward compatibility)
            const overlay = await client.landingModal.findFirst({
                where: {
                    userId: user.id
                }
            });
            return overlay;
        }
    } catch (error) {
        console.error("[GET_OVERLAY]", error);
        throw error;
    }
}

export async function getAllUserOverlays() {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            throw new Error("Unauthorized");
        }

        // Get the user's database ID using clerkId
        const user = await client.user.findUnique({
            where: {
                clerkId: clerkUser.id
            }
        });

        if (!user) {
            throw new Error("User not found");
        }

        const overlays = await client.landingModal.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return {
            status: 200,
            overlays
        };
    } catch (error) {
        console.error("[GET_ALL_USER_OVERLAYS]", error);
        return {
            status: 500,
            message: "Overlay'lar yüklenirken bir hata oluştu"
        };
    }
}

export async function createOverlayFromTemplate(name: string, templateContent: any) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            throw new Error("Unauthorized");
        }

        // Get the user's database ID using clerkId
        const user = await client.user.findUnique({
            where: {
                clerkId: clerkUser.id
            }
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Check if overlay with same name exists
        const existingOverlay = await client.landingModal.findFirst({
            where: {
                name: name,
                userId: user.id
            }
        });

        if (existingOverlay) {
            return {
                status: 400,
                message: `"${name}" isimli bir overlay zaten mevcut`
            };
        }

        // Check if page with same title exists
        const existingPage = await client.page.findFirst({
            where: {
                title: name,
                site: {
                    userId: user.id
                }
            }
        });

        if (existingPage) {
            return {
                status: 400,
                message: `"${name}" isimli bir sayfa zaten mevcut`
            };
        }

        const overlay = await client.landingModal.create({
            data: {
                name,
                content: templateContent,
                userId: user.id
            }
        });

        return {
            status: 200,
            overlay
        };
    } catch (error) {
        console.error("[CREATE_OVERLAY_FROM_TEMPLATE]", error);
        return {
            status: 500,
            message: "Overlay oluşturulurken bir hata oluştu"
        };
    }
}

export async function updateOverlayName(overlayId: string, name: string) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            throw new Error("Unauthorized");
        }

        // Get the user's database ID using clerkId
        const user = await client.user.findUnique({
            where: {
                clerkId: clerkUser.id
            }
        });

        if (!user) {
            throw new Error("User not found");
        }

        const overlay = await client.landingModal.update({
            where: {
                id: overlayId,
                userId: user.id
            },
            data: {
                name
            }
        });

        return {
            status: 200,
            overlay
        };
    } catch (error) {
        console.error("[UPDATE_OVERLAY_NAME]", error);
        return {
            status: 500,
            message: "Overlay adı güncellenirken bir hata oluştu"
        };
    }
}

export async function deleteOverlay(overlayId: string) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            throw new Error("Unauthorized");
        }

        // Get the user's database ID using clerkId
        const user = await client.user.findUnique({
            where: {
                clerkId: clerkUser.id
            }
        });

        if (!user) {
            throw new Error("User not found");
        }

        await client.landingModal.delete({
            where: {
                id: overlayId,
                userId: user.id
            }
        });

        return {
            status: 200,
            message: "Overlay başarıyla silindi"
        };
    } catch (error) {
        console.error("[DELETE_OVERLAY]", error);
        return {
            status: 500,
            message: "Overlay silinirken bir hata oluştu"
        };
    }
}

export async function updateSiteOverlaySettings(siteId: string, settings: {
    enableOverlay?: boolean;
    selectedOverlayId?: string;
    selectedCardId?: string;
    liveStreamLink?: string;
    title?: string;
    favicon?: string;
    googleAnalyticsId?: string;
}) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            throw new Error("Unauthorized");
        }

        // Get the user's database ID using clerkId
        const user = await client.user.findUnique({
            where: {
                clerkId: clerkUser.id
            }
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Verify site belongs to user
        const site = await client.site.findFirst({
            where: {
                id: siteId,
                userId: user.id
            }
        });

        if (!site) {
            throw new Error("Site not found");
        }

        const result = await client.siteSettings.upsert({
            where: {
                siteId: siteId
            },
            create: {
                siteId: siteId,
                enableOverlay: settings.enableOverlay ?? false,
                overlayType: 'LANDING_MODAL', // Keep for backward compatibility
                selectedModalId: settings.selectedOverlayId ?? null,
                selectedCardId: settings.selectedCardId ?? null,
                liveStreamLink: settings.liveStreamLink ?? null,
                title: settings.title ?? null,
                favicon: settings.favicon ?? null,
                googleAnalyticsId: settings.googleAnalyticsId ?? null
            },
            update: {
                enableOverlay: settings.enableOverlay ?? false,
                selectedModalId: settings.selectedOverlayId ?? null,
                selectedCardId: settings.selectedCardId ?? null,
                liveStreamLink: settings.liveStreamLink ?? null,
                title: settings.title ?? null,
                favicon: settings.favicon ?? null,
                googleAnalyticsId: settings.googleAnalyticsId ?? null
            }
        });

        return {
            status: 200,
            settings: result
        };
    } catch (error) {
        console.error("[UPDATE_SITE_OVERLAY_SETTINGS]", error);
        return {
            status: 500,
            message: "Site ayarları güncellenirken bir hata oluştu"
        };
    }
}

export async function getSiteOverlaySettings(siteId: string) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            throw new Error("Unauthorized");
        }

        // Get the user's database ID using clerkId
        const user = await client.user.findUnique({
            where: {
                clerkId: clerkUser.id
            }
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Verify site belongs to user
        const site = await client.site.findFirst({
            where: {
                id: siteId,
                userId: user.id
            }
        });

        if (!site) {
            throw new Error("Site not found");
        }

        const settings = await client.siteSettings.findUnique({
            where: {
                siteId: siteId
            }
        });

        return {
            status: 200,
            settings
        };
    } catch (error) {
        console.error("[GET_SITE_OVERLAY_SETTINGS]", error);
        return {
            status: 500,
            message: "Site ayarları yüklenirken bir hata oluştu"
        };
    }
}

// Public action for getting site overlay settings (no authentication required)
export async function getPublicSiteOverlaySettings(siteId: string) {
    try {
        if (!siteId) {
            throw new Error("Site ID is required");
        }

        // Get site settings without authentication
        const settings = await client.siteSettings.findUnique({
            where: {
                siteId: siteId
            }
        });

        return {
            status: 200,
            settings
        };
    } catch (error) {
        console.error("[GET_PUBLIC_SITE_OVERLAY_SETTINGS]", error);
        return {
            status: 500,
            message: "Site ayarları yüklenirken bir hata oluştu"
        };
    }
}

// Public action for getting overlay content (no authentication required)
export async function getPublicOverlayContent(overlayId: string) {
    try {
        if (!overlayId) {
            throw new Error("Overlay ID is required");
        }

        // Get overlay content without authentication
        const overlay = await client.landingModal.findUnique({
            where: {
                id: overlayId,
                isEnabled: true // Only get enabled overlays
            }
        });

        return overlay;
    } catch (error) {
        console.error("[GET_PUBLIC_OVERLAY]", error);
        throw error;
    }
}

// Admin functions
export async function adminGetAllUserOverlays() {
    try {
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();

        if (admin.status !== 200) {
            return { status: admin.status, message: admin.message };
        }

        const overlays = await client.landingModal.findMany({
            where: {
                user: {
                    role: "USER"
                }
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
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return {
            status: 200,
            overlays
        };
    } catch (error) {
        console.error("[ADMIN_GET_ALL_USER_OVERLAYS]", error);
        return {
            status: 500,
            message: "Overlay'lar yüklenirken bir hata oluştu"
        };
    }
}

export async function adminGetOverlayContent(overlayId: string) {
    try {
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();

        if (admin.status !== 200) {
            return { status: admin.status, message: admin.message };
        }

        const overlay = await client.landingModal.findFirst({
            where: {
                id: overlayId,
                user: {
                    role: "USER"
                }
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
            },
        });

        if (!overlay) {
            return { status: 404, message: "Overlay bulunamadı" };
        }

        return {
            status: 200,
            modal: overlay // Keep 'modal' key for backward compatibility
        };
    } catch (error) {
        console.error("[ADMIN_GET_OVERLAY_CONTENT]", error);
        return {
            status: 500,
            message: "Overlay içeriği yüklenirken bir hata oluştu"
        };
    }
}

export async function adminDeleteOverlay(overlayId: string) {
    try {
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();

        if (admin.status !== 200) {
            return { status: admin.status, message: admin.message };
        }

        // Overlay'ı bul
        const overlay = await client.landingModal.findUnique({
            where: { id: overlayId }
        });

        if (!overlay) {
            return {
                status: 404,
                message: "Overlay bulunamadı"
            };
        }

        // Overlay'ı sil
        await client.landingModal.delete({
            where: { id: overlayId }
        });

        return {
            status: 200,
            message: "Overlay başarıyla silindi"
        };
    } catch (error) {
        console.error("[ADMIN_DELETE_OVERLAY]", error);
        return {
            status: 500,
            message: "Overlay silinirken bir hata oluştu"
        };
    }
}

export async function adminUpdateOverlayName(overlayId: string, name: string) {
    try {
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();

        if (admin.status !== 200) {
            return { status: admin.status, message: admin.message };
        }

        // Overlay'ı güncelle
        const overlay = await client.landingModal.update({
            where: { id: overlayId },
            data: { name }
        });

        return {
            status: 200,
            message: "Overlay adı başarıyla güncellendi",
            overlay
        };
    } catch (error) {
        console.error("[ADMIN_UPDATE_OVERLAY_NAME]", error);
        return {
            status: 500,
            message: "Overlay adı güncellenirken bir hata oluştu"
        };
    }
}

export async function adminCreateOverlayFromTemplate(
    name: string,
    templateContent: any,
    userId: string
) {
    try {
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();

        if (admin.status !== 200) {
            console.error("[ADMIN_CREATE_OVERLAY_FROM_TEMPLATE] Admin check failed:", admin);
            return { status: admin.status, message: admin.message };
        }

        console.log("[ADMIN_CREATE_OVERLAY_FROM_TEMPLATE] Creating overlay for user:", userId);
        console.log("[ADMIN_CREATE_OVERLAY_FROM_TEMPLATE] Overlay name:", name);
        console.log("[ADMIN_CREATE_OVERLAY_FROM_TEMPLATE] Template content type:", typeof templateContent);

        // Kullanıcının var olduğunu kontrol et
        const user = await client.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            console.error("[ADMIN_CREATE_OVERLAY_FROM_TEMPLATE] User not found:", userId);
            return {
                status: 404,
                message: "Kullanıcı bulunamadı"
            };
        }

        console.log("[ADMIN_CREATE_OVERLAY_FROM_TEMPLATE] User found:", user.email);

        // Check if overlay with same name exists
        const existingOverlay = await client.landingModal.findFirst({
            where: {
                name: name,
                userId: userId
            }
        });

        if (existingOverlay) {
            console.error("[ADMIN_CREATE_OVERLAY_FROM_TEMPLATE] Overlay with same name exists:", name);
            return {
                status: 400,
                message: `"${name}" isimli bir overlay zaten mevcut`
            };
        }

        // Check if page with same title exists
        const existingPage = await client.page.findFirst({
            where: {
                title: name,
                site: {
                    userId: userId
                }
            }
        });

        if (existingPage) {
            console.error("[ADMIN_CREATE_OVERLAY_FROM_TEMPLATE] Page with same title exists:", name);
            return {
                status: 400,
                message: `"${name}" isimli bir sayfa zaten mevcut`
            };
        }

        // Overlay oluştur
        const overlay = await client.landingModal.create({
            data: {
                name,
                content: templateContent,
                userId: userId
            }
        });

        console.log("[ADMIN_CREATE_OVERLAY_FROM_TEMPLATE] Overlay created successfully:", overlay.id);

        return {
            status: 200,
            message: "Overlay başarıyla oluşturuldu",
            overlay
        };
    } catch (error) {
        console.error("[ADMIN_CREATE_OVERLAY_FROM_TEMPLATE] Error details:", {
            error: error,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            name: name,
            userId: userId,
            templateContentType: typeof templateContent
        });
        return {
            status: 500,
            message: `Overlay oluşturulurken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
        };
    }
}

// Backward compatibility - alias for adminGetOverlayContent
export const adminGetLandingModalContent = adminGetOverlayContent;