import { getAllUserOverlays } from "@/actions/overlay";
import { getAuthUserDetails } from "@/actions/auth";
import React from "react";
import AllOverlays from "./_components/all-overlays";

type Props = {};

const page = async (props: Props) => {
  const user = await getAuthUserDetails();
  const overlaysData = await getAllUserOverlays();

  if (!user) return <>loading...</>;

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <AllOverlays overlaysData={overlaysData} />
        </div>
      </div>
    </div>
  );
};

export default page;