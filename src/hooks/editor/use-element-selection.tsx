import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { useCallback } from "react";

export const useElementSelection = (element: EditorElement) => {
    const { dispatch } = useEditor();

    const handleSelectElement = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch({
            type: "CHANGE_CLICKED_ELEMENT",
            payload: {
                elementDetails: element,
            },
        });
    }, [dispatch, element]);

    return {
        handleSelectElement,
    };
};

// Yeni hook: Element ve alt elementlerinin border'larını yönetir
export const useElementBorderHighlight = (element: EditorElement) => {
    const { state } = useEditor();
    
    // Element'in seçili olup olmadığını kontrol eder
    const isSelected = state.editor.selectedElement.id === element.id;
    
    // Element'in seçili bir parent'ı olup olmadığını kontrol eder
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
    
    // Her zaman border gösteren element tipleri
    const alwaysShowBorderTypes = ["container", "gridLayout", "column", "__body"];
    const shouldAlwaysShowBorder = alwaysShowBorderTypes.includes(element.type || "");
    
    // Border className'lerini döndürür
    const getBorderClasses = () => {
        const baseClasses = "transition-all";
        
        if (state.editor.liveMode) {
            return baseClasses;
        }
        
        // Container, grid layout ve column her zaman border göstersin
        if (shouldAlwaysShowBorder) {
            if (isSelected) {
                return `${baseClasses} !border-blue-500 !border-solid !border-2`;
            }
            return `${baseClasses} border-dashed border-[1px] border-slate-300`;
        }
        
        // Diğer elementler sadece seçili olduğunda veya parent seçili olduğunda border göstersin
        if (isSelected) {
            return `${baseClasses} !border-blue-500 !border-solid !border-2`;
        }
        
        if (isChildOfSelected) {
            return `${baseClasses} !border-green-400 !border-dashed !border-2`;
        }
        
        // Normal durumda border gösterme (container, grid, column dışındaki elementler için)
        return baseClasses;
    };
    
    return {
        isSelected,
        isChildOfSelected,
        getBorderClasses,
    };
};