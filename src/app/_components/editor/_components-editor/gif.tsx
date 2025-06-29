"use client";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { getElementContent, getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import { Play, Pause, Image as ImageIcon, Download } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";
import { useElementSelection } from "@/hooks/editor/use-element-selection";

type Props = {
    element: EditorElement;
};

const GifComponent = ({ element }: Props) => {
    const { state, dispatch } = useEditor();
    const { id, name, type, styles, content } = element;
    const imgRef = useRef<HTMLImageElement>(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const { handleSelectElement } = useElementSelection(element);

    const computedStyles = getElementStyles(element, state.editor.device);
    const computedContent = getElementContent(element, state.editor.device);

    const sortable = useSortable({
        id: id,
        data: {
            type: "gif",
            elementId: id,
            name: "GIF",
            isSidebarElement: false,
            isEditorElement: true,
        },
        disabled: state.editor.liveMode,
    });

    const gifProps = !Array.isArray(computedContent) ? computedContent : {};
    const src = gifProps.src || '';
    const alt = gifProps.alt || 'GIF';

    const handleImageLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    const objectFit = styles?.objectFit || "cover";
    const borderRadius = styles?.borderRadius || 0;
    const opacity = styles?.opacity || 1;

    return (
        <EditorElementWrapper element={element}>
            <div
                ref={sortable.setNodeRef}
                style={computedStyles}
                className={clsx("relative transition-all", {
                    "!border-blue-500": state.editor.selectedElement.id === id,
                    "!border-solid": state.editor.selectedElement.id === id,
                    "!border-dashed border border-slate-300": !state.editor.liveMode,
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
                                        <div>GIF yuklenemedi</div>
                                        <div className="text-sm">Gecerli bir GIF URL'si ekleyin</div>
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
                                                downloadLink.download = alt || 'gif';
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
                                    GIF
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-[200px]">
                            <div className="text-center text-gray-500">
                                <ImageIcon className="mx-auto h-12 w-12 mb-2" />
                                <div>GIF kaynagi yok</div>
                                <div className="text-sm">Ayarlardan bir GIF URL'si ekleyin</div>
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

export default GifComponent;