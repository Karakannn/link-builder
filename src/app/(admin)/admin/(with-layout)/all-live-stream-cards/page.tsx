import { adminGetAllUserLiveStreamCards } from "@/actions/live-stream-card";
import { getAllUsersPages } from "@/actions/page";
import { onAdminUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import React from "react";
import AllLiveStreamCards from "./_components/all-live-stream-cards";

type Props = {};

const page = async (props: Props) => {
  // Admin kontrolü
  const adminCheck = await onAdminUser();
  
  if (adminCheck.status !== 200) {
    redirect("/admin/dashboard");
  }

  const cardsData = await adminGetAllUserLiveStreamCards();
  const usersData = await getAllUsersPages();

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <AllLiveStreamCards cardsData={cardsData} usersData={usersData} />
        </div>
      </div>
    </div>
  );
};

export default page; 