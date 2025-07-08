"use client";

import { createContext, useContext, useMemo, type Dispatch } from "react";
import { EditorAction } from "./editor-actions";

export interface EditorActionsContextType {
    dispatch: Dispatch<EditorAction>;
}

export const EditorActionsContext = createContext<EditorActionsContextType | null>(null);

interface EditorActionsProviderProps {
    children: React.ReactNode;
    dispatch: Dispatch<EditorAction>;
}

export const EditorActionsProvider = ({ children, dispatch }: EditorActionsProviderProps) => {
    const value = useMemo(() => ({ dispatch }), [dispatch]);

    return <EditorActionsContext.Provider value={value}>{children}</EditorActionsContext.Provider>;
};

export const useEditorActions = () => {
    const context = useContext(EditorActionsContext);
    if (!context) {
        throw new Error("useEditorActions must be used within EditorActionsProvider");
    }
    return context;
};
