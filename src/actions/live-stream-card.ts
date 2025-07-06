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