"use client";
import { EditorElement } from "@/providers/editor/editor-provider";
import { getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import React, { useEffect, useState, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useElementBorderHighlight } from "@/hooks/editor/use-element-border-highlight";
import { PulsatingButton } from "@/components/ui/pulsating-button";
import { useIsElementSelected } from "@/providers/editor/editor-elements-provider";
import { useDevice, useLiveMode } from "@/providers/editor/editor-ui-context";
import { useElementSelection } from "@/hooks/editor/use-element-selection";

type Props = {
    element: EditorElement;
};

const PulsatingButtonComponent = ({ element }: Props) => {
    const { id, styles, content, type } = element;
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [showSpacingGuides, setShowSpacingGuides] = useState(false);
    const { updateElement } = useElementActions();
    const { handleSelectElement } = useElementSelection(element);
    const { getBorderClasses, handleMouseEnter, handleMouseLeave, isSelected } = useElementBorderHighlight(element);
    const isElementSelected = useIsElementSelected(id);
    const device = useDevice();
    const liveMode = useLiveMode();

    // Get computed styles based on current device
    const computedStyles = getElementStyles(element, device);

    // dnd-kit sortable
    const sortable = useSortable({
        id: id,
        data: {
            type: type,
            elementId: id,
            name: "Pulsating Button",
            isSidebarElement: false,
            isEditorElement: true,
        },
        disabled: liveMode,
    });

    const handleBlurElement = () => {
        if (buttonRef.current) {
            const currentContent = Array.isArray(content) ? {} : content;

            updateElement({
                ...element,
                content: {
                    ...currentContent,
                    innerText: buttonRef.current.innerText,
                    pulseColor: (currentContent as any).pulseColor || "#808080",
                    duration: (currentContent as any).duration || "1.5s",
                    href: (currentContent as any).href || "",
                } as any,
            });
        }
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!liveMode) {
            e.stopPropagation();
            handleSelectElement(e);
        } else {
            // Live mode'da link açma işlevi
            const contentData = Array.isArray(content) ? {} : content;
            const href = (contentData as any).href;
            if (href && !e.defaultPrevented) {
                e.preventDefault();
                window.open(href, "_blank", "noopener,noreferrer");
            }
        }
    };

    useEffect(() => {
        if (buttonRef.current && !Array.isArray(content)) {
            buttonRef.current.innerText = content.innerText as string || "Click me";
        }
    }, [content]);

    useEffect(() => {
        setShowSpacingGuides(isElementSelected && !liveMode);
    }, [isElementSelected, id, liveMode]);

    const contentData = Array.isArray(content) ? {} : content;
    const pulseColor = (contentData as any).pulseColor || "#808080";
    const duration = (contentData as any).duration || "1.5s";

    console.log("🔧 PulsatingButton - Render - Content Data:", contentData);
    console.log("🔧 PulsatingButton - Render - Pulse Color:", pulseColor);
    console.log("🔧 PulsatingButton - Render - Duration:", duration);

    return (
        <EditorElementWrapper element={element}>
            <div
                ref={sortable.setNodeRef}
                style={sortable.transform ? { transform: CSS.Transform.toString(sortable.transform) } : undefined}
                className={clsx("relative group", getBorderClasses(), sortable.isDragging && "opacity-50")}
                onClick={handleSelectElement}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                data-element-id={id}
            >
                {showSpacingGuides && <SpacingVisualizer styles={computedStyles} />}

                <PulsatingButton
                    ref={buttonRef}
                    pulseColor={pulseColor}
                    duration={duration}
                    suppressHydrationWarning={true}
                    onBlur={handleBlurElement}
                    className={clsx({
                        "select-none": !isElementSelected,
                    })}
                    onClick={handleButtonClick}
                    contentEditable={!liveMode && isElementSelected}
                >
                    {!Array.isArray(content) ? content.innerText : "Click me"}
                </PulsatingButton>
                <DeleteElementButton element={element} />
            </div>
        </EditorElementWrapper>
    );
};

export default PulsatingButtonComponent;
