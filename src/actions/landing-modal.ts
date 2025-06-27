"use server";

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
                enableLandingModal,
                selectedModalId
            },
            update: {
                enableLandingModal,
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

export async function getSiteLandingModalSettings(siteId: string) {
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
        console.error("[GET_SITE_LANDING_MODAL_SETTINGS]", error);
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