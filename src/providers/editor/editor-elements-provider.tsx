"use client";

import { createContext, useContext, useMemo } from "react";
import { EditorElement } from "./editor-provider";

export interface EditorElementsContextType {
    elements: EditorElement[];
    selectedElement: EditorElement;
}

export const EditorElementsContext = createContext<EditorElementsContextType | null>(null);

interface EditorElementsProviderProps {
    children: React.ReactNode;
    elements: EditorElement[];
    selectedElement: EditorElement;
}

export const EditorElementsProvider = ({ children, elements, selectedElement }: EditorElementsProviderProps) => {
    const value = useMemo(
        () => ({
            elements,
            selectedElement,
        }),
        [elements, selectedElement]
    );

    return <EditorElementsContext.Provider value={value}>{children}</EditorElementsContext.Provider>;
};

export const useEditorElements = () => {
    const context = useContext(EditorElementsContext);
    if (!context) {
        throw new Error("useEditorElements must be used within EditorElementsProvider");
    }
    return context;
};

export const useElements = () => {
    const { elements } = useEditorElements();
    return elements;
};

export const useSelectedElement = () => {
    const { selectedElement } = useEditorElements();
    return selectedElement;
};

export const useSelectedElementId = () => {
    const { selectedElement } = useEditorElements();
    return useMemo(() => selectedElement.id, [selectedElement.id]);
};

export const useIsElementSelected = (elementId: string) => {
    const selectedElementId = useSelectedElementId();
    return useMemo(() => selectedElementId === elementId, [selectedElementId, elementId]);
};

export const useElementsCount = () => {
    const elements = useElements();
    return useMemo(() => {
        const countRecursive = (elements: EditorElement[]): number => {
            return elements.reduce((count, element) => {
                const childCount = Array.isArray(element.content) ? countRecursive(element.content) : 0;
                return count + 1 + childCount;
            }, 0);
        };
        return countRecursive(elements);
    }, [elements]);
};

export const useElementById = (elementId: string) => {
    const elements = useElements();
    return useMemo(() => {
        const findElement = (elements: EditorElement[], id: string): EditorElement | null => {
            for (const element of elements) {
                if (element.id === id) return element;
                if (Array.isArray(element.content)) {
                    const found = findElement(element.content, id);
                    if (found) return found;
                }
            }
            return null;
        };
        return findElement(elements, elementId);
    }, [elements, elementId]);
};

export const useHasChildElements = (elementId: string) => {
    const element = useElementById(elementId);
    return useMemo(() => {
        return element && Array.isArray(element.content) && element.content.length > 0;
    }, [element]);
};
