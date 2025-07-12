import { adminGetAllUserOverlays } from "@/actions/overlay";
import { getAllUsersPages } from "@/actions/page";
import { onAdminUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import React from "react";
import AllOverlays from "./_components/all-overlays";

type Props = {};

const page = async (props: Props) => {
  // Admin kontrolü
  const adminCheck = await onAdminUser();
  
  if (adminCheck.status !== 200) {
    redirect("/admin/dashboard");
  }

  const overlaysData = await adminGetAllUserOverlays();
  const usersData = await getAllUsersPages();

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <AllOverlays overlaysData={overlaysData} usersData={usersData} />
        </div>
      </div>
    </div>
  );
};

export default page; 