import { client } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FunnelEditor from "@/app/_components/editor";
import { EditorElement } from "@/providers/editor/editor-provider";
import { Metadata } from "next";

interface Props {
  params: Promise<{ domain: string }>;
}

export default async function PublicSitePage({ params }: Props) {
  const resolvedParams = await params;
  const domain = resolvedParams.domain;

  console.log("Loading public site for domain:", domain);

  try {
    // Find domain in database
    const domainData = await client.domain.findUnique({
      where: { name: domain },
      include: {
        site: {
          include: {
            pages: {
              where: { isHome: true },
              take: 1
            },
          },
        },
      },
    });

    console.log("Domain data found:", !!domainData);
    console.log("Domain verified:", domainData?.isVerified);
    console.log("Site published:", domainData?.site?.isPublished);

    // If domain not found in database
    if (!domainData) {
      console.log("Domain not found in database");
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Domain Not Found</h1>
            <p className="text-gray-600">
              This domain ({domain}) is not configured in our system.
            </p>
            <p className="text-sm text-gray-500">
              If you're the owner, please add and verify this domain in your dashboard.
            </p>
          </div>
        </div>
      );
    }

    // If domain not verified
    if (!domainData.isVerified) {
      console.log("Domain not verified");
      return (
        <div className="flex items-center justify-center h-screen bg-yellow-50">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-yellow-800">Domain Not Verified</h1>
            <p className="text-yellow-700">
              This domain ({domain}) has not been verified yet.
            </p>
            <p className="text-sm text-yellow-600">
              Please complete the DNS verification process to activate this domain.
            </p>
          </div>
        </div>
      );
    }

    // If no site connected
    if (!domainData.site) {
      console.log("No site connected to domain");
      return (
        <div className="flex items-center justify-center h-screen bg-blue-50">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-blue-800">Site Not Connected</h1>
            <p className="text-blue-700">
              This domain ({domain}) is verified but not connected to any site.
            </p>
            <p className="text-sm text-blue-600">
              Please connect this domain to a site in your dashboard.
            </p>
          </div>
        </div>
      );
    }

    const site = domainData.site;

    // If site not published
    if (!site.isPublished) {
      console.log("Site not published");
      return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">Site Not Published</h1>
            <p className="text-gray-600">
              This site is not published yet.
            </p>
            <p className="text-sm text-gray-500">
              The site owner needs to publish it before it can be viewed publicly.
            </p>
          </div>
        </div>
      );
    }

    // Get homepage
    const homePage = site.pages[0];

    if (!homePage) {
      console.log("No homepage found");
      return (
        <div className="flex items-center justify-center h-screen bg-red-50">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-red-800">No Homepage Found</h1>
            <p className="text-red-700">
              This site doesn't have a homepage configured.
            </p>
            <p className="text-sm text-red-600">
              Please create a homepage for this site.
            </p>
          </div>
        </div>
      );
    }

    console.log("Loading homepage:", homePage.title);

    // Parse page content
    let pageContent: EditorElement[];
    try {
      pageContent = JSON.parse(homePage.content as any) as EditorElement[];
    } catch (error) {
      console.error("Error parsing page content:", error);
      return (
        <div className="flex items-center justify-center h-screen bg-red-50">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-red-800">Content Error</h1>
            <p className="text-red-700">
              There was an error loading the page content.
            </p>
            <p className="text-sm text-red-600">
              Please contact the site owner to resolve this issue.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-screen w-full">
        <FunnelEditor pageDetails={pageContent} liveMode={true} />
      </div>
    );

  } catch (error) {
    console.error("Error in PublicSitePage:", error);
    
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-800">Server Error</h1>
          <p className="text-red-700">
            There was an error loading this site.
          </p>
          <p className="text-sm text-red-600">
            Please try again later or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const domain = resolvedParams.domain;

  try {
    const domainData = await client.domain.findUnique({
      where: { name: domain },
      include: {
        site: {
          include: {
            pages: {
              where: { isHome: true },
              take: 1
            },
          },
        },
      },
    });

    if (!domainData?.site?.pages[0]) {
      return {
        title: `${domain} - Site Not Found`,
        description: `The requested site at ${domain} could not be found.`,
      };
    }

    const homePage = domainData.site.pages[0];
    const seo = homePage.seo as any;

    return {
      title: seo?.title || homePage.title || `${domainData.site.name} - Home`,
      description: seo?.description || domainData.site.description || `Welcome to ${domainData.site.name}`,
      keywords: seo?.keywords || undefined,
      openGraph: {
        title: seo?.title || homePage.title || domainData.site.name,
        description: seo?.description || domainData.site.description,
        url: `https://${domain}`,
        siteName: domainData.site.name,
      },
      twitter: {
        title: seo?.title || homePage.title || domainData.site.name,
        description: seo?.description || domainData.site.description,
      },
      robots: {
        index: domainData.site.isPublished,
        follow: domainData.site.isPublished,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: `${domain} - Error`,
      description: `There was an error loading the site at ${domain}.`,
    };
  }
}

// Generate static params for better performance
export async function generateStaticParams() {
  try {
    const domains = await client.domain.findMany({
      where: { 
        isVerified: true,
        site: {
          isPublished: true
        }
      },
      select: { name: true },
      take: 100, // Limit to avoid too many static generations
    });

    return domains.map((domain) => ({
      domain: domain.name,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}