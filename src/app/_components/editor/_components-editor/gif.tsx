"use client";
import { EditorElement } from "@/providers/editor/editor-provider";
import { getElementContent, getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import { Image as ImageIcon, Download, AlertCircle } from "lucide-react";
import React, { useState, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import { EditorElementWrapper } from "@/components/global/editor-element/editor-element-wrapper";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useElementBorderHighlight } from "@/hooks/editor/use-element-border-highlight";
import { useDevice, useLiveMode, usePreviewMode } from "@/providers/editor/editor-ui-context";
import { useIsElementSelected } from "@/providers/editor/editor-elements-provider";
import { useElementSelection } from "@/hooks/editor/use-element-selection";

type Props = {
    element: EditorElement;
};

const GifComponent = ({ element }: Props) => {
    const { id, name, type, styles, content } = element;
    const imgRef = useRef<HTMLImageElement>(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const { handleSelectElement } = useElementSelection(element);
    const { getBorderClasses, handleMouseEnter, handleMouseLeave, isSelected } = useElementBorderHighlight(element);
    const isElementSelected = useIsElementSelected(id);

    const previewMode = usePreviewMode();
    const liveMode = useLiveMode();
    const device = useDevice();


    const computedStyles = getElementStyles(element, device);
    const computedContent = getElementContent(element, device);

    const sortable = useSortable({
        id: id,
        data: {
            type: "gif",
            elementId: id,
            name: "GIF",
            isSidebarElement: false,
            isEditorElement: true,
        },
        disabled: liveMode,
    });

    const gifProps = !Array.isArray(computedContent) ? computedContent : {};
    const src = gifProps.src || "";
    const alt = gifProps.alt || "GIF";
    const href = gifProps.href || "";

    const handleImageLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    const handleGifClick = (e: React.MouseEvent) => {
        // If in live mode and href is provided, open link
        if (liveMode && href && !e.defaultPrevented) {
            e.preventDefault();
            window.open(href, "_blank", "noopener,noreferrer");
        }
    };

    const objectFit = styles?.objectFit || "cover";
    const borderRadius = styles?.borderRadius || 0;
    const opacity = styles?.opacity || 1;

    const gifContent = (
        <div className="relative inline-block" onMouseEnter={() => setShowOverlay(true)} onMouseLeave={() => setShowOverlay(false)}>
            {src ? (
                <div className="relative">
                    <img
                        ref={imgRef}
                        src={src}
                        alt={alt}
                        className={clsx("max-w-full h-auto transition-all duration-300", {
                            "pointer-events-none": !liveMode && !previewMode,
                            "cursor-pointer": liveMode && href,
                        })}
                        style={{
                            width: computedStyles.width || "auto",
                            height: computedStyles.height || "auto",
                            maxWidth: "100%",
                            objectFit: objectFit as any,
                            borderRadius: `${borderRadius}px`,
                            opacity: opacity,
                        }}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        onClick={handleGifClick}
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

                    {showOverlay && !liveMode && src && !hasError && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 rounded">
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const downloadLink = document.createElement("a");
                                        downloadLink.href = src;
                                        downloadLink.download = alt || "gif";
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
    );

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
                {gifContent}

                {isElementSelected && !liveMode && <DeleteElementButton element={element} />}
            </div>
        </EditorElementWrapper>
    );
};

export default GifComponent;
