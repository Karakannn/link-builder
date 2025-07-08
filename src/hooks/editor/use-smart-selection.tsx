"use client";

import { useCallback } from "react";
import { useEditor } from "@/providers/editor/editor-provider";
import type { EditorElement } from "@/providers/editor/editor-provider";
import { useElementActions } from "../editor-actions/use-element-actions";

export const useSmartSelection = () => {
    const { state } = useEditor();
    const { selectElement } = useElementActions()

    // DOM'dan gerçek element hierarchy'sini al
    const getElementHierarchyFromDOM = useCallback((event: React.MouseEvent): EditorElement[] => {
        const hierarchy: EditorElement[] = [];

        // Event path'ini al (tıklanan elementten document'e kadar)
        const path = event.nativeEvent.composedPath() as HTMLElement[];

        // Element ID'lerini topla (data-element-id attribute'ından)
        const elementIds: string[] = [];

        for (const domElement of path) {
            if (domElement.dataset?.elementId) {
                elementIds.push(domElement.dataset.elementId);
            }
        }

        // Element ID'lerinden EditorElement objelerini bul
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

        // ID'leri EditorElement'lere çevir
        for (const id of elementIds) {
            const element = findElementById(id, state.editor.elements);
            if (element) {
                hierarchy.push(element);
            }
        }

        // En dıştan en içe sırala (DOM path zaten bu sırada)
        // İlk element en dış, son element en iç
        return hierarchy;
    }, [state.editor.elements]);

    // Smart selection handler
    const handleSmartSelection = useCallback((event: React.MouseEvent, clickedElement: EditorElement) => {
        const hierarchy = getElementHierarchyFromDOM(event);

        if (hierarchy.length === 0) {
            // Fallback: direkt seç
            selectElement(clickedElement)
            return;
        }

        // Şu anda seçili element hierarchy'de hangi pozisyonda?
        const currentIndex = hierarchy.findIndex(el => el.id === state.editor.selectedElement.id);

        if (currentIndex === -1) {
            // İlk tık: En dış elementi seç (hierarchy[0])
            selectElement(hierarchy[0])

        } else {
            // Sonraki tık: Bir seviye aşağı in
            const nextIndex = (currentIndex + 1) % hierarchy.length;
            selectElement(hierarchy[nextIndex])

        }
    }, [getElementHierarchyFromDOM, state.editor.selectedElement.id, selectElement]);

    // Bir sonraki seçilecek elementi öngör (preview için)
    const getNextSelection = useCallback((event: React.MouseEvent): EditorElement | null => {
        const hierarchy = getElementHierarchyFromDOM(event);

        if (hierarchy.length === 0) return null;

        const currentIndex = hierarchy.findIndex(el => el.id === state.editor.selectedElement.id);

        if (currentIndex === -1) {
            return hierarchy[0]; // İlk tık'ta seçilecek (en dış)
        } else {
            const nextIndex = (currentIndex + 1) % hierarchy.length;
            return hierarchy[nextIndex]; // Sonraki tık'ta seçilecek
        }
    }, [getElementHierarchyFromDOM, state.editor.selectedElement.id]);

    return {
        handleSmartSelection,
        getNextSelection,
        getElementHierarchyFromDOM,
    };
};