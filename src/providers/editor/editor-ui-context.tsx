"use client";

import { createContext, useContext, useMemo } from "react";
import { DeviceTypes } from "./editor-provider";

export interface EditorUIContextType {
    device: DeviceTypes;
    previewMode: boolean;
    liveMode: boolean;
    layerSidebarCollapsed: boolean;
}

export const EditorUIContext = createContext<EditorUIContextType | null>(null);

interface EditorUIProviderProps {
    children: React.ReactNode;
    device: DeviceTypes;
    previewMode: boolean;
    liveMode: boolean;
    layerSidebarCollapsed: boolean;
}

export const EditorUIProvider = ({ children, device, previewMode, liveMode, layerSidebarCollapsed }: EditorUIProviderProps) => {
    const value = useMemo(
        () => ({
            device,
            previewMode,
            liveMode,
            layerSidebarCollapsed,
        }),
        [device, previewMode, liveMode, layerSidebarCollapsed]
    );

    return <EditorUIContext.Provider value={value}>{children}</EditorUIContext.Provider>;
};

export const useEditorUI = () => {
    const context = useContext(EditorUIContext);
    if (!context) {
        throw new Error("useEditorUI must be used within EditorUIProvider");
    }
    return context;
};

export const useDevice = () => {
    const { device } = useEditorUI();
    return device;
};

export const usePreviewMode = () => {
    const { previewMode } = useEditorUI();
    return previewMode;
};

export const useLiveMode = () => {
    const { liveMode } = useEditorUI();
    return liveMode;
};

export const useLayerSidebarCollapsed = () => {
    const { layerSidebarCollapsed } = useEditorUI();
    return layerSidebarCollapsed;
};

export const useIsEditMode = () => {
    const { previewMode, liveMode } = useEditorUI();
    return useMemo(() => !previewMode && !liveMode, [previewMode, liveMode]);
};

export const useIsInteractiveMode = () => {
    const { previewMode, liveMode } = useEditorUI();
    return useMemo(() => previewMode || liveMode, [previewMode, liveMode]);
};

export const useDeviceInfo = () => {
    const device = useDevice();
    return useMemo(
        () => ({
            device,
            isMobile: device === "Mobile",
            isTablet: device === "Tablet",
            isDesktop: device === "Desktop",
            containerClass: `device-${device.toLowerCase()}`,
            maxWidth: device === "Mobile" ? "420px" : device === "Tablet" ? "850px" : "100%",
        }),
        [device]
    );
};

export const useEditorLayout = () => {
    const { layerSidebarCollapsed, previewMode, liveMode, device } = useEditorUI();

    return useMemo(() => {
        const isFullscreen = previewMode || liveMode;

        return {
            isFullscreen,
            leftOffset: isFullscreen ? "0" : layerSidebarCollapsed ? "64px" : "320px",
            rightOffset: isFullscreen ? "0" : "400px",
            contentWidth: isFullscreen ? "100%" : device === "Mobile" ? "420px" : device === "Tablet" ? "850px" : "calc(100vw - 720px)", // Total sidebar widths
            containerStyles: {
                marginLeft: isFullscreen ? 0 : layerSidebarCollapsed ? 64 : 320,
                marginRight: isFullscreen ? 0 : 400,
                width: isFullscreen ? "100%" : "auto",
                transition: "all 0.2s ease-in-out",
            },
        };
    }, [layerSidebarCollapsed, previewMode, liveMode, device]);
};

export const useResponsiveStyles = () => {
    const device = useDevice();

    return useMemo(
        () => ({
            getResponsiveKey: () => device,
            shouldApplyStyle: (targetDevice: DeviceTypes | "all") => {
                return targetDevice === "all" || targetDevice === device;
            },
            getMediaQuery: () => {
                switch (device) {
                    case "Mobile":
                        return "(max-width: 767px)";
                    case "Tablet":
                        return "(min-width: 768px) and (max-width: 1023px)";
                    case "Desktop":
                        return "(min-width: 1024px)";
                    default:
                        return "";
                }
            },
        }),
        [device]
    );
};
