import { formatLastUpdated } from "@/lib/utils";
import { memo } from "react";

export const LastUpdatedInfo = memo(({ lastUpdated }: { lastUpdated: Date }) => {
    return (
        <div className="flex flex-col item-center mr-4">
            <span className="text-muted-foreground text-sm">Son güncelleme: {formatLastUpdated(lastUpdated)}</span>
        </div>
    );
});
