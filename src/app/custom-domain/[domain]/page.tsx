import { client } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FunnelEditor from "@/app/_components/editor";
import { EditorElement } from "@/providers/editor/editor-provider";
import EditorProvider from "@/providers/editor/editor-provider";
import { LandingModalProvider } from "@/providers/landing-modal-provider";
import { LandingModalTrigger } from "./_components/landing-modal-trigger";
import { ResponsiveDeviceDetector } from "@/components/global/responsive-device-detector";
import { GoogleAnalytics } from "./_components/google-analytics";
import { Metadata } from "next";

type Props = {
    params: Promise<{ domain: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const domainName = decodeURIComponent(resolvedParams.domain);

    try {
        // Domain ve site ayarlarını al
        const domain = await client.domain.findUnique({
            where: {
                name: domainName,
            },
            include: {
                site: {
                    include: {
                        settings: true,
                        pages: {
                            where: {
                                isHome: true,
                            },
                            take: 1,
                        },
                    },
                },
            },
        });

        if (!domain?.site) {
            return {
                title: "Site Not Found",
                description: "The requested site could not be found.",
            };
        }

        const siteSettings = domain.site.settings;
        const homepage = domain.site.pages[0];
        
        // Title: Site settings > Homepage title > Site name
        const title = siteSettings?.title || homepage?.title || domain.site.name;
        
        // Favicon: Site settings > Default
        const favicon = siteSettings?.favicon || "/favicon.ico";

        return {
            title,
            description: domain.site.description || `Visit ${domain.site.name}`,
            icons: {
                icon: favicon,
                shortcut: favicon,
                apple: favicon,
            },
            openGraph: {
                title,
                description: domain.site.description || `Visit ${domain.site.name}`,
                siteName: domain.site.name,
                type: "website",
            },
            twitter: {
                title,
                description: domain.site.description || `Visit ${domain.site.name}`,
                card: "summary_large_image",
            },
        };
    } catch (error) {
        console.error("❌ Error generating metadata:", error);
        return {
            title: "Site Error",
            description: "An error occurred while loading the site.",
        };
    }
}

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
                    <ResponsiveDeviceDetector>
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
                            {/* Google Analytics - sadece gerekirse render et */}
                            {siteSettings?.googleAnalyticsId && (
                                <GoogleAnalytics 
                                    googleAnalyticsId={siteSettings.googleAnalyticsId}
                                />
                            )}
                        </div>
                    </ResponsiveDeviceDetector>
                </EditorProvider>
            </LandingModalProvider>
        );

    } catch (error) {
        console.error("❌ Custom domain page error:", error);
        notFound();
    }
}