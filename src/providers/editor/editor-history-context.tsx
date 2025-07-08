"use client";

import { createContext, useContext, useMemo } from "react";

export interface EditorHistoryContextType {
    currentIndex: number;
    historyLength: number;
    canUndo: boolean;
    canRedo: boolean;
    hasUnsavedChanges: boolean;
}

export const EditorHistoryContext = createContext<EditorHistoryContextType | null>(null);

interface EditorHistoryProviderProps {
    children: React.ReactNode;
    currentIndex: number;
    historyLength: number;
}

export const EditorHistoryProvider = ({ children, currentIndex, historyLength }: EditorHistoryProviderProps) => {
    const value = useMemo(() => {
        const canUndo = currentIndex > 0;
        const canRedo = currentIndex < historyLength - 1;
        const hasUnsavedChanges = currentIndex > 0;

        return {
            currentIndex,
            historyLength,
            canUndo,
            canRedo,
            hasUnsavedChanges,
        };
    }, [currentIndex, historyLength]);

    return <EditorHistoryContext.Provider value={value}>{children}</EditorHistoryContext.Provider>;
};

export const useEditorHistory = () => {
    const context = useContext(EditorHistoryContext);
    if (!context) {
        throw new Error("useEditorHistory must be used within EditorHistoryProvider");
    }
    return context;
};

export const useCanUndo = () => {
    const { canUndo } = useEditorHistory();
    return canUndo;
};

export const useCanRedo = () => {
    const { canRedo } = useEditorHistory();
    return canRedo;
};

export const useHasUnsavedChanges = () => {
    const { hasUnsavedChanges } = useEditorHistory();
    return hasUnsavedChanges;
};

export const useHistoryInfo = () => {
    const { currentIndex, historyLength } = useEditorHistory();

    return useMemo(
        () => ({
            currentIndex,
            historyLength,
            currentStep: currentIndex + 1,
            totalSteps: historyLength,
            progressPercentage: historyLength > 0 ? ((currentIndex + 1) / historyLength) * 100 : 0,
        }),
        [currentIndex, historyLength]
    );
};

export const useHistoryNavigation = () => {
    const { canUndo, canRedo, currentIndex, historyLength } = useEditorHistory();

    return useMemo(
        () => ({
            canUndo,
            canRedo,

            // Navigation info
            undoStepsAvailable: currentIndex,
            redoStepsAvailable: historyLength - currentIndex - 1,

            // Status helpers
            isAtBeginning: currentIndex === 0,
            isAtEnd: currentIndex === historyLength - 1,

            // UI text helpers
            getUndoTooltip: () => (canUndo ? `Undo (${currentIndex} steps available)` : "Nothing to undo"),
            getRedoTooltip: () => (canRedo ? `Redo (${historyLength - currentIndex - 1} steps available)` : "Nothing to redo"),

            // Keyboard shortcut info
            getShortcuts: () => ({
                undo: "Ctrl+Z (⌘+Z on Mac)",
                redo: "Ctrl+Y (⌘+Y on Mac)",
            }),
        }),
        [canUndo, canRedo, currentIndex, historyLength]
    );
};
