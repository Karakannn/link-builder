"use server"

import { client } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { onAuthenticatedUser } from "./auth";

// Get site by ID with user information
export const getSiteById = async (siteId: string) => {
  try {
    if (!siteId) {
      return { status: 400, message: "Site ID is required" };
    }

    const site = await client.site.findUnique({
      where: {
        id: siteId,
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

    if (!site) {
      return { status: 404, message: "Site not found" };
    }

    return {
      status: 200,
      site,
    };
  } catch (error) {
    console.error("Error fetching site:", error);
    return { status: 500, message: "Failed to fetch site" };
  }
};

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