import { client } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FunnelEditor from "@/app/_components/editor";
import { EditorElement } from "@/providers/editor/editor-provider";
import EditorProvider from "@/providers/editor/editor-provider";
import { LandingModalProvider } from "@/providers/landing-modal-provider";
import { LandingModalTrigger } from "./_components/landing-modal-trigger";

type Props = {
    params: Promise<{ domain: string }>;
};

export default async function CustomDomainPage({ params }: Props) {
    const resolvedParams = await params;
    const domainName = decodeURIComponent(resolvedParams.domain); // URL decode ekledim

    console.log("🌐 Custom domain page requested:", domainName);
    console.log("🌐 Raw domain param:", resolvedParams.domain);

    try {
        // Önce tüm domain'leri listeleyelim
        const allDomains = await client.domain.findMany({
            select: {
                name: true,
                id: true,
                isVerified: true,
            },
        });
        
        console.log("📋 Veritabanındaki tüm domain'ler:", allDomains);

        // Domain'i veritabanında ara
        const domain = await client.domain.findUnique({
            where: {
                name: domainName,
            },
            include: {
                site: {
                    include: {
                        pages: {
                            where: {
                                isHome: true,
                            },
                            take: 1,
                        },
                        settings: true, // Site settings'i dahil et
                    },
                },
            },
        });

        console.log("🔍 Domain found:", !!domain);
        console.log("🏠 Homepage found:", !!domain?.site?.pages?.[0]);
        console.log("⚙️ Site settings:", domain?.site?.settings);

        if (!domain || !domain.site) {
            console.log("❌ Domain veya site bulunamadı:", domainName);
            notFound();
        }

        const homepage:any = domain.site.pages[0];
        if (!homepage) {
            console.log("❌ Homepage bulunamadı:", domain.site.name);
            notFound();
        }

        // Homepage content'ini parse et
        let pageContent: EditorElement[] = [];
        try {
            if (typeof homepage.content === 'string') {
                pageContent = JSON.parse(homepage.content);
            } else if (Array.isArray(homepage.content)) {
                pageContent = homepage.content as EditorElement[];
            }
        } catch (error) {
            console.error("❌ Page content parse hatası:", error);
            notFound();
        }

        // Landing modal ayarlarını kontrol et
        const siteSettings = domain.site.settings;
        const shouldShowLandingModal = siteSettings?.enableLandingModal && siteSettings?.selectedModalId;

        console.log("✅ Rendering custom domain page:", {
            domain: domainName,
            site: domain.site.name,
            page: homepage.title,
            contentLength: pageContent.length,
            shouldShowLandingModal,
            selectedModalId: siteSettings?.selectedModalId
        });

        return (
            <LandingModalProvider isPreview={false}>
                <EditorProvider siteId={domain.site.id} pageDetails={pageContent}>
                    <div className="w-full h-screen">
                        <FunnelEditor 
                            pageDetails={pageContent} 
                            liveMode={true}
                        />
                        {/* Landing modal trigger - sadece gerekirse render et */}
                        {shouldShowLandingModal && (
                            <LandingModalTrigger 
                                modalId={siteSettings.selectedModalId!}
                                siteId={domain.site.id}
                            />
                        )}
                    </div>
                </EditorProvider>
            </LandingModalProvider>
        );

    } catch (error) {
        console.error("❌ Custom domain page error:", error);
        notFound();
    }
}