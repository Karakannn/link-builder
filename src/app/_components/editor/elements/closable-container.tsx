"use client";

import { EditorElement } from "@/providers/editor/editor-provider";
import { cn } from "@/lib/utils";
import { getElementStyles } from "@/lib/utils";
import { X } from "lucide-react";
import Recursive from "@/app/_components/editor/_components-editor/recursive";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useLayout, Layout } from "@/hooks/use-layout";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { usePreviewMode, useLiveMode, useDevice } from "@/providers/editor/editor-ui-context";
import { useIsElementSelected } from "@/providers/editor/editor-elements-provider";
import { useElementBorderHighlight, useElementSelection } from "@/hooks/editor/use-element-selection";

interface ClosableContainerProps {
    element: EditorElement;
    layout?: Layout;
}

export const ClosableContainer = ({ element, layout = "vertical" }: ClosableContainerProps) => {
    const [mounted, setMounted] = useState(false);
    const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
    const { deleteElement } = useElementActions();
    const { handleSelectElement } = useElementSelection(element);
    const { handleMouseEnter, handleMouseLeave } = useElementBorderHighlight(element);

    const droppable = useDroppable({
        id: `droppable-${element.id}`,
        data: {
            type: "closableContainer",
            containerId: element.id,
        },
    });

    const previewMode = usePreviewMode();
    const liveMode = useLiveMode();
    const device = useDevice();

    useEffect(() => {
        setMounted(true);
        const bodyContainer = document.querySelector('[data-body-container="true"]');

        if (bodyContainer) {
            setPortalContainer(bodyContainer as HTMLElement);
        }
    }, []);

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteElement(element);
    };

    const isSelected = useIsElementSelected(element.id);
    const isAbsolute = element.styles.position === "absolute";
    const isPreviewMode = previewMode || liveMode;

    const computedStyles = getElementStyles(element, device);

    if (isAbsolute && mounted && portalContainer) {

        const portalContent = (
            <div

                ref={droppable.setNodeRef}
                className={cn(
                    "group relative",
                    // Edit mode'da her zaman border göster, absolute elementler için farklı border
                    !isPreviewMode && "border-2 border-dashed",
                    !isPreviewMode && isAbsolute && "border-orange-400 bg-orange-50/20",
                    !isPreviewMode && !isAbsolute && "border-blue-400 bg-blue-50/20",
                    // Seçili durumda absolute elementler için turuncu ring, normal elementler için mavi ring
                    isSelected && !isPreviewMode && isAbsolute && "ring-2 ring-orange-500 ring-offset-2",
                    isSelected && !isPreviewMode && !isAbsolute && "ring-2 ring-blue-500 ring-offset-2",
                    droppable.isOver && !isPreviewMode && "!border-green-500 !border-2 !bg-green-50/50"
                )}
                style={{
                    ...computedStyles,
                    position: "absolute",
                    top: computedStyles.top,
                    left: computedStyles.left,
                    right: computedStyles.right,
                    bottom: computedStyles.bottom,
                    width: computedStyles.width,
                    zIndex: computedStyles.zIndex || 10,
                    maxWidth: "100%",
                    maxHeight: "100%",
                }}
                onClick={handleSelectElement}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                data-element-id={element.id}
            >
                {/* Close button - show in both edit and live mode */}
                {(isSelected || isPreviewMode) && (
                    <button
                        onClick={handleClose}
                        className="absolute -top-2 -right-2 z-20 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors shadow-lg"
                        title="Close container"
                    >
                        <X size={14} />
                    </button>
                )}

                {/* Drop indicator */}
                {droppable.isOver && !isPreviewMode && (
                    <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                        style={{
                            backgroundColor: "rgba(34, 197, 94, 0.1)",
                            border: "2px dashed #22c55e",
                        }}
                    >
                        <span className="bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium shadow-lg">Drop Here</span>
                    </div>
                )}

                {/* Container content */}
                <div
                    style={{
                        position: "relative",
                        top: "auto",
                        left: "auto",
                        right: "auto",
                        bottom: "auto",
                        zIndex: "auto",
                        width: "100%",
                        maxWidth: "100%",
                    }}
                    className={cn("min-h-[50px] min-w-[100px]", isSelected && !isPreviewMode && "outline-dashed outline-2 outline-blue-500")}
                >
                    {Array.isArray(element.content) && element.content.length > 0 && (
                        element.content.map((childElement) => (
                            <Recursive key={childElement.id} element={childElement} />
                        ))
                    )}

                    {Array.isArray(element.content) && element.content.length === 0 && (
                        <div className="min-h-[50px] text-gray-400 text-center py-4">Drop elements here</div>
                    )}
                </div>
            </div>
        );

        return createPortal(portalContent, portalContainer);
    }

    // Normal rendering for all other positioning
    return (
        <div
            ref={droppable.setNodeRef}
            className={cn(
                "group relative",
                // Edit mode'da her zaman border göster, absolute elementler için farklı border
                !isPreviewMode && "border-2 border-dashed",
                !isPreviewMode && isAbsolute && "border-orange-400 bg-orange-50/20",
                !isPreviewMode && !isAbsolute && "border-blue-400 bg-blue-50/20",
                // Seçili durumda absolute elementler için turuncu ring, normal elementler için mavi ring
                isSelected && !isPreviewMode && isAbsolute && "ring-2 ring-orange-500 ring-offset-2",
                isSelected && !isPreviewMode && !isAbsolute && "ring-2 ring-blue-500 ring-offset-2",
                droppable.isOver && !isPreviewMode && "!border-green-500 !border-2 !bg-green-50/50"
            )}
            style={computedStyles} // Custom CSS buraya uygulanıyor
            onClick={handleSelectElement}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            data-element-id={element.id}
        >
            {/* Close button - show in both edit and live mode */}
            {(isSelected || isPreviewMode) && (
                <button
                    onClick={handleClose}
                    className="absolute -top-2 -right-2 z-20 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors shadow-lg"
                    title="Close container"
                >
                    <X size={14} />
                </button>
            )}

            {/* Drop indicator */}
            {droppable.isOver && !isPreviewMode && (
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                    style={{
                        backgroundColor: "rgba(34, 197, 94, 0.1)",
                        border: "2px dashed #22c55e",
                    }}
                >
                    <span className="bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium shadow-lg">Drop Here</span>
                </div>
            )}

            {/* Container content */}
            <div
                style={{
                    position: "relative",
                    top: "auto",
                    left: "auto",
                    right: "auto",
                    bottom: "auto",
                    zIndex: "auto",
                    width: "100%",
                    maxWidth: "100%",
                }}
                className={cn("min-h-[50px] min-w-[100px]", isSelected && !isPreviewMode && "outline-dashed outline-2 outline-blue-500")}
            >
                {Array.isArray(element.content) && element.content.length > 0 && (
                    element.content.map((childElement) => (
                        <Recursive key={childElement.id} element={childElement} />
                    ))
                )}

                {Array.isArray(element.content) && element.content.length === 0 && (
                    <div className="min-h-[50px] text-gray-400 text-center py-4">Drop elements here</div>
                )}
            </div>
        </div>
    );
};
