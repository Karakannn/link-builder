import React, { memo, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";

import type { EditorElement } from "@/providers/editor/editor-provider";
import { getElementStyles, getElementContent } from "@/lib/utils";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";
import { useIsElementSelected } from "@/providers/editor/editor-elements-provider";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useIsEditMode, useDevice } from "@/providers/editor/editor-ui-context";
import { useElementSelection } from "@/hooks/editor/use-element-selection";

type Props = {
    element: EditorElement;
};

const AnimatedTextComponent = memo(({ element }: Props) => {
    const { id, styles, content, type } = element;

    const isSelected = useIsElementSelected(id);
    const isEditMode = useIsEditMode();
    const device = useDevice();
    const { updateElement } = useElementActions();

    const spanRef = useRef<HTMLSpanElement | null>(null);
    const [showSpacingGuides, setShowSpacingGuides] = useState(false);
    const { handleSelectElement } = useElementSelection(element);

    const sortableConfig = useMemo(() => {
        return {
            id: id,
            data: {
                type: type,
                elementId: id,
                name: "Animated Text",
                isSidebarElement: false,
                isEditorElement: true,
            },
            disabled: !isEditMode,
        };
    }, [id, type, isEditMode]);

    // dnd-kit sortable
    const sortable = useSortable(sortableConfig);

    const computedContent = useMemo(() => {
        return getElementContent(element, device);
    }, [element, device]);

    const computedStyles = useMemo(() => {
        return {
            ...getElementStyles(element, device),
            transform: CSS.Transform.toString(sortable.transform),
            transition: sortable.transition,
        };
    }, [element, device, sortable.transform, sortable.transition]);

    const handleBlurElement = useCallback(() => {
        if (spanRef.current && isEditMode) {
            updateElement({
                ...element,
                content: {
                    ...computedContent,
                    innerText: spanRef.current.innerText,
                },
            });
        }
    }, [updateElement, element, computedContent, isEditMode]);

    useEffect(() => {
        if (spanRef.current && !Array.isArray(computedContent)) {
            spanRef.current.innerText = computedContent.innerText as string || "ANIMATED TEXT";
        }
    }, [computedContent, id]);

    useEffect(() => {
        setShowSpacingGuides(isSelected && isEditMode);
    }, [isSelected, isEditMode]);

    const textProps = !Array.isArray(computedContent) ? computedContent : {};
    const innerText = textProps.innerText || "ANIMATED TEXT";

    return (
        <EditorElementWrapper element={element}>
            <div
                ref={sortable.setNodeRef}
                style={{
                    ...computedStyles,
                    minHeight: '40px',
                    height: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                className={clsx("relative", {
                    "cursor-grabbing": sortable.isDragging,
                    "opacity-50": sortable.isDragging,
                    "outline-dashed outline-2 outline-blue-500": isSelected && isEditMode,
                })}
                onClick={handleSelectElement}
                data-element-id={id}
                {...(isEditMode ? sortable.listeners : {})}
                {...(isEditMode ? sortable.attributes : {})}
            >
                {showSpacingGuides && <SpacingVisualizer styles={computedStyles} />}

                <span
                    ref={spanRef}
                    suppressHydrationWarning={true}
                    contentEditable={isEditMode && isSelected}
                    onBlur={handleBlurElement}
                    className={clsx("live-neon", {
                        "select-none": !isSelected,
                    })}
                    onClick={handleSelectElement}
                    style={{
                        '--neon-text-color': textProps.neonTextColor || '#00ff00',
                        '--neon-border-color': textProps.neonBorderColor || '#00ff00',
                        color: textProps.neonTextColor || '#00ff00',
                        fontSize: computedStyles.fontSize || '24px',
                    } as React.CSSProperties}
                >
                    {innerText}
                </span>

                {isSelected && isEditMode && <DeleteElementButton element={element} />}
            </div>
        </EditorElementWrapper>
    );
});

export default AnimatedTextComponent; 