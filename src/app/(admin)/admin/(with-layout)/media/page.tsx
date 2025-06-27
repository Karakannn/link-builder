import { getUserMedia } from "@/actions/media";
import { getAuthUserDetails } from "@/actions/auth";
import { MediaList } from "./_components/media-list";
import React from "react";
import { redirect } from "next/navigation";

const MediaPage = async () => {
    const user = await getAuthUserDetails();
    if (!user) {
        redirect("/sign-in");
    }
    const data = await getUserMedia(user.id);
    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                    <MediaList media={data} userId={user.id} />
                </div>
            </div>
        </div>
    );
};

export default MediaPage; 