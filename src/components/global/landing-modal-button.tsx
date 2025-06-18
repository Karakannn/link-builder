"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { DoorOpen } from "lucide-react";

export const LandingModalButton = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push("/site/landing-modal");
    };

    return (
        <Button
            onClick={handleClick}
            variant="outline"
            className="flex items-center gap-2"
        >
            <DoorOpen className="h-4 w-4" />
            Landing Modal Settings
        </Button>
    );
}; 