"use client";

import React from "react";
import { useEditor } from "@/providers/editor/editor-provider";
import { EditorElement } from "@/providers/editor/editor-provider";
import ElementContextMenu from "@/providers/editor/editor-contex-menu";

interface EditorElementWrapperProps {
    element: EditorElement;
    children: React.ReactNode;
}

export function EditorElementWrapper({ element, children }: EditorElementWrapperProps) {
    const { state } = useEditor();

    // Live mode'da context menü olmadan sadece children'ı render et
    if (state.editor.liveMode) {
        return <>{children}</>;
    }

    // Edit mode'da context menü ile sar
    return (
        <ElementContextMenu element={element}>
            {children}
        </ElementContextMenu>
    );
} 