/* "use server";

import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/lib/prisma";

export async function saveLandingModalContent(content: any, modalId?: string) {
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

        if (modalId) {
            // Update existing modal
            const landingModal = await client.landingModal.update({
                where: {
                    id: modalId,
                    userId: user.id
                },
                data: {
                    content
                }
            });
            return landingModal;
        } else {
            // Create new modal
            const landingModal = await client.landingModal.create({
                data: {
                    content,
                    name: "Yeni Modal",
                    userId: user.id
                }
            });
            return landingModal;
        }
    } catch (error) {
        console.error("[SAVE_LANDING_MODAL]", error);
        throw error;
    }
}

export async function getLandingModalContent(modalId?: string) {
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

        if (modalId) {
            // Get specific modal
            const landingModal = await client.landingModal.findFirst({
                where: {
                    id: modalId,
                    userId: user.id
                }
            });
            return landingModal;
        } else {
            // Get first modal (for backward compatibility)
            const landingModal = await client.landingModal.findFirst({
                where: {
                    userId: user.id
                }
            });
            return landingModal;
        }
    } catch (error) {
        console.error("[GET_LANDING_MODAL]", error);
        throw error;
    }
}

export async function getAllUserModals() {
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

        const modals = await client.landingModal.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return {
            status: 200,
            modals
        };
    } catch (error) {
        console.error("[GET_ALL_USER_MODALS]", error);
        return {
            status: 500,
            message: "Modallar yüklenirken bir hata oluştu"
        };
    }
}

export async function createModalFromTemplate(name: string, templateContent: any) {
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

        // Check if modal with same name exists
        const existingModal = await client.landingModal.findFirst({
            where: {
                name: name,
                userId: user.id
            }
        });

        if (existingModal) {
            return {
                status: 400,
                message: `"${name}" isimli bir modal zaten mevcut`
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

        const modal = await client.landingModal.create({
            data: {
                name,
                content: templateContent,
                userId: user.id
            }
        });

        return {
            status: 200,
            modal
        };
    } catch (error) {
        console.error("[CREATE_MODAL_FROM_TEMPLATE]", error);
        return {
            status: 500,
            message: "Modal oluşturulurken bir hata oluştu"
        };
    }
}

export async function updateModalName(modalId: string, name: string) {
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

        const modal = await client.landingModal.update({
            where: {
                id: modalId,
                userId: user.id
            },
            data: {
                name
            }
        });

        return {
            status: 200,
            modal
        };
    } catch (error) {
        console.error("[UPDATE_MODAL_NAME]", error);
        return {
            status: 500,
            message: "Modal adı güncellenirken bir hata oluştu"
        };
    }
}

export async function deleteModal(modalId: string) {
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
                id: modalId,
                userId: user.id
            }
        });

        return {
            status: 200,
            message: "Modal başarıyla silindi"
        };
    } catch (error) {
        console.error("[DELETE_MODAL]", error);
        return {
            status: 500,
            message: "Modal silinirken bir hata oluştu"
        };
    }
}

export async function updateSiteLandingModalSettings(siteId: string, enableLandingModal: boolean, selectedModalId?: string) {
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

        const settings = await client.siteSettings.upsert({
            where: {
                siteId: siteId
            },
            create: {
                siteId: siteId,
                enableOverlay: enableLandingModal,
                overlayType: 'LANDING_MODAL',
                selectedModalId
            },
            update: {
                enableOverlay: enableLandingModal,
                overlayType: 'LANDING_MODAL',
                selectedModalId
            }
        });

        return {
            status: 200,
            settings
        };
    } catch (error) {
        console.error("[UPDATE_SITE_LANDING_MODAL_SETTINGS]", error);
        return {
            status: 500,
            message: "Site ayarları güncellenirken bir hata oluştu"
        };
    }
}

export async function updateSiteSettings(siteId: string, settings: {
    enableOverlay?: boolean;
    overlayType?: 'LANDING_MODAL' | 'LIVE_STREAM_CARD';
    selectedModalId?: string;
    selectedCardId?: string;
    liveStreamLink?: string;
    title?: string;
    favicon?: string;
    googleAnalyticsId?: string;
    // Backward compatibility
    enableLandingModal?: boolean;
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

        // Handle backward compatibility and new overlay fields
        const enableOverlay = settings.enableOverlay ?? settings.enableLandingModal ?? false;
        const overlayType = settings.overlayType ?? 'LANDING_MODAL';

        const result = await client.siteSettings.upsert({
            where: {
                siteId: siteId
            },
            create: {
                siteId: siteId,
                enableOverlay: enableOverlay,
                overlayType: overlayType,
                selectedModalId: settings.selectedModalId ?? null,
                selectedCardId: settings.selectedCardId ?? null,
                liveStreamLink: settings.liveStreamLink ?? null,
                title: settings.title ?? null,
                favicon: settings.favicon ?? null,
                googleAnalyticsId: settings.googleAnalyticsId ?? null
            },
            update: {
                enableOverlay: enableOverlay,
                overlayType: overlayType,
                selectedModalId: settings.selectedModalId ?? null,
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
        console.error("[UPDATE_SITE_SETTINGS]", error);
        console.error("Error details:", {
            siteId,
            settings,
            error: error instanceof Error ? error.message : error
        });
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

        // Add backward compatibility fields
        const compatibleSettings = settings ? {
            ...settings,
            enableLandingModal: settings.enableOverlay && settings.overlayType === 'LANDING_MODAL'
        } : null;

        return {
            status: 200,
            settings: compatibleSettings
        };
    } catch (error) {
        console.error("[GET_SITE_OVERLAY_SETTINGS]", error);
        return {
            status: 500,
            message: "Site ayarları yüklenirken bir hata oluştu"
        };
    }
}

// Backward compatibility function
export async function getSiteLandingModalSettings(siteId: string) {
    return getSiteOverlaySettings(siteId);
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

        // Add backward compatibility fields
        const compatibleSettings = settings ? {
            ...settings,
            enableLandingModal: settings.enableOverlay && settings.overlayType === 'LANDING_MODAL'
        } : null;

        return {
            status: 200,
            settings: compatibleSettings
        };
    } catch (error) {
        console.error("[GET_PUBLIC_SITE_OVERLAY_SETTINGS]", error);
        return {
            status: 500,
            message: "Site ayarları yüklenirken bir hata oluştu"
        };
    }
}

// Public action for getting landing modal content (no authentication required)
export async function getPublicLandingModalContent(modalId: string) {
    try {
        if (!modalId) {
            throw new Error("Modal ID is required");
        }

        // Get modal content without authentication
        const landingModal = await client.landingModal.findUnique({
            where: {
                id: modalId,
                isEnabled: true // Only get enabled modals
            }
        });

        return landingModal;
    } catch (error) {
        console.error("[GET_PUBLIC_LANDING_MODAL]", error);
        throw error;
    }
}

// Admin fonksiyonları
export async function adminGetAllUserModals() {
    try {
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();

        if (admin.status !== 200) {
            return { status: admin.status, message: admin.message };
        }

        const modals = await client.landingModal.findMany({
            where: {
                user: {
                    role: "USER" // Sadece normal kullanıcıların modallarını getir
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
            modals
        };
    } catch (error) {
        console.error("[ADMIN_GET_ALL_USER_MODALS]", error);
        return {
            status: 500,
            message: "Modallar yüklenirken bir hata oluştu"
        };
    }
}

export async function getUsersWithoutModals() {
    try {
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();

        if (admin.status !== 200) {
            return { status: admin.status, message: admin.message };
        }

        // Tüm kullanıcıları getir
        const allUsers = await client.user.findMany({
            where: {
                role: "USER" // Sadece normal kullanıcıları getir
            },
            include: {
                landingModals: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Modalı olmayan kullanıcıları filtrele
        const usersWithoutModals = allUsers.filter(user => user.landingModals.length === 0);

        return {
            status: 200,
            users: usersWithoutModals
        };
    } catch (error) {
        console.error("[GET_USERS_WITHOUT_MODALS]", error);
        return {
            status: 500,
            message: "Kullanıcı bilgileri yüklenirken bir hata oluştu"
        };
    }
}

export async function adminGetUserModals(userId: string) {
    try {
        console.log("[BACKEND] adminGetUserModals called with userId:", userId);
        
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();
        console.log("[BACKEND] Admin check result:", admin);

        if (admin.status !== 200) {
            console.error("[BACKEND] Admin check failed:", admin);
            return { status: admin.status, message: admin.message };
        }

        console.log("[BACKEND] Querying modals for userId:", userId);
        const modals = await client.landingModal.findMany({
            where: {
                userId: userId,
                user: {
                    role: "USER" // Sadece normal kullanıcıların modallarını getir
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

        console.log("[BACKEND] Found modals:", modals.length, "for user:", userId);

        return {
            status: 200,
            modals
        };
    } catch (error) {
        console.error("[BACKEND] Error in adminGetUserModals:", {
            error,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            userId: userId
        });
        return {
            status: 500,
            message: "Kullanıcı modalları yüklenirken bir hata oluştu"
        };
    }
}

export async function adminGetLandingModalContent(modalId: string) {
    try {
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();

        if (admin.status !== 200) {
            return { status: admin.status, message: admin.message };
        }

        const modal = await client.landingModal.findFirst({
            where: {
                id: modalId,
                user: {
                    role: "USER" // Sadece normal kullanıcıların modallarını getir
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

        if (!modal) {
            return { status: 404, message: "Modal bulunamadı" };
        }

        return {
            status: 200,
            modal
        };
    } catch (error) {
        console.error("[ADMIN_GET_LANDING_MODAL_CONTENT]", error);
        return {
            status: 500,
            message: "Modal içeriği yüklenirken bir hata oluştu"
        };
    }
}

export async function adminGetSiteLandingModalSettings(siteId: string) {
    try {
        console.log("[BACKEND] adminGetSiteLandingModalSettings called with siteId:", siteId);
        
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();
        console.log("[BACKEND] Admin check result for site settings:", admin);

        if (admin.status !== 200) {
            console.error("[BACKEND] Admin check failed for site settings:", admin);
            return { status: admin.status, message: admin.message };
        }

        console.log("[BACKEND] Querying site settings for siteId:", siteId);
        const settings = await client.siteSettings.findUnique({
            where: {
                siteId: siteId
            },
            include: {
                site: {
                    select: {
                        name: true,
                        user: {
                            select: {
                                firstname: true,
                                lastname: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        console.log("[BACKEND] Site settings result:", settings);

        return {
            status: 200,
            settings
        };
    } catch (error) {
        console.error("[BACKEND] Error in adminGetSiteLandingModalSettings:", {
            error,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            siteId: siteId
        });
        return {
            status: 500,
            message: "Site ayarları yüklenirken bir hata oluştu"
        };
    }
}

export async function adminUpdateSiteLandingModalSettings(siteId: string, enableLandingModal: boolean, selectedModalId?: string) {
    try {
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();

        if (admin.status !== 200) {
            return { status: admin.status, message: admin.message };
        }

        // Site'in var olduğunu kontrol et
        const site = await client.site.findUnique({
            where: {
                id: siteId
            }
        });

        if (!site) {
            return {
                status: 404,
                message: "Site bulunamadı"
            };
        }

        // Site ayarlarını güncelle veya oluştur
        const settings = await client.siteSettings.upsert({
            where: {
                siteId: siteId
            },
            update: {
                enableOverlay: enableLandingModal,
                overlayType: 'LANDING_MODAL',
                selectedModalId: enableLandingModal ? selectedModalId : null
            },
            create: {
                siteId: siteId,
                enableOverlay: enableLandingModal,
                overlayType: 'LANDING_MODAL',
                selectedModalId: enableLandingModal ? selectedModalId : null
            }
        });

        return {
            status: 200,
            message: "Site ayarları başarıyla güncellendi",
            settings
        };
    } catch (error) {
        console.error("[ADMIN_UPDATE_SITE_LANDING_MODAL_SETTINGS]", error);
        return {
            status: 500,
            message: "Site ayarları güncellenirken bir hata oluştu"
        };
    }
}

export async function adminDeleteModal(modalId: string) {
    try {
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();

        if (admin.status !== 200) {
            return { status: admin.status, message: admin.message };
        }

        // Modal'ı bul
        const modal = await client.landingModal.findUnique({
            where: { id: modalId }
        });

        if (!modal) {
            return {
                status: 404,
                message: "Modal bulunamadı"
            };
        }

        // Modal'ı sil
        await client.landingModal.delete({
            where: { id: modalId }
        });

        return {
            status: 200,
            message: "Modal başarıyla silindi"
        };
    } catch (error) {
        console.error("[ADMIN_DELETE_MODAL]", error);
        return {
            status: 500,
            message: "Modal silinirken bir hata oluştu"
        };
    }
}

export async function adminUpdateModalName(modalId: string, name: string) {
    try {
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();

        if (admin.status !== 200) {
            return { status: admin.status, message: admin.message };
        }

        // Modal'ı güncelle
        const modal = await client.landingModal.update({
            where: { id: modalId },
            data: { name }
        });

        return {
            status: 200,
            message: "Modal adı başarıyla güncellendi",
            modal
        };
    } catch (error) {
        console.error("[ADMIN_UPDATE_MODAL_NAME]", error);
        return {
            status: 500,
            message: "Modal adı güncellenirken bir hata oluştu"
        };
    }
}

export async function adminCreateModalFromTemplate(
    name: string, 
    templateContent: any, 
    userId: string
) {
    try {
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();

        if (admin.status !== 200) {
            console.error("[ADMIN_CREATE_MODAL_FROM_TEMPLATE] Admin check failed:", admin);
            return { status: admin.status, message: admin.message };
        }

        console.log("[ADMIN_CREATE_MODAL_FROM_TEMPLATE] Creating modal for user:", userId);
        console.log("[ADMIN_CREATE_MODAL_FROM_TEMPLATE] Modal name:", name);
        console.log("[ADMIN_CREATE_MODAL_FROM_TEMPLATE] Template content type:", typeof templateContent);

        // Kullanıcının var olduğunu kontrol et
        const user = await client.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            console.error("[ADMIN_CREATE_MODAL_FROM_TEMPLATE] User not found:", userId);
            return {
                status: 404,
                message: "Kullanıcı bulunamadı"
            };
        }

        console.log("[ADMIN_CREATE_MODAL_FROM_TEMPLATE] User found:", user.email);

        // Check if modal with same name exists
        const existingModal = await client.landingModal.findFirst({
            where: {
                name: name,
                userId: userId
            }
        });

        if (existingModal) {
            console.error("[ADMIN_CREATE_MODAL_FROM_TEMPLATE] Modal with same name exists:", name);
            return {
                status: 400,
                message: `"${name}" isimli bir modal zaten mevcut`
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
            console.error("[ADMIN_CREATE_MODAL_FROM_TEMPLATE] Page with same title exists:", name);
            return {
                status: 400,
                message: `"${name}" isimli bir sayfa zaten mevcut`
            };
        }

        // Modal oluştur
        const modal = await client.landingModal.create({
            data: {
                name,
                content: templateContent,
                userId: userId
            }
        });

        console.log("[ADMIN_CREATE_MODAL_FROM_TEMPLATE] Modal created successfully:", modal.id);

        return {
            status: 200,
            message: "Modal başarıyla oluşturuldu",
            modal
        };
    } catch (error) {
        console.error("[ADMIN_CREATE_MODAL_FROM_TEMPLATE] Error details:", {
            error: error,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            name: name,
            userId: userId,
            templateContentType: typeof templateContent
        });
        return {
            status: 500,
            message: `Modal oluşturulurken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
        };
    }
}  */