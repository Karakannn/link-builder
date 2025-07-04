import { getAllUserPages } from "@/actions/page";
import React from "react";
import AllPages from "./_components/all-pages";

type Props = {};

const page = async (props: Props) => {

  const pagesData = await getAllUserPages();

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <AllPages pagesData={pagesData} />
        </div>
      </div>
    </div>
  );
};

export default page;
