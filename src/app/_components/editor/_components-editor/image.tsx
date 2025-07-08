"use client";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { getElementContent, getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import React, { useEffect, useState, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";
import { Image as ImageIcon, Upload, AlertCircle } from "lucide-react";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useElementBorderHighlight } from "@/hooks/editor/use-element-border-highlight";

type Props = {
    element: EditorElement;
};

const ImageComponent = ({ element }: Props) => {
    const { state, dispatch } = useEditor();
    const { id } = element;
    const [isLoading, setIsLoading] = useState(true);
    const imgRef = useRef<HTMLImageElement>(null);
    const { selectElement } = useElementActions();
    const { getBorderClasses, handleMouseEnter, handleMouseLeave, isSelected } = useElementBorderHighlight(element);

    const computedStyles = getElementStyles(element, state.editor.device);
    const computedContent = getElementContent(element, state.editor.device);

    const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' fill='%239ca3af'%3EPlaceholder Image%3C/text%3E%3C/svg%3E";

    const sortable = useSortable({
        id: id,
        data: {
            type: "image",
            elementId: id,
            name: "Image",
            isSidebarElement: false,
            isEditorElement: true,
        },
        disabled: state.editor.liveMode,
    });

    const imageProps = !Array.isArray(computedContent) ? computedContent : {};
    const src = imageProps.src || '';
    const objectFit = imageProps.objectFit || 'contain';
    const borderRadius = imageProps.borderRadius || 0;
    const shadow = imageProps.shadow || 'none';
    const filter = imageProps.filter || 'none';
    const opacity = imageProps.opacity || 1;

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
    };

    const getShadowClass = () => {
        switch (shadow) {
            case 'small': return 'shadow-sm';
            case 'medium': return 'shadow-md';
            case 'large': return 'shadow-lg';
            case 'xl': return 'shadow-xl';
            case '2xl': return 'shadow-2xl';
            default: return '';
        }
    };

    const getFilterClass = () => {
        switch (filter) {
            case 'grayscale': return 'grayscale';
            case 'sepia': return 'sepia';
            case 'blur': return 'blur-sm';
            case 'brightness': return 'brightness-110';
            case 'contrast': return 'contrast-125';
            default: return '';
        }
    };

    return (
        <EditorElementWrapper element={element}>
            <div
                ref={sortable.setNodeRef}
                style={{
                    ...computedStyles,
                    transform: CSS.Transform.toString(sortable.transform),
                    transition: sortable.transition,
                }}
                className={clsx("relative", getBorderClasses(), {
                    "cursor-grabbing": sortable.isDragging,
                    "opacity-50": sortable.isDragging,
                })}
                onClick={() => selectElement(element)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                data-element-id={id}
                {...(!state.editor.liveMode ? sortable.listeners : {})}
                {...(!state.editor.liveMode ? sortable.attributes : {})}
            >
                {src ? (
                    <>
                        <img
                            ref={imgRef}
                            src={src}
                            className={clsx(
                                "max-w-full h-auto transition-all duration-300",
                                getShadowClass(),
                                getFilterClass(),
                                {
                                    "pointer-events-none": !state.editor.liveMode && !state.editor.previewMode,
                                }
                            )}
                            style={{
                                width: computedStyles.width || 'auto',
                                height: computedStyles.height || 'auto',
                                objectFit: objectFit as any,
                                borderRadius: `${borderRadius}px`,
                                opacity: opacity,
                            }}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                        />

                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <img
                            src={placeholderImage}
                            alt="Placeholder"
                            className={clsx(
                                "max-w-full h-auto transition-all duration-300",
                                getShadowClass(),
                                getFilterClass(),
                                {
                                    "pointer-events-none": !state.editor.liveMode && !state.editor.previewMode,
                                }
                            )}
                            style={{
                                width: computedStyles.width || 'auto',
                                height: computedStyles.height || 'auto',
                                maxWidth: computedStyles.maxWidth || '80%',
                                objectFit: objectFit as any,
                                borderRadius: `${borderRadius}px`,
                                opacity: opacity,
                            }}
                        />
                    </>
                )}

                {state.editor.selectedElement.id === id && !state.editor.liveMode && (
                    <DeleteElementButton element={element} />
                )}
            </div>
        </EditorElementWrapper>
    );
};

export default ImageComponent;
