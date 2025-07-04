"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { createInitialPage } from "./page";

export const onAuthenticatedUser = async () => {
  try {
    const clerk = await currentUser();
    if (!clerk) return { status: 404 };

    const user = await client.user.findUnique({
      where: {
        clerkId: clerk.id,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
      },
    });
    if (user)
      return {
        status: 200,
        id: user.id,
        image: clerk.imageUrl,
        username: `${user.firstname} ${user.lastname}`,
      };
    return {
      status: 404,
    };
  } catch (error) {
    return {
      status: 400,
    };
  }
};

export const onSignUpUser = async (data: { email: string; firstname: string; lastname: string; image: string; clerkId: string }) => {
  try {
    const createdUser = await client.user.create({
      data: {
        ...data,
      },
    });

    if (createdUser) {
      
      //create first page
      const initialPage = await createInitialPage(createdUser);

      if (initialPage.status !== 200) {
        return {
          status: 400,
          message: "initialPage could not be created! Try again",
        };
      }
      return {
        status: 200,
        message: "User successfully created",
        id: createdUser.id,
      };
    }
    return {
      status: 400,
      message: "User could not be created! Try again",
    };
  } catch (error) {
    return {
      status: 400,
      message: "Oops! something went wrong. Try again",
    };
  }
};

export const onSignInUser = async (clerkId: string) => {
  try {
    const loggedInUser = await client.user.findUnique({
      where: {
        clerkId,
      },
    });

    if (loggedInUser) {
      return {
        status: 200,
        message: "User successfully logged in",
        id: loggedInUser.id,
      };
    }

    return {
      status: 400,
      message: "User could not be logged in! Try again",
    };
  } catch (error) {
    return {
      status: 400,
      message: "Oops! something went wrong. Try again",
    };
  }
};

export const getAuthUserDetails = async () => {
  const user = await currentUser();

  if (!user) {
    return false;
  }

  const userData = await client.user.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  return userData;
};

export const onAdminUser = async () => {
  try {
    const clerk = await currentUser();
    if (!clerk) return { status: 404, message: "User not authenticated" };

    const user = await client.user.findUnique({
      where: {
        clerkId: clerk.id,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        role: true,
      },
    });

    if (!user) {
      return { status: 404, message: "User not found" };
    }

    if (user.role !== "ADMIN") {
      return { status: 403, message: "Access denied. Admin role required." };
    }

    return {
      status: 200,
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
    };
  } catch (error) {
    console.error("Admin auth error:", error);
    return { status: 400, message: "Authentication error" };
  }
};
