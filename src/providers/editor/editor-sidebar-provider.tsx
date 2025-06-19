import React, { ChangeEventHandler, createContext, useContext, useEffect, useReducer, useState } from "react";
import { DeviceTypes, EditorState, useEditor } from "./editor-provider";
import { getElementContent } from "@/lib/utils";
import { Laptop, Tablet, Smartphone } from "lucide-react";

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
  getCurrentStyles: () => {},
  getCurrentContent: () => {},
  handleColorChange: () => {},
  handleChangeCustomValues: () => {},
  handleStyleColorChangeComplete: () => {},
  handleResetToDesktop: () => {},
  handleOnChanges: () => {},
  activeDevice: "Desktop",
  setActiveDevice: () => {},
});

type EditorSidebarProps = {
  children: React.ReactNode;
};

const EditorSidebarProvider = ({ children }: EditorSidebarProps) => {
  const { state, dispatch } = useEditor();

  const [activeDevice, setActiveDevice] = useState<DeviceTypes>(state.editor.device);

  useEffect(() => {
    setActiveDevice(state.editor.device);
  }, [state.editor.device]);

  // Function to get the current styles based on the active device
  const getCurrentStyles = () => {
    const element = state.editor.selectedElement;
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
    return getElementContent(state.editor.selectedElement, activeDevice);
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

    if (activeDevice === "Desktop") {
      // Update base content values for Desktop
      if (Array.isArray(state.editor.selectedElement.content)) {
        // For containers, content is an array, so we don't update it here
        return;
      }
      
      dispatch({
        type: "UPDATE_ELEMENT",
        payload: {
          elementDetails: {
            ...state.editor.selectedElement,
            content: {
              ...state.editor.selectedElement.content,
              [settingProperty]: value,
            },
          },
        },
      });
    } else {
      // Update responsive content for Tablet/Mobile
      if (Array.isArray(state.editor.selectedElement.content)) {
        // For containers, content is an array, so we don't update it here
        return;
      }
      
      const currentContent = state.editor.selectedElement.content as any;
      const currentResponsiveContent = currentContent?.responsiveContent || {};
      
      dispatch({
        type: "UPDATE_ELEMENT",
        payload: {
          elementDetails: {
            ...state.editor.selectedElement,
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

    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          responsiveStyles: {
            ...state.editor.selectedElement.responsiveStyles,
            [activeDevice]: {},
          },
        },
      },
    });
  };

  // Handle changes to styles - now considers active device
  const handleOnChanges = (e: any) => {
    const settingProperty = e.target.id;
    let value = e.target.value;

    if (activeDevice === "Desktop") {
      // Update base styles for Desktop
      dispatch({
        type: "UPDATE_ELEMENT",
        payload: {
          elementDetails: {
            ...state.editor.selectedElement,
            styles: {
              ...state.editor.selectedElement.styles,
              [settingProperty]: value,
            },
          },
        },
      });
    } else {
      // Update responsive styles for Tablet/Mobile
      const currentResponsiveStyles = state.editor.selectedElement.responsiveStyles || {};
      
      dispatch({
        type: "UPDATE_ELEMENT",
        payload: {
          elementDetails: {
            ...state.editor.selectedElement,
            responsiveStyles: {
              ...currentResponsiveStyles,
              [activeDevice]: {
                ...currentResponsiveStyles[activeDevice],
                [settingProperty]: value,
              },
            },
          },
        },
      });
    }
  };

  // Function to get device icon
  const getDeviceIcon = (device: DeviceTypes) => {
    switch (device) {
      case "Desktop":
        return <Laptop className="h-4 w-4" />;
      case "Tablet":
        return <Tablet className="h-4 w-4" />;
      case "Mobile":
        return <Smartphone className="h-4 w-4" />;
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
