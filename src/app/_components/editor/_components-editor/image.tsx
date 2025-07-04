"use client";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { getElementContent, getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import React, { useEffect, useState, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";
import { Image as ImageIcon, Upload } from "lucide-react";
import { useElementSelection, useElementBorderHighlight } from "@/hooks/editor/use-element-selection";

type Props = {
    element: EditorElement;
};

const ImageComponent = ({ element }: Props) => {
    const { state, dispatch } = useEditor();
    const { id } = element;
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const { handleSelectElement } = useElementSelection(element);
    const { getBorderClasses } = useElementBorderHighlight(element);

    const computedStyles = getElementStyles(element, state.editor.device);
    const computedContent = getElementContent(element, state.editor.device);

    // Placeholder image data URL (a simple gray placeholder)
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
    const alt = imageProps.alt || 'Sponsor Logo';
    const objectFit = imageProps.objectFit || 'contain';
    const maxWidth = imageProps.maxWidth || '80%';
    const height = imageProps.height || '24px';
    const borderRadius = imageProps.borderRadius || 0;
    const shadow = imageProps.shadow || 'none';
    const filter = imageProps.filter || 'none';
    const opacity = imageProps.opacity || 1;

    const handleImageLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
        setHasError(true);
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
                    "cursor-grab": !state.editor.liveMode,
                    "cursor-grabbing": sortable.isDragging,
                    "opacity-50": sortable.isDragging,
                })}
                onClick={handleSelectElement}
                data-element-id={id}
                {...(!state.editor.liveMode ? sortable.listeners : {})}
                {...(!state.editor.liveMode ? sortable.attributes : {})}
            >
                {state.editor.selectedElement.id === id && !state.editor.liveMode && (
                    <BadgeElementName element={element} />
                )}

                {src ? (
                    <>
                        <img
                            ref={imgRef}
                            src={src}
                            alt={alt}
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
                                height: height,
                                maxWidth: maxWidth,
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

                        {hasError && (
                            <div className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-[200px]">
                                <div className="text-center text-gray-500">
                                    <ImageIcon className="mx-auto h-12 w-12 mb-2" />
                                    <div>Resim yuklenemedi</div>
                                    <div className="text-sm">Gecerli bir resim URL'si ekleyin</div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {/* Placeholder Image */}
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
                                height: height,
                                maxWidth: maxWidth,
                                objectFit: objectFit as any,
                                borderRadius: `${borderRadius}px`,
                                opacity: opacity,
                            }}
                        />

                        {/* Placeholder Overlay */}
                        {!state.editor.liveMode && (
                            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded">
                                <div className="text-center text-white bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                                    <Upload className="mx-auto h-6 w-6 mb-1" />
                                    <div className="text-sm font-medium">Resim Ekle</div>
                                    <div className="text-xs opacity-75">Ayarlardan resim URL'si ekleyin</div>
                                </div>
                            </div>
                        )}
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
