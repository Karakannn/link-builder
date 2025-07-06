"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageCard } from "./page-card";
import { TemplateSelectionModal } from "./template-selection-modal";
import { SiteSettings } from "./site-settings";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2, Settings } from "lucide-react";
import { createPageFromTemplate, setPageAsHome, deletePage } from "@/actions/page";
import { toast } from "sonner";

type PagesData = {
  status: number;
  pages?: any[];
  message?: string;
  sitesCount?: number;
  pagesCount?: number;
  siteId?: string;
};

type Props = {
  pagesData: PagesData;
};

const AllPages = ({ pagesData }: Props) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleEdit = (pageId: string) => {
    router.push("/admin/builder/" + pageId);
  };

  const handleCreatePage = async (title: string, slug: string) => {
    setIsCreatingPage(true);
    try {
      // Create a basic page with default template
      const basicPageContent = [
        {
          id: "page-container",
          name: "Page Container",
          type: "container",
          styles: {
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            padding: "40px 20px",
            backgroundColor: "white",
          },
          content: [
            {
              id: "page-header",
              name: "Page Header",
              type: "text",
              styles: {
                fontSize: "32px",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "20px",
                textAlign: "center",
              },
              content: {
                innerText: title,
              },
            },
            {
              id: "page-content",
              name: "Page Content",
              type: "text",
              styles: {
                fontSize: "16px",
                color: "#666",
                lineHeight: "1.6",
                textAlign: "center",
                marginBottom: "30px",
              },
              content: {
                innerText: "Sayfa içeriğini düzenlemek için editörde değişiklik yapın.",
              },
            },
          ],
        },
      ];
      
      const result = await createPageFromTemplate(title, slug, JSON.parse(JSON.stringify(basicPageContent)));
      
      if (result.status === 200) {
        toast.success("Sayfa başarıyla oluşturuldu!");
        router.refresh();
      } else {
        toast.error(result.message || "Sayfa oluşturulurken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setIsCreatingPage(false);
    }
  };

  const handleSetAsHome = async (pageId: string) => {
    setLoadingStates(prev => ({ ...prev, [pageId]: true }));
    try {
      const result = await setPageAsHome(pageId);
      
      if (result.status === 200) {
        toast.success("Sayfa ana sayfa olarak ayarlandı!");
        router.refresh();
      } else {
        toast.error(result.message || "Ana sayfa ayarlanırken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setLoadingStates(prev => ({ ...prev, [pageId]: false }));
    }
  };

  const handleDeletePage = async (pageId: string) => {
    setLoadingStates(prev => ({ ...prev, [pageId]: true }));
    try {
      const result = await deletePage(pageId);
      
      if (result.status === 200) {
        toast.success("Sayfa başarıyla silindi!");
        router.refresh();
      } else {
        toast.error(result.message || "Sayfa silinirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setLoadingStates(prev => ({ ...prev, [pageId]: false }));
    }
  };

  if (pagesData.status !== 200) {
    return (
      <div className="p-6 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive">
        <h3 className="text-lg font-medium mb-2">Hata</h3>
        <p>{pagesData.message || "Sayfalar yüklenirken bir hata oluştu."}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="pages" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <span>Sayfalar</span>
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                {pagesData.pages ? pagesData.pages.length : 0}
              </span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span>Ayarlar</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pages" className="space-y-6">
          {/* Header with Create Button */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Sayfalarım</h2>
              <p className="text-muted-foreground mt-1">
                {pagesData.pages ? `${pagesData.pages.length} sayfa` : "Sayfa bulunamadı"}
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2" disabled={isCreatingPage}>
              {isCreatingPage ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {isCreatingPage ? "Oluşturuluyor..." : "Yeni Sayfa Oluştur"}
            </Button>
          </div>

          {/* Pages Grid */}
          {!pagesData.pages || pagesData.pages.length === 0 ? (
            <div className="p-8 text-center bg-muted rounded-lg border border-border">
              <h3 className="text-lg font-medium text-foreground mb-2">Henüz sayfa bulunamadı</h3>
              <p className="text-muted-foreground mb-4">İlk sayfanızı oluşturmak için yukarıdaki butonu kullanın</p>
              <Button onClick={() => setIsModalOpen(true)} variant="outline" className="gap-2" disabled={isCreatingPage}>
                {isCreatingPage ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isCreatingPage ? "Oluşturuluyor..." : "İlk Sayfamı Oluştur"}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pagesData.pages.map((page) => (
                <PageCard 
                  key={page.id} 
                  page={page} 
                  onEdit={handleEdit}
                  onSetAsHome={handleSetAsHome}
                  onDelete={handleDeletePage}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Site Ayarları</h2>
            {pagesData.siteId && <SiteSettings siteId={pagesData.siteId} />}
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Selection Modal */}
      <TemplateSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreatePage={handleCreatePage}
      />
    </div>
  );
};

export default AllPages;
