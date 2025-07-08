"use client";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { getElementContent, getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import { Play, Pause, Image as ImageIcon, Download, AlertCircle } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useElementBorderHighlight } from "@/hooks/editor/use-element-border-highlight";

type Props = {
    element: EditorElement;
};

const GifComponent = ({ element }: Props) => {
    const { state } = useEditor();
    const { id, name, type, styles, content } = element;
    const imgRef = useRef<HTMLImageElement>(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const { selectElement } = useElementActions();
    const { getBorderClasses, handleMouseEnter, handleMouseLeave, isSelected } = useElementBorderHighlight(element);

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
                style={sortable.transform ? { transform: CSS.Transform.toString(sortable.transform) } : undefined}
                className={clsx(
                    "relative group",
                    getBorderClasses(),
                    sortable.isDragging && "opacity-50"
                )}
                onClick={() => selectElement(element)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                data-element-id={id}
            >
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
                                <div className="flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <AlertCircle className="h-6 w-6 text-gray-400" />
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