"use client";

import { useEffect } from "react";
import { useEditor } from "@/providers/editor/editor-provider";
import { useUIActions } from "@/hooks/editor-actions/use-ui-actions";

interface ResponsiveDeviceDetectorProps {
    children: React.ReactNode;
}

export function ResponsiveDeviceDetector({ children }: ResponsiveDeviceDetectorProps) {
    const { state } = useEditor();
    const { changeDevice } = useUIActions();

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

            if (state.editor.device !== newDevice) {
                changeDevice;
                newDevice;
            }
        };

        updateDeviceBasedOnWindowSize();

        window.addEventListener("resize", updateDeviceBasedOnWindowSize);

        return () => {
            window.removeEventListener("resize", updateDeviceBasedOnWindowSize);
        };
    }, [changeDevice, state.editor.device]);

    return <>{children}</>;
}
