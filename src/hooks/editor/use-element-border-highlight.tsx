import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { useCallback, useState } from "react";

export const useElementBorderHighlight = (element: EditorElement) => {
    const { state } = useEditor();
    const [isHovered, setIsHovered] = useState(false);

    const isSelected = state.editor.selectedElement.id === element.id;

    const hasSelectedParent = (elementId: string, selectedId: string): boolean => {
        // Seçili element yoksa false döndür
        if (!selectedId || selectedId === "") return false;

        if (elementId === selectedId) return true;

        // Seçili element'in alt elementlerini kontrol et
        const selectedElement = state.editor.selectedElement;
        if (selectedElement.id && selectedElement.content) {
            const checkInContent = (content: any[]): boolean => {
                for (const child of content) {
                    if (child.id === elementId) return true;
                    if (Array.isArray(child.content)) {
                        if (checkInContent(child.content)) return true;
                    }
                }
                return false;
            };

            if (Array.isArray(selectedElement.content)) {
                return checkInContent(selectedElement.content);
            }
        }

        return false;
    };

    const isChildOfSelected = hasSelectedParent(element.id, state.editor.selectedElement.id);

    const alwaysShowBorderTypes = ["container", "gridLayout", "column", "__body"];
    const shouldAlwaysShowBorder = alwaysShowBorderTypes.includes(element.type || "");

    const handleMouseEnter = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (!state.editor.liveMode) {
            setIsHovered(true);
        }
    }, [state.editor.liveMode]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    const getBorderClasses = () => {
        const baseClasses = "transition-all";

        if (state.editor.liveMode) {
            return baseClasses;
        }

        if (shouldAlwaysShowBorder) {
            if (isSelected) {
                return `${baseClasses} !border-blue-500 !border-1`;
            }
            if (isHovered) {
                return `${baseClasses} border-solid border-[1px] border-blue-400`;
            }
            return `${baseClasses} border-dashed border-[0.5px] border-slate-100/40`;
        }

        if (isSelected) {
            return `${baseClasses} !border-blue-500 !border-1`;
        }

        if (isHovered) {
            return `${baseClasses} !border-blue-300 !border-dashed !border-1`;
        }
        return baseClasses;
    };

    const shouldShowBadge = (isHovered || isSelected) && !state.editor.liveMode;
    const shouldShowDeleteButton = isSelected && !state.editor.liveMode && element.type !== "__body";

    return {
        isSelected,
        isHovered,
        isChildOfSelected,
        getBorderClasses,
        shouldShowBadge,
        shouldShowDeleteButton,
        handleMouseEnter,
        handleMouseLeave,
    };
}; 