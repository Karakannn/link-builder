"use client";

import { useCallback } from "react";
import { useEditor } from "@/providers/editor/editor-provider";
import type { EditorElement } from "@/providers/editor/editor-provider";
import { useElementActions } from "../editor-actions/use-element-actions";

export const useSmartSelection = () => {
    const { state } = useEditor();
    const { selectElement } = useElementActions();

    const getElementHierarchyFromDOM = useCallback((event: React.MouseEvent): EditorElement[] => {
        const hierarchy: EditorElement[] = [];
        const path = event.nativeEvent.composedPath() as HTMLElement[];

        const elementIds: string[] = [];
        for (const domElement of path) {
            if (domElement.dataset?.elementId) {
                elementIds.push(domElement.dataset.elementId);
            }
        }

        const findElementById = (id: string, elements: EditorElement[]): EditorElement | null => {
            for (const element of elements) {
                if (element.id === id) return element;
                if (Array.isArray(element.content)) {
                    const found = findElementById(id, element.content);
                    if (found) return found;
                }
            }
            return null;
        };

        for (const id of elementIds) {
            const element = findElementById(id, state.editor.elements);
            if (element) {
                hierarchy.push(element);
            }
        }

        return hierarchy.reverse(); // En dıştan en içe
    }, [state.editor.elements]);

    const handleSmartSelection = useCallback((event: React.MouseEvent, clickedElement: EditorElement) => {
        const hierarchy = getElementHierarchyFromDOM(event);

        if (hierarchy.length === 0) {
            selectElement(clickedElement);
            return;
        }

        const currentSelectedId = state.editor.selectedElement.id;
        
        // Hiçbir şey seçili değil - direkt tıklanan elementi seç
        if (!currentSelectedId || currentSelectedId === "") {
            selectElement(clickedElement);
            return;
        }

        // Aynı elemente tekrar tıklanmış - parent'a çık
        if (currentSelectedId === clickedElement.id) {
            // Eğer bu element'in çocuğu yoksa (leaf element), aynı yerde kal
            const hasChildren = Array.isArray(clickedElement.content) && clickedElement.content.length > 0;
            
            if (!hasChildren) {
                // Leaf element - aynı yerde kal (content editing için)
                selectElement(clickedElement);
                return;
            }

            // Container element - parent'a çık
            const currentIndex = hierarchy.findIndex(el => el.id === currentSelectedId);
            if (currentIndex > 0) {
                selectElement(hierarchy[currentIndex - 1]); // Parent'a git
            } else {
                selectElement(clickedElement); // Zaten en dışta, aynı yerde kal
            }
            return;
        }

        // Farklı element - direkt seç
        selectElement(clickedElement);
    }, [getElementHierarchyFromDOM, state.editor.selectedElement.id, selectElement]);

    return {
        handleSmartSelection,
        getElementHierarchyFromDOM,
    };
};