import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/lib/prisma";

export async function GET() {
    try {
        const user = await currentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const landingModal = await client.landingModal.findFirst({
            where: {
                userId: user.id
            }
        });

        return NextResponse.json(landingModal);
    } catch (error) {
        console.error("[LANDING_MODAL_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { content } = body;

        const landingModal = await client.landingModal.upsert({
            where: {
                userId: user.id
            },
            create: {
                content,
                userId: user.id
            },
            update: {
                content
            }
        });

        return NextResponse.json(landingModal);
    } catch (error) {
        console.error("[LANDING_MODAL_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
} 