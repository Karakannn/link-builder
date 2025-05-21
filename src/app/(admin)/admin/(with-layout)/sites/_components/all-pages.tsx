"use client";


import { useRouter } from "next/navigation";
import { PageCard } from "./page-card";

type PagesData = {
  status: number;
  pages?: any[];
  message?: string;
  sitesCount?: number;
  pagesCount?: number;
};

type Props = {
  pagesData: PagesData;
};


const AllPages = ({ pagesData }: Props) => {
  const router = useRouter();

  const handleEdit = (pageId: string) => {
    router.push("/admin/builder/" + pageId);
  };

  if (pagesData.status !== 200) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200 text-red-700">
        <h3 className="text-lg font-medium mb-2">Hata</h3>
        <p>{pagesData.message || "Sayfalar yüklenirken bir hata oluştu."}</p>
      </div>
    );
  }

  if (!pagesData.pages || pagesData.pages.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Henüz sayfa bulunamadı</h3>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pagesData.pages.map((page) => (
          <PageCard key={page.id} page={page} onEdit={handleEdit} />
        ))}
      </div>
    </div>
  );
};

export default AllPages;
