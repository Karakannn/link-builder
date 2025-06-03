import { client } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { onAuthenticatedUser } from "./auth";

// src/actions/site.ts (page.ts'e eklenecek)
export const publishSite = async (siteId: string) => {
  try {
    const user = await onAuthenticatedUser();

    if (!user || !user.id) {
      return { status: 401, message: "Unauthorized" };
    }

    const site = await client.site.findFirst({
      where: {
        id: siteId,
        userId: user.id,
      },
    });

    if (!site) {
      return { status: 404, message: "Site not found" };
    }

    await client.site.update({
      where: { id: siteId },
      data: { isPublished: true },
    });

    revalidatePath(`/admin/sites`);

    return {
      status: 200,
      message: "Site published successfully",
    };
  } catch (error) {
    console.error("Error publishing site:", error);
    return { status: 500, message: "Failed to publish site" };
  }
};