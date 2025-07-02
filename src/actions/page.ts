"use server";

import { client } from "@/lib/prisma";
import { Page, User } from "@prisma/client";
import { onAuthenticatedUser, onAdminUser } from "./auth";
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
            include: {
                pages: {
                    where: {
                        isHome: true,
                    },
                    select: {
                        id: true,
                        title: true,
                    },
                },
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
      orderBy: [
        { isHome: 'desc' }, // Ana sayfa en başta
        { createdAt: 'asc' } // Sonra oluşturulma tarihine göre (eski en başta)
      ],
    });

    // Her sayfanın content'ini parse et
    const parsedPages = pages.map(page => {
      let parsedContent = page.content;
      if (typeof page.content === 'string') {
        try {
          parsedContent = JSON.parse(page.content);
        } catch (error) {
          console.error("Error parsing page content:", error);
          // Parse edilemezse varsayılan içerik kullan
          parsedContent = [
            {
              id: "__body",
              name: "Body",
              type: "__body",
              styles: {
                backgroundColor: "white",
                height: "100%",
              },
              content: [],
            },
          ];
        }
      }

      return {
        ...page,
        content: parsedContent,
      };
    });

    return {
      status: 200,
      pages: parsedPages,
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

    // Content'i JSON string'den parse et
    let parsedContent = page.content;
    if (typeof page.content === 'string') {
      try {
        parsedContent = JSON.parse(page.content);
      } catch (error) {
        console.error("Error parsing page content:", error);
        // Parse edilemezse varsayılan içerik kullan
        parsedContent = [
          {
            id: "__body",
            name: "Body",
            type: "__body",
            styles: {
              backgroundColor: "white",
              height: "100%",
            },
            content: [],
          },
        ];
      }
    }

    return {
      status: 200,
      page: {
        ...page,
        content: parsedContent,
      },
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

    // Content'i JSON string'den parse et
    let parsedContent = page.content;
    if (typeof page.content === 'string') {
      try {
        parsedContent = JSON.parse(page.content);
      } catch (error) {
        console.error("Error parsing page content:", error);
        // Parse edilemezse varsayılan içerik kullan
        parsedContent = [
          {
            id: "__body",
            name: "Body",
            type: "__body",
            styles: {
              backgroundColor: "white",
              height: "100%",
            },
            content: [],
          },
        ];
      }
    }

    return {
      status: 200,
      page: {
        ...page,
        content: parsedContent,
      },
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

    // Content'i JSON string'den parse et
    let parsedContent = homePage.content;
    if (typeof homePage.content === 'string') {
      try {
        parsedContent = JSON.parse(homePage.content);
      } catch (error) {
        console.error("Error parsing home page content:", error);
        // Parse edilemezse varsayılan içerik kullan
        parsedContent = [
          {
            id: "__body",
            name: "Body",
            type: "__body",
            styles: {
              backgroundColor: "white",
              height: "100%",
            },
            content: [],
          },
        ];
      }
    }

    return {
      status: 200,
      page: {
        ...homePage,
        content: parsedContent,
      },
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
      orderBy: [
        { isHome: 'desc' }, // Ana sayfa en başta
        { createdAt: 'asc' } // Sonra oluşturulma tarihine göre (eski en başta)
      ],
    });

    // Her sayfanın content'ini parse et
    const parsedPages = pages.map(page => {
      let parsedContent = page.content;
      if (typeof page.content === 'string') {
        try {
          parsedContent = JSON.parse(page.content);
        } catch (error) {
          console.error("Error parsing page content:", error);
          // Parse edilemezse varsayılan içerik kullan
          parsedContent = [
            {
              id: "__body",
              name: "Body",
              type: "__body",
              styles: {
                backgroundColor: "white",
                height: "100%",
              },
              content: [],
            },
          ];
        }
      }

      return {
        ...page,
        content: parsedContent,
      };
    });

    return {
      status: 200,
      pages: parsedPages,
      sitesCount: sites.length,
      pagesCount: pages.length,
      siteId: sites[0]?.id, // İlk site ID'sini döndür (varsayılan site için)
    };
  } catch (error) {
    console.error("Error fetching user pages:", error);
    return { status: 400, message: "Failed to fetch user pages" };
  }
};

export const createPageFromTemplate = async (
  title: string, 
  slug: string, 
  templateContent: any[], 
  siteId?: string
) => {
  try {
    const user = await onAuthenticatedUser();

    if (!user || !user.id) {
      return { status: 401, message: "Unauthorized" };
    }

    // Site ID'yi belirle - eğer verilmemişse varsayılan siteyi al
    let targetSiteId = siteId;
    
    if (!targetSiteId) {
      const defaultSite = await client.site.findFirst({
        where: {
          userId: user.id,
          isDefault: true,
        },
      });

      if (defaultSite) {
        targetSiteId = defaultSite.id;
      } else {
        // Varsayılan site yoksa kullanıcının ilk sitesini al
        const firstSite = await client.site.findFirst({
          where: {
            userId: user.id,
          },
        });
        
        if (firstSite) {
          targetSiteId = firstSite.id;
        } else {
          return { status: 404, message: "No site found for user" };
        }
      }
    }

    // Sitenin kullanıcıya ait olduğunu kontrol et
    const site = await client.site.findFirst({
      where: {
        id: targetSiteId,
        userId: user.id,
      },
    });

    if (!site) {
      return { status: 404, message: "Site not found or you don't have access" };
    }

    // Aynı slug kontrolü
    const existingPage = await client.page.findFirst({
      where: {
        siteId: targetSiteId,
        slug: slug,
      },
    });

    if (existingPage) {
      return { status: 400, message: "A page with this slug already exists" };
    }

    // Aynı title kontrolü
    const existingPageWithTitle = await client.page.findFirst({
      where: {
        title: title,
        site: {
          userId: user.id
        }
      },
    });

    if (existingPageWithTitle) {
      return { status: 400, message: `"${title}" isimli bir sayfa zaten mevcut` };
    }

    // Modal ile aynı isim kontrolü
    const existingModal = await client.landingModal.findFirst({
      where: {
        name: title,
        userId: user.id
      },
    });

    if (existingModal) {
      return { status: 400, message: `"${title}" isimli bir modal zaten mevcut` };
    }

    // Sayfa oluştur
    const response = await client.page.create({
      data: {
        title,
        slug,
        isHome: false,
        content: JSON.stringify(templateContent),
        siteId: targetSiteId,
      },
    });

    // İlgili sayfaları yeniden doğrula
    revalidatePath(`/admin/sites`);

    return {
      status: 200,
      message: "Page created successfully from template",
      page: response,
    };
  } catch (error) {
    console.error("Create page from template error:", error);
    return { status: 500, message: "An error occurred", error };
  }
};

export const deletePage = async (pageId: string) => {
  try {
    const user = await onAuthenticatedUser();

    if (!user || !user.id) {
      return { status: 401, message: "Unauthorized" };
    }

    // Sayfayı bul ve site kontrolü yap
    const page = await client.page.findUnique({
      where: {
        id: pageId,
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

    if (!page) {
      return { status: 404, message: "Page not found" };
    }

    if (page.site.userId !== user.id) {
      return { status: 403, message: "You don't have permission to delete this page" };
    }

    // Ana sayfa silinmeye çalışılıyorsa uyarı ver
    if (page.isHome) {
      return { status: 400, message: "Ana sayfa silinemez. Önce başka bir sayfayı ana sayfa yapın." };
    }

    // Sayfayı sil
    await client.page.delete({
      where: {
        id: pageId,
      },
    });

    revalidatePath(`/admin/sites`);

    return {
      status: 200,
      message: "Page deleted successfully",
    };
  } catch (error) {
    console.error("Delete page error:", error);
    return { status: 500, message: "An error occurred", error };
  }
};

export const setPageAsHome = async (pageId: string) => {
  try {
    const user = await onAuthenticatedUser();

    if (!user || !user.id) {
      return { status: 401, message: "Unauthorized" };
    }

    // Sayfayı bul ve site kontrolü yap
    const page = await client.page.findUnique({
      where: {
        id: pageId,
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

    if (!page) {
      return { status: 404, message: "Page not found" };
    }

    if (page.site.userId !== user.id) {
      return { status: 403, message: "You don't have permission to modify this page" };
    }

    // Önce tüm sayfaları ana sayfa olmaktan çıkar
    await client.page.updateMany({
      where: {
        siteId: page.siteId,
        isHome: true,
      },
      data: {
        isHome: false,
      },
    });

    // Bu sayfayı ana sayfa yap
    const updatedPage = await client.page.update({
      where: {
        id: pageId,
      },
      data: {
        isHome: true,
      },
    });

    revalidatePath(`/admin/sites`);

    return {
      status: 200,
      message: "Page set as homepage successfully",
      page: updatedPage,
    };
  } catch (error) {
    console.error("Set page as home error:", error);
    return { status: 500, message: "An error occurred", error };
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
        content: page.content !== undefined ? (typeof page.content === 'string' ? page.content : JSON.stringify(page.content)) : undefined,
        seo: page.seo !== undefined ? page.seo as any : undefined,
        updatedAt: new Date(),
      },
      create: {
        title: page.title,
        slug: page.slug,
        isHome: page.isHome || false,
        content: typeof page.content === 'string' ? page.content : JSON.stringify(page.content || defaultContent),
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

// Admin fonksiyonları
export const getAllUsersPages = async () => {
  try {
    const admin = await onAdminUser();

    if (admin.status !== 200) {
      return { status: admin.status, message: admin.message };
    }

    // Tüm kullanıcıları ve sayfalarını getir
    const usersWithPages = await client.user.findMany({
      where: {
        role: "USER", // Sadece normal kullanıcıları getir
      },
      include: {
        sites: {
          include: {
            pages: {
              orderBy: [
                { isHome: 'desc' },
                { createdAt: 'asc' }
              ],
            },
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Her sayfanın content'ini parse et
    const processedUsers = usersWithPages.map(user => ({
      ...user,
      sites: user.sites.map(site => ({
        ...site,
        pages: site.pages.map(page => {
          let parsedContent = page.content;
          if (typeof page.content === 'string') {
            try {
              parsedContent = JSON.parse(page.content);
            } catch (error) {
              console.error("Error parsing page content:", error);
              parsedContent = [
                {
                  id: "__body",
                  name: "Body",
                  type: "__body",
                  styles: {
                    backgroundColor: "white",
                    height: "100%",
                  },
                  content: [],
                },
              ];
            }
          }

          return {
            ...page,
            content: parsedContent,
          };
        }),
      })),
    }));

    return {
      status: 200,
      users: processedUsers,
      totalUsers: processedUsers.length,
      totalSites: processedUsers.reduce((acc, user) => acc + user.sites.length, 0),
      totalPages: processedUsers.reduce((acc, user) => 
        acc + user.sites.reduce((siteAcc, site) => siteAcc + site.pages.length, 0), 0
      ),
    };
  } catch (error) {
    console.error("Error fetching all users pages:", error);
    return { status: 500, message: "Failed to fetch all users pages" };
  }
};

export const getUsersWithoutPages = async () => {
  try {
    const admin = await onAdminUser();

    if (admin.status !== 200) {
      return { status: admin.status, message: admin.message };
    }

    // Tüm kullanıcıları ve sitelerini getir
    const usersWithSites = await client.user.findMany({
      where: {
        role: "USER", // Sadece normal kullanıcıları getir
      },
      include: {
        sites: {
          include: {
            pages: true,
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
              },
            },
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Sadece sayfası olmayan kullanıcıları filtrele
    const usersWithoutPages = usersWithSites.filter(user => {
      return user.sites.some(site => site.pages.length === 0);
    });

    return {
      status: 200,
      users: usersWithoutPages
    };
  } catch (error) {
    console.error("Error fetching users without pages:", error);
    return { status: 500, message: "Failed to fetch users without pages" };
  }
};

export const adminDeletePage = async (pageId: string) => {
  try {
    const admin = await onAdminUser();

    if (admin.status !== 200) {
      return { status: admin.status, message: admin.message };
    }

    // Sayfayı bul
    const page = await client.page.findUnique({
      where: {
        id: pageId,
      },
      include: {
        site: {
          select: {
            id: true,
            name: true,
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!page) {
      return { status: 404, message: "Page not found" };
    }

    // Sayfayı sil
    await client.page.delete({
      where: {
        id: pageId,
      },
    });

    revalidatePath(`/admin/all-pages`);

    return {
      status: 200,
      message: "Page deleted successfully by admin",
      deletedPage: {
        id: page.id,
        title: page.title,
        siteName: page.site.name,
        userName: `${page.site.user.firstname} ${page.site.user.lastname}`,
        userEmail: page.site.user.email,
      },
    };
  } catch (error) {
    console.error("Admin delete page error:", error);
    return { status: 500, message: "An error occurred", error };
  }
};

export const adminUpdatePage = async (pageId: string, updates: Partial<Page>) => {
  try {
    const admin = await onAdminUser();

    if (admin.status !== 200) {
      return { status: admin.status, message: admin.message };
    }

    // Sayfayı bul
    const page = await client.page.findUnique({
      where: {
        id: pageId,
      },
    });

    if (!page) {
      return { status: 404, message: "Page not found" };
    }

    // Sayfayı güncelle
    const updatedPage = await client.page.update({
      where: {
        id: pageId,
      },
      data: {
        title: updates.title,
        slug: updates.slug,
        isHome: updates.isHome,
        content: updates.content ? (typeof updates.content === 'string' ? updates.content : JSON.stringify(updates.content)) : undefined,
        seo: updates.seo as any,
        updatedAt: new Date(),
      },
    });

    revalidatePath(`/admin/all-pages`);

    return {
      status: 200,
      message: "Page updated successfully by admin",
      page: updatedPage,
    };
  } catch (error) {
    console.error("Admin update page error:", error);
    return { status: 500, message: "An error occurred", error };
  }
};

export const adminSetPageAsHome = async (pageId: string) => {
  try {
    const admin = await onAdminUser();
    if (!admin) {
      return { status: 403, message: "Admin yetkisi gerekli" };
    }

    // Sayfayı bul
    const page = await client.page.findUnique({
      where: { id: pageId },
      include: { site: true }
    });

    if (!page) {
      return { status: 404, message: "Sayfa bulunamadı" };
    }

    // Aynı sitedeki diğer sayfaların ana sayfa özelliğini kaldır
    await client.page.updateMany({
      where: {
        siteId: page.siteId,
        isHome: true
      },
      data: {
        isHome: false
      }
    });

    // Bu sayfayı ana sayfa yap
    await client.page.update({
      where: { id: pageId },
      data: { isHome: true }
    });

    revalidatePath("/admin/all-pages");
    revalidatePath(`/admin/sites`);

    return {
      status: 200,
      message: "Sayfa başarıyla ana sayfa olarak ayarlandı"
    };
  } catch (error) {
    console.error("Error setting page as home:", error);
    return { status: 400, message: "Ana sayfa ayarlanırken bir hata oluştu" };
  }
};

export const adminCreatePageFromTemplate = async (
  title: string, 
  slug: string, 
  templateContent: any[], 
  siteId: string
) => {
  try {
    const admin = await onAdminUser();

    if (admin.status !== 200) {
      return { status: admin.status, message: admin.message };
    }

    // Site'in var olduğunu kontrol et
    const site = await client.site.findUnique({
      where: {
        id: siteId,
      },
      include: {
        user: {
          select: {
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

    // Aynı slug kontrolü
    const existingPage = await client.page.findFirst({
      where: {
        siteId: siteId,
        slug: slug,
      },
    });

    if (existingPage) {
      return { status: 400, message: "Bu site için aynı slug'a sahip bir sayfa zaten mevcut" };
    }

    // Aynı title kontrolü
    const existingPageWithTitle = await client.page.findFirst({
      where: {
        title: title,
        site: {
          userId: site.userId
        }
      },
    });

    if (existingPageWithTitle) {
      return { status: 400, message: `"${title}" isimli bir sayfa zaten mevcut` };
    }

    // Modal ile aynı isim kontrolü
    const existingModal = await client.landingModal.findFirst({
      where: {
        name: title,
        userId: site.userId
      },
    });

    if (existingModal) {
      return { status: 400, message: `"${title}" isimli bir modal zaten mevcut` };
    }

    // Sayfa oluştur
    const response = await client.page.create({
      data: {
        title,
        slug,
        isHome: false,
        content: JSON.stringify(templateContent),
        siteId: siteId,
      },
    });

    revalidatePath(`/admin/all-pages`);

    return {
      status: 200,
      message: "Sayfa başarıyla oluşturuldu",
      page: response,
      siteInfo: {
        name: site.name,
        userName: `${site.user.firstname} ${site.user.lastname}`,
        userEmail: site.user.email,
      },
    };
  } catch (error) {
    console.error("Admin create page error:", error);
    return { status: 500, message: "An error occurred", error };
  }
};

export const adminGetPageById = async (pageId: string) => {
  try {
    const admin = await onAdminUser();

    if (admin.status !== 200) {
      return { status: admin.status, message: admin.message };
    }

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

    if (!page) {
      return { status: 404, message: "Page not found" };
    }

    // Content'i JSON string'den parse et
    let parsedContent = page.content;
    if (typeof page.content === 'string') {
      try {
        parsedContent = JSON.parse(page.content);
      } catch (error) {
        console.error("Error parsing page content:", error);
        // Parse edilemezse varsayılan içerik kullan
        parsedContent = [
          {
            id: "__body",
            name: "Body",
            type: "__body",
            styles: {
              backgroundColor: "white",
              height: "100%",
            },
            content: [],
          },
        ];
      }
    }

    return {
      status: 200,
      page: {
        ...page,
        content: parsedContent,
      },
    };
  } catch (error) {
    console.error("Error fetching page by ID (admin):", error);
    return { status: 400, message: "Failed to fetch page" };
  }
};
