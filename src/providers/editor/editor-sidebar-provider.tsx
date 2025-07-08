import React, { ChangeEventHandler, createContext, useContext, useEffect, useState } from "react";
import { DeviceTypes } from "./editor-provider";
import { getElementContent } from "@/lib/utils";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useSelectedElement } from "@/providers/editor/editor-elements-provider";
import { useDevice } from "@/providers/editor/editor-ui-context";

export const EditorSidebarContext = createContext<{
    getCurrentStyles: () => any;
    getCurrentContent: () => any;
    handleColorChange: (property: string, value: any) => void;
    handleChangeCustomValues: React.ChangeEventHandler<HTMLInputElement>;
    handleStyleColorChangeComplete: (property: string, value: any) => void;
    handleResetToDesktop: () => void;
    handleOnChanges: (e: any) => void;
    activeDevice: DeviceTypes;
    setActiveDevice: any;
}>({
    getCurrentStyles: () => { },
    getCurrentContent: () => { },
    handleColorChange: () => { },
    handleChangeCustomValues: () => { },
    handleStyleColorChangeComplete: () => { },
    handleResetToDesktop: () => { },
    handleOnChanges: () => { },
    activeDevice: "Desktop",
    setActiveDevice: () => { },
});

type EditorSidebarProps = {
    children: React.ReactNode;
};

const EditorSidebarProvider = ({ children }: EditorSidebarProps) => {
    const device = useDevice();
    const { updateElement } = useElementActions();
    const selectedElement = useSelectedElement();

    const [activeDevice, setActiveDevice] = useState<DeviceTypes>(device);

    useEffect(() => {
        setActiveDevice(device);
    }, [device]);

    // Function to get the current styles based on the active device
    const getCurrentStyles = () => {
        const element = selectedElement;
        if (activeDevice === "Desktop" || !element.responsiveStyles) {
            return element.styles;
        }
        return {
            ...element.styles,
            ...element.responsiveStyles[activeDevice],
        };
    };

    // Function to get the current content based on active device
    const getCurrentContent = () => {
        const elementContent = getElementContent(selectedElement, activeDevice);

        // If the element has customProperties, merge them with the content
        if (selectedElement.customProperties) {
            return {
                ...elementContent,
                customProperties: selectedElement.customProperties,
            };
        }

        return elementContent;
    };

    const handleColorChange = (property: string, value: any) => {
        let colorValue: string;

        if (Array.isArray(value) && value.length >= 3) {
            // Ensure we have valid numbers and handle potential floating point issues
            const r = Math.round(Number(value[0]) || 0);
            const g = Math.round(Number(value[1]) || 0);
            const b = Math.round(Number(value[2]) || 0);
            const a = Number(value[3]) !== undefined ? Number(value[3]) : 1;
            colorValue = `rgba(${r}, ${g}, ${b}, ${a})`;
        } else if (typeof value === "string" && value.length > 0) {
            colorValue = value;
        } else {
            colorValue = "#000000"; // fallback
        }

        handleChangeCustomValues({
            target: {
                id: property,
                value: colorValue,
            },
        } as any);
    };

    const handleChangeCustomValues: ChangeEventHandler<HTMLInputElement> = (e) => {
        const settingProperty = e.target.id;
        let value = e.target.value;

        // Check if this is a customProperties update
        if (settingProperty.startsWith("customProperties.")) {
            const propertyName = settingProperty.replace("customProperties.", "");

            updateElement({
                ...selectedElement,
                customProperties: {
                    ...selectedElement.customProperties,
                    [propertyName]: value,
                },
            });

            return;
        }

        if (activeDevice === "Desktop") {
            // Update base content values for Desktop
            if (Array.isArray(selectedElement.content)) {
                // For containers, content is an array, so we don't update it here
                return;
            }

            updateElement({
                ...selectedElement,
                content: {
                    ...selectedElement.content,
                    [settingProperty]: value,
                },
            });
        } else {
            // Update responsive content for Tablet/Mobile
            if (Array.isArray(selectedElement.content)) {
                // For containers, content is an array, so we don't update it here
                return;
            }

            const currentContent = selectedElement.content as any;
            const currentResponsiveContent = currentContent?.responsiveContent || {};

            updateElement({
                ...selectedElement,
                content: {
                    ...currentContent,
                    responsiveContent: {
                        ...currentResponsiveContent,
                        [activeDevice]: {
                            ...currentResponsiveContent[activeDevice],
                            [settingProperty]: value,
                        },
                    },
                },
            });
        }
    };

    // Handle color changes for styles (onChangeComplete version)
    const handleStyleColorChangeComplete = (property: string, value: any) => {
        let colorValue: string;

        if (Array.isArray(value) && value.length >= 3) {
            const r = Math.round(Number(value[0]) || 0);
            const g = Math.round(Number(value[1]) || 0);
            const b = Math.round(Number(value[2]) || 0);
            const a = Number(value[3]) !== undefined ? Number(value[3]) : 1;
            colorValue = `rgba(${r}, ${g}, ${b}, ${a})`;
        } else if (typeof value === "string" && value.length > 0) {
            colorValue = value;
        } else {
            colorValue = "#000000";
        }

        handleOnChanges({
            target: {
                id: property,
                value: colorValue,
            },
        } as any);
    };

    // Reset responsive styles to desktop values
    const handleResetToDesktop = () => {
        if (activeDevice === "Desktop") return;

        updateElement({
            ...selectedElement,
            responsiveStyles: {
                ...selectedElement.responsiveStyles,
                [activeDevice]: {},
            },
        });
    };

    // Handle changes to styles - now considers active device
    const handleOnChanges = (e: any) => {
        const settingProperty = e.target.id;
        let value = e.target.value;
        console.log(e.target);

        if (activeDevice === "Desktop") {
            // Update base styles for Desktop
            updateElement({
                ...selectedElement,
                styles: {
                    ...selectedElement.styles,
                    [settingProperty]: value,
                },
            });
        } else {
            // Update responsive styles for Tablet/Mobile
            const currentResponsiveStyles = selectedElement.responsiveStyles || {};

            updateElement({
                ...selectedElement,
                responsiveStyles: {
                    ...currentResponsiveStyles,
                    [activeDevice]: {
                        ...currentResponsiveStyles[activeDevice],
                        [settingProperty]: value,
                    },
                },
            });
        }
    };

    const values = {
        getCurrentStyles,
        getCurrentContent,
        handleColorChange,
        handleChangeCustomValues,
        handleStyleColorChangeComplete,
        handleResetToDesktop,
        handleOnChanges,
        activeDevice,
        setActiveDevice,
    };

    return <EditorSidebarContext.Provider value={values}>{children}</EditorSidebarContext.Provider>;
};

export const useEditorSidebar = () => {
    const context = useContext(EditorSidebarContext);
    if (!context) throw new Error("useEditor Hook must be used within the Editor Provider");
    return context;
};

export default EditorSidebarProvider;
