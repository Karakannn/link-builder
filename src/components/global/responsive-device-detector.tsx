"use client";

import { useEffect } from "react";
import { useEditor } from "@/providers/editor/editor-provider";
import { useUIActions } from "@/hooks/editor-actions/use-ui-actions";
import { useDevice } from "@/providers/editor/editor-ui-context";

interface ResponsiveDeviceDetectorProps {
    children: React.ReactNode;
}

export function ResponsiveDeviceDetector({ children }: ResponsiveDeviceDetectorProps) {
    const { changeDevice } = useUIActions();
    const device = useDevice();

    useEffect(() => {
        const updateDeviceBasedOnWindowSize = () => {
            const windowWidth = window.innerWidth;
            let newDevice: "Desktop" | "Tablet" | "Mobile" = "Desktop";

            if (windowWidth <= 768) {
                newDevice = "Mobile";
            } else if (windowWidth <= 1024) {
                newDevice = "Tablet";
            } else {
                newDevice = "Desktop";
            }

            if (device !== newDevice) {
                changeDevice(newDevice);
            }
        };

        updateDeviceBasedOnWindowSize();

        window.addEventListener("resize", updateDeviceBasedOnWindowSize);

        return () => {
            window.removeEventListener("resize", updateDeviceBasedOnWindowSize);
        };
    }, [changeDevice, device]);

    return <>{children}</>;
}
