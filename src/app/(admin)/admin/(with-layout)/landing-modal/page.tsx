import { getAllUserModals } from "@/actions/landing-modal";
import { getAuthUserDetails } from "@/actions/auth";
import React from "react";
import AllModals from "./_components/all-modals";

type Props = {};

const page = async (props: Props) => {
  const user = await getAuthUserDetails();
  const modalsData = await getAllUserModals();

  if (!user) return <>loading...</>;

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