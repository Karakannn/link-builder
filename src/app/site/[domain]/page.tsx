import { client } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FunnelEditor from "@/app/_components/editor";
import { EditorElement } from "@/providers/editor/editor-provider";

interface Props {
  params: Promise<{ domain: string }>;
}

export default async function PublicSitePage({ params }: Props) {
  
  const resolvedParams = await params;
  const domain = resolvedParams.domain;

  // Domain'i bul
  const domainData = await client.domain.findUnique({
    where: { name: domain },
    include: {
      site: {
        include: {
          pages: {
            where: { isHome: true },
          },
        },
      },
    },
  });

  if (!domainData || !domainData.isVerified || !domainData.site) {
    notFound();
  }

  const site = domainData.site;

  if (!site.isPublished) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">This site is not published yet.</p>
      </div>
    );
  }

  const homePage = site.pages[0];

  if (!homePage) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">No homepage found.</p>
      </div>
    );
  }

  const pageContent = JSON.parse(homePage.content as any) as EditorElement[];

  return (
    <div className="h-screen w-full">
      <FunnelEditor pageDetails={pageContent} liveMode={true} />
    </div>
  );
}

// Dynamic routing için
export async function generateStaticParams() {
  const domains = await client.domain.findMany({
    where: { isVerified: true },
    select: { name: true },
  });

  return domains.map((domain) => ({
    domain: domain.name,
  }));
}
