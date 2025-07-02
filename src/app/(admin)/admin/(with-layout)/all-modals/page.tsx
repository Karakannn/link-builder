import { adminGetAllUserModals } from "@/actions/landing-modal";
import { onAdminUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import React from "react";
import AllModals from "./_components/all-modals";

type Props = {};

const page = async (props: Props) => {
  // Admin kontrolü
  const adminCheck = await onAdminUser();
  
  if (adminCheck.status !== 200) {
    redirect("/admin/dashboard");
  }

  const modalsData = await adminGetAllUserModals();

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <AllModals modalsData={modalsData} />
        </div>
      </div>
    </div>
  );
};

export default page;