"use client";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { getElementContent, getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import React, { useEffect, useState, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";
import { Image as ImageIcon, Download } from "lucide-react";

type Props = {
    element: EditorElement;
};

const ImageComponent = ({ element }: Props) => {
    const { state, dispatch } = useEditor();
    const { id } = element;
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const spanRef = useRef<HTMLImageElement>(null);
    
    const computedStyles = getElementStyles(element, state.editor.device);
    const computedContent = getElementContent(element, state.editor.device);

    const draggable = useDraggable({
        id: `draggable-${id}`,
        data: {
            type: "image",
            elementId: id,
            name: "Image",
            isSidebarElement: false,
            isEditorElement: true,
        },
        disabled: state.editor.liveMode,
    });

    const handleOnClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!state.editor.liveMode && !draggable.isDragging) {
            dispatch({
                type: "CHANGE_CLICKED_ELEMENT",
                payload: {
                    elementDetails: element,
                },
            });
        }
    };

    const imageProps = !Array.isArray(computedContent) ? computedContent : {};
    const src = imageProps.src || '';
    const alt = imageProps.alt || 'Image';
    const objectFit = imageProps.objectFit || 'cover';
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
                ref={draggable.setNodeRef}
                style={computedStyles}
                className={clsx("relative transition-all", {
                    "!border-blue-500": state.editor.selectedElement.id === id,
                    "!border-solid": state.editor.selectedElement.id === id,
                    "!border-dashed border border-slate-300": !state.editor.liveMode,
                    "cursor-grab": !state.editor.liveMode,
                    "cursor-grabbing": draggable.isDragging,
                    "opacity-50": draggable.isDragging,
                })}
                onClick={handleOnClick}
                {...(!state.editor.liveMode ? draggable.listeners : {})}
                {...(!state.editor.liveMode ? draggable.attributes : {})}
            >
                {state.editor.selectedElement.id === id && !state.editor.liveMode && (
                    <BadgeElementName element={element} />
                )}

                <div 
                    className="relative inline-block"
                    onMouseEnter={() => setShowOverlay(true)}
                    onMouseLeave={() => setShowOverlay(false)}
                >
                    {src ? (
                        <div className="relative">
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
                                    height: computedStyles.height || 'auto',
                                    maxWidth: '100%',
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

                            {showOverlay && !state.editor.liveMode && src && !hasError && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 rounded">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const downloadLink = document.createElement('a');
                                                downloadLink.href = src;
                                                downloadLink.download = alt || 'image';
                                                downloadLink.click();
                                            }}
                                            className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                                            title="Indir"
                                        >
                                            <Download size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {src && !hasError && (
                                <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
                                    RESIM
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-[200px]">
                            <div className="text-center text-gray-500">
                                <ImageIcon className="mx-auto h-12 w-12 mb-2" />
                                <div>Resim kaynagi yok</div>
                                <div className="text-sm">Ayarlardan bir resim URL'si ekleyin</div>
                            </div>
                        </div>
                    )}
                </div>

                {state.editor.selectedElement.id === id && !state.editor.liveMode && (
                    <DeleteElementButton element={element} />
                )}
            </div>
        </EditorElementWrapper>
    );
};

export default ImageComponent;
