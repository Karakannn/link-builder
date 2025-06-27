"use client";

import { useEffect } from "react";
import { useEditor } from "@/providers/editor/editor-provider";

interface ResponsiveDeviceDetectorProps {
    children: React.ReactNode;
}

export function ResponsiveDeviceDetector({ children }: ResponsiveDeviceDetectorProps) {
    const { dispatch, state } = useEditor();

    // Responsive device detection for live preview and custom domain pages
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
            
            // Only update if device changed
            if (state.editor.device !== newDevice) {
                dispatch({ type: "CHANGE_DEVICE", payload: { device: newDevice } });
            }
        };

        // Initial device detection
        updateDeviceBasedOnWindowSize();

        // Listen for window resize events
        window.addEventListener('resize', updateDeviceBasedOnWindowSize);
        
        // Cleanup
        return () => {
            window.removeEventListener('resize', updateDeviceBasedOnWindowSize);
        };
    }, [dispatch, state.editor.device]);

    return <>{children}</>;
} 