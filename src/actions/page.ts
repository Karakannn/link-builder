"use server";

import { client } from "@/lib/prisma";
import { Page, User } from "@prisma/client";
import { onAuthenticatedUser } from "./auth";
import { revalidatePath } from "next/cache";

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

export const getAllSites = async () => {
  try {
    const user = await onAuthenticatedUser();

    if (!user || !user.id) {
      return { status: 404, message: "User not found" };
    }

    const sites = await client.site.findMany({
      where: {
        userId: user.id,
      },
    });

    return {
      status: 200,
      sites,
    };
  } catch (error) {
    console.error("Error fetching sites:", error);
    return { status: 400, message: "Failed to fetch sites" };
  }
};

export const getSitePages = async (siteId: string) => {
  try {
    if (!siteId) {
      return { status: 400, message: "Site ID is required" };
    }

    const pages = await client.page.findMany({
      where: {
        siteId: siteId,
      },
      orderBy: {
        createdAt: "asc", // Veya istediğiniz başka bir sıralama
      },
    });

    return {
      status: 200,
      pages,
    };
  } catch (error) {
    console.error("Error fetching site pages:", error);
    return { status: 400, message: "Failed to fetch pages" };
  }
};

export const getPageBySlug = async (siteId: string, slug: string) => {
  try {
    if (!siteId || !slug) {
      return { status: 400, message: "Site ID and slug are required" };
    }

    const page = await client.page.findUnique({
      where: {
        siteId_slug: {
          siteId: siteId,
          slug: slug,
        },
      },
    });

    if (!page) {
      return { status: 404, message: "Page not found" };
    }

    return {
      status: 200,
      page,
    };
  } catch (error) {
    console.error("Error fetching page:", error);
    return { status: 400, message: "Failed to fetch page" };
  }
};

export const getPageById = async (pageId: string) => {
  try {
    if (!pageId) {
      return { status: 400, message: "Page ID is required" };
    }

    const page = await client.page.findUnique({
      where: {
        id: pageId,
      },
      include: {
        site: {
          select: {
            name: true,
            id: true,
            userId: true,
          },
        },
      },
    });

    if (!page) {
      return { status: 404, message: "Page not found" };
    }

    // İsteğe bağlı güvenlik kontrolü: yalnızca kullanıcının kendi sayfalarına erişmesini sağlamak için
    const user = await onAuthenticatedUser();
    if (user.id && page.site.userId !== user.id) {
      return { status: 403, message: "You don't have permission to access this page" };
    }

    return {
      status: 200,
      page,
    };
  } catch (error) {
    console.error("Error fetching page by ID:", error);
    return { status: 400, message: "Failed to fetch page" };
  }
};

export const getHomePage = async (siteId: string) => {
  try {
    if (!siteId) {
      return { status: 400, message: "Site ID is required" };
    }

    const homePage = await client.page.findFirst({
      where: {
        siteId: siteId,
        isHome: true,
      },
    });

    if (!homePage) {
      return { status: 404, message: "Home page not found" };
    }

    return {
      status: 200,
      page: homePage,
    };
  } catch (error) {
    console.error("Error fetching home page:", error);
    return { status: 400, message: "Failed to fetch home page" };
  }
};

export const getAllUserPages = async () => {
  try {
    const user = await onAuthenticatedUser();

    if (!user || !user.id) {
      return { status: 404, message: "User not found" };
    }

    // Önce kullanıcının sitelerini bulun
    const sites = await client.site.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!sites.length) {
      return { status: 404, message: "No sites found" };
    }

    // Tüm sitelerin ID'lerini alın
    const siteIds = sites.map((site) => site.id);

    // Bu sitelere ait tüm sayfaları alın
    const pages = await client.page.findMany({
      where: {
        siteId: {
          in: siteIds,
        },
      },
      include: {
        site: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      status: 200,
      pages,
      sitesCount: sites.length,
      pagesCount: pages.length,
    };
  } catch (error) {
    console.error("Error fetching user pages:", error);
    return { status: 400, message: "Failed to fetch user pages" };
  }
};

export const upsertPage = async (page: Page) => {
  try {
    const user = await onAuthenticatedUser();

    if (!user || !user.id) {
      return { status: 401, message: "Unauthorized" };
    }

    let siteId: string | undefined;
    let existingPage: any = null;

    // Mevcut sayfa güncelleniyor mu?
    if (page.id) {
      // Sayfa ID ile sayfayı bul
      existingPage = await client.page.findUnique({
        where: {
          id: page.id,
        },
        include: {
          site: {
            select: {
              id: true,
              userId: true,
            },
          },
        },
      });

      // Sayfa bulunamadı
      if (!existingPage) {
        return { status: 404, message: "Page not found" };
      }

      // Sayfanın site ID'sini al
      siteId = existingPage.siteId;

      // Kullanıcının yetkisi var mı kontrol et
      if (existingPage.site.userId !== user.id) {
        return { status: 403, message: "You don't have permission to update this page" };
      }
    } else {
      // Yeni sayfa oluşturuluyor - siteId zorunlu
      siteId = page.siteId;
      
      if (!siteId) {
        return { status: 400, message: "Site ID is required for creating a new page" };
      }

      // Sitenin kullanıcıya ait olduğunu kontrol et
      const site = await client.site.findFirst({
        where: {
          id: siteId,
          userId: user.id,
        },
      });

      if (!site) {
        return { status: 404, message: "Site not found or you don't have access" };
      }
    }

    // Ana sayfa kontrolü
    if (page.isHome) {
      await client.page.updateMany({
        where: {
          siteId: siteId,
          isHome: true,
          id: { not: page.id || "" },
        },
        data: {
          isHome: false,
        },
      });
    }

    // Varsayılan içerik
    const defaultContent = [
      {
        id: "__body",
        name: "Body",
        type: "__body",
        styles: {
          backgroundColor: "black",
          height: "100%",
        },
        content: [],
      },
    ];

    // Sayfa upsert işlemi
    const response = await client.page.upsert({
      where: {
        id: page.id || "",
      },
      update: {
        title: page.title,
        slug: page.slug,
        isHome: page.isHome !== undefined ? page.isHome : undefined,
        content: page.content !== undefined ? page.content as any : undefined,
        seo: page.seo !== undefined ? page.seo as any : undefined,
        updatedAt: new Date(),
      },
      create: {
        title: page.title,
        slug: page.slug,
        isHome: page.isHome || false,
        content: page.content || defaultContent,
        seo: page.seo as any,
        siteId: siteId as any,
      },
    });

    // İlgili sayfaları yeniden doğrula
    revalidatePath(`/sites/${siteId}`);

    return {
      status: 200, 
      message: page.id ? "Page updated successfully" : "Page created successfully",
      page: response 
    };
  } catch (error) {
    console.error("Page upsert error:", error);
    return { status: 500, message: "An error occurred", error };
  }
};
