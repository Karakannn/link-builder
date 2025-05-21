import { client } from "@/lib/prisma";
import { User } from "@prisma/client";

export const createInitialPage = async (user: User) => {
  try {
    const defaultSite = await client.site.create({
      data: {
        name: "My First Site",
        description: "This is your first site created with LinkBuilder",
        isDefault: true,
        userId: user.id,
      },
    });

    await client.page.create({
      data: {
        title: "Home",
        slug: "home",
        isHome: true,
        siteId: defaultSite.id,
        content: [
          {
            id: "__body",
            name: "Body",
            type: "__body",
            styles: {
              backgroundColor: "white",
              height: "100%",
            },
            content: [
              {
                id: "container-1",
                name: "Container",
                type: "container",
                styles: {
                  width: "100%",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                },
                content: [
                  {
                    id: "text-1",
                    name: "Text",
                    type: "text",
                    styles: {
                      fontSize: "32px",
                      fontWeight: "bold",
                      color: "#333333",
                      marginBottom: "20px",
                    },
                    content: {
                      innerText: `Welcome to ${user.firstname}'s Site`,
                    },
                  },
                  {
                    id: "text-2",
                    name: "Text",
                    type: "text",
                    styles: {
                      fontSize: "18px",
                      color: "#666666",
                      marginBottom: "30px",
                      textAlign: "center",
                    },
                    content: {
                      innerText: "This is your first site created with LinkBuilder. Start customizing it now!",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    return {
      status: 200,
      message: "User successfully created with default site and homepage",
      id: user.id,
    };
  } catch (error) {
    console.error("Error creating user with default site:", error);
    return {
      status: 400,
      message: "Oops! something went wrong. Try again",
    };
  }
};
