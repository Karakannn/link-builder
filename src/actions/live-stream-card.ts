"use server";

import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/lib/prisma";

export async function saveLiveStreamCardContent(content: any, cardId?: string) {
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

        if (cardId) {
            // Update existing card
            const liveStreamCard = await client.liveStreamCard.update({
                where: {
                    id: cardId,
                    userId: user.id
                },
                data: {
                    content
                }
            });
            return liveStreamCard;
        } else {
            // Create new card
            const liveStreamCard = await client.liveStreamCard.create({
                data: {
                    content,
                    name: "Yeni Stream Card",
                    userId: user.id
                }
            });
            return liveStreamCard;
        }
    } catch (error) {
        console.error("[SAVE_LIVE_STREAM_CARD]", error);
        throw error;
    }
}

export async function getLiveStreamCardContent(cardId?: string) {
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

        if (cardId) {
            // Get specific card
            const liveStreamCard = await client.liveStreamCard.findFirst({
                where: {
                    id: cardId,
                    userId: user.id
                }
            });
            return liveStreamCard;
        } else {
            // Get first card (for backward compatibility)
            const liveStreamCard = await client.liveStreamCard.findFirst({
                where: {
                    userId: user.id
                }
            });
            return liveStreamCard;
        }
    } catch (error) {
        console.error("[GET_LIVE_STREAM_CARD]", error);
        throw error;
    }
}

export async function getAllUserLiveStreamCards() {
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

        const cards = await client.liveStreamCard.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return {
            status: 200,
            cards
        };
    } catch (error) {
        console.error("[GET_ALL_USER_LIVE_STREAM_CARDS]", error);
        return {
            status: 500,
            message: "Stream card'lar yüklenirken bir hata oluştu"
        };
    }
}

export async function createLiveStreamCardFromTemplate(name: string, templateContent: any) {
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

        // Check if card with same name exists
        const existingCard = await client.liveStreamCard.findFirst({
            where: {
                name: name,
                userId: user.id
            }
        });

        if (existingCard) {
            return {
                status: 400,
                message: `"${name}" isimli bir stream card zaten mevcut`
            };
        }



        const card = await client.liveStreamCard.create({
            data: {
                name,
                content: templateContent,
                userId: user.id
            }
        });

        return {
            status: 200,
            card
        };
    } catch (error) {
        console.error("[CREATE_LIVE_STREAM_CARD_FROM_TEMPLATE]", error);
        return {
            status: 500,
            message: "Stream card oluşturulurken bir hata oluştu"
        };
    }
}

export async function updateLiveStreamCardName(cardId: string, name: string) {
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

        // Check if card with same name exists
        const existingCard = await client.liveStreamCard.findFirst({
            where: {
                name: name,
                userId: user.id,
                id: {
                    not: cardId
                }
            }
        });

        if (existingCard) {
            return {
                status: 400,
                message: `"${name}" isimli bir stream card zaten mevcut`
            };
        }

        const card = await client.liveStreamCard.update({
            where: {
                id: cardId,
                userId: user.id
            },
            data: {
                name
            }
        });

        return {
            status: 200,
            card
        };
    } catch (error) {
        console.error("[UPDATE_LIVE_STREAM_CARD_NAME]", error);
        return {
            status: 500,
            message: "Stream card adı güncellenirken bir hata oluştu"
        };
    }
}

export async function deleteLiveStreamCard(cardId: string) {
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

        const card = await client.liveStreamCard.delete({
            where: {
                id: cardId,
                userId: user.id
            }
        });

        return {
            status: 200,
            card
        };
    } catch (error) {
        console.error("[DELETE_LIVE_STREAM_CARD]", error);
        return {
            status: 500,
            message: "Stream card silinirken bir hata oluştu"
        };
    }
}

export async function getPublicLiveStreamCardContent(cardId: string) {
    try {
        const card = await client.liveStreamCard.findUnique({
            where: {
                id: cardId
            }
        });

        if (!card) {
            return {
                status: 404,
                message: "Stream card bulunamadı"
            };
        }

        return {
            status: 200,
            card
        };
    } catch (error) {
        console.error("[GET_PUBLIC_LIVE_STREAM_CARD]", error);
        return {
            status: 500,
            message: "Stream card yüklenirken bir hata oluştu"
        };
    }
}

export async function getLiveStreamCardsByUserId(userId: string) {
    try {
        if (!userId) {
            return {
                status: 400,
                message: "User ID is required"
            };
        }

        const cards = await client.liveStreamCard.findMany({
            where: {
                userId: userId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return {
            status: 200,
            cards
        };
    } catch (error) {
        console.error("[GET_LIVE_STREAM_CARDS_BY_USER_ID]", error);
        return {
            status: 500,
            message: "Stream card'lar yüklenirken bir hata oluştu"
        };
    }
}

// Admin functions
export async function adminGetAllUserLiveStreamCards() {
    try {
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();

        if (admin.status !== 200) {
            return { status: admin.status, message: admin.message };
        }

        const cards = await client.liveStreamCard.findMany({
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
            cards
        };
    } catch (error) {
        console.error("[ADMIN_GET_ALL_USER_LIVE_STREAM_CARDS]", error);
        return {
            status: 500,
            message: "Stream card'lar yüklenirken bir hata oluştu"
        };
    }
}

export async function adminGetLiveStreamCardContent(cardId: string) {
    try {
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();

        if (admin.status !== 200) {
            return { status: admin.status, message: admin.message };
        }

        const card = await client.liveStreamCard.findFirst({
            where: {
                id: cardId,
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

        if (!card) {
            return { status: 404, message: "Stream card bulunamadı" };
        }

        return {
            status: 200,
            card
        };
    } catch (error) {
        console.error("[ADMIN_GET_LIVE_STREAM_CARD_CONTENT]", error);
        return {
            status: 500,
            message: "Stream card içeriği yüklenirken bir hata oluştu"
        };
    }
}

export async function adminDeleteLiveStreamCard(cardId: string) {
    try {
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();

        if (admin.status !== 200) {
            return { status: admin.status, message: admin.message };
        }

        // Stream card'ı bul
        const card = await client.liveStreamCard.findUnique({
            where: { id: cardId }
        });

        if (!card) {
            return {
                status: 404,
                message: "Stream card bulunamadı"
            };
        }

        // Stream card'ı sil
        await client.liveStreamCard.delete({
            where: { id: cardId }
        });

        return {
            status: 200,
            message: "Stream card başarıyla silindi"
        };
    } catch (error) {
        console.error("[ADMIN_DELETE_LIVE_STREAM_CARD]", error);
        return {
            status: 500,
            message: "Stream card silinirken bir hata oluştu"
        };
    }
}

export async function adminUpdateLiveStreamCardName(cardId: string, name: string) {
    try {
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();

        if (admin.status !== 200) {
            return { status: admin.status, message: admin.message };
        }

        // Stream card'ı güncelle
        const card = await client.liveStreamCard.update({
            where: { id: cardId },
            data: { name }
        });

        return {
            status: 200,
            message: "Stream card adı başarıyla güncellendi",
            card
        };
    } catch (error) {
        console.error("[ADMIN_UPDATE_LIVE_STREAM_CARD_NAME]", error);
        return {
            status: 500,
            message: "Stream card adı güncellenirken bir hata oluştu"
        };
    }
}

export async function adminCreateLiveStreamCardFromTemplate(
    name: string, 
    templateContent: any, 
    userId: string
) {
    try {
        const { onAdminUser } = await import("./auth");
        const admin = await onAdminUser();

        if (admin.status !== 200) {
            console.error("[ADMIN_CREATE_LIVE_STREAM_CARD_FROM_TEMPLATE] Admin check failed:", admin);
            return { status: admin.status, message: admin.message };
        }

        console.log("[ADMIN_CREATE_LIVE_STREAM_CARD_FROM_TEMPLATE] Creating stream card for user:", userId);
        console.log("[ADMIN_CREATE_LIVE_STREAM_CARD_FROM_TEMPLATE] Card name:", name);
        console.log("[ADMIN_CREATE_LIVE_STREAM_CARD_FROM_TEMPLATE] Template content type:", typeof templateContent);

        // Kullanıcının var olduğunu kontrol et
        const user = await client.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            console.error("[ADMIN_CREATE_LIVE_STREAM_CARD_FROM_TEMPLATE] User not found:", userId);
            return {
                status: 404,
                message: "Kullanıcı bulunamadı"
            };
        }

        console.log("[ADMIN_CREATE_LIVE_STREAM_CARD_FROM_TEMPLATE] User found:", user.email);

        // Check if card with same name exists
        const existingCard = await client.liveStreamCard.findFirst({
            where: {
                name: name,
                userId: userId
            }
        });

        if (existingCard) {
            console.error("[ADMIN_CREATE_LIVE_STREAM_CARD_FROM_TEMPLATE] Card with same name exists:", name);
            return {
                status: 400,
                message: `"${name}" isimli bir stream card zaten mevcut`
            };
        }



        // Stream card oluştur
        const card = await client.liveStreamCard.create({
            data: {
                name,
                content: templateContent,
                userId: userId
            }
        });

        console.log("[ADMIN_CREATE_LIVE_STREAM_CARD_FROM_TEMPLATE] Stream card created successfully:", card.id);

        return {
            status: 200,
            message: "Stream card başarıyla oluşturuldu",
            card
        };
    } catch (error) {
        console.error("[ADMIN_CREATE_LIVE_STREAM_CARD_FROM_TEMPLATE] Error details:", {
            error: error,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            name: name,
            userId: userId,
            templateContentType: typeof templateContent
        });
        return {
            status: 500,
            message: `Stream card oluşturulurken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
        };
    }
} 