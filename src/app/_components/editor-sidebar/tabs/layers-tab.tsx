"use client";
import { useEditor } from "@/providers/editor/editor-provider";
import { EditorElement } from "@/providers/editor/editor-provider";
import React, { useEffect } from "react";
import clsx from "clsx";
import { ChevronDown, ChevronRight, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useElements } from "@/providers/editor/editor-elements-provider";
import { useSelectedElementId } from "@/providers/editor/editor-elements-provider";

// Map element types to friendly names and colors
const elementTypeInfo: Record<string, { name: string; color: string }> = {
    __body: { name: "Page", color: "bg-gray-600" },
    container: { name: "Container", color: "bg-blue-600" },
    "2Col": { name: "2 Columns", color: "bg-purple-600" },
    "3Col": { name: "3 Columns", color: "bg-purple-600" },
    text: { name: "Text", color: "bg-green-600" },
    link: { name: "Link", color: "bg-amber-600" },
    video: { name: "Video", color: "bg-red-600" },
    image: { name: "Image", color: "bg-orange-600" },
    gif: { name: "GIF", color: "bg-pink-600" },
    sponsorNeonCard: { name: "Sponsor Card", color: "bg-indigo-600" },
    gridLayout: { name: "Grid", color: "bg-teal-600" },
    column: { name: "Column", color: "bg-cyan-600" },
};

// This is a complete implementation of the layers tab that shows elements in a hierarchical tree view
// with expand/collapse functionality, visual indicators, and synchronization with the editor's selected element.
const LayersTab = () => {
    const { selectElement } = useElementActions();
    const [expandedLayers, setExpandedLayers] = React.useState<Record<string, boolean>>({
        __body: true, // Body is expanded by default
    });
    const elements = useElements();
    const selectedElementId = useSelectedElementId();
    // Auto-expand parents when an element is selected
    useEffect(() => {
        if (selectedElementId) {
            // Find path to selected element
            const findPathToElement = (elements: EditorElement[], targetId: string, path: string[] = []): string[] | null => {
                for (const element of elements) {
                    if (element.id === targetId) {
                        return [...path, element.id];
                    }

                    if (Array.isArray(element.content)) {
                        const result = findPathToElement(element.content, targetId, [...path, element.id]);
                        if (result) return result;
                    }
                }
                return null;
            };

            const path = findPathToElement(elements, selectedElementId);

            if (path) {
                // Expand all parents
                setExpandedLayers((prev) => {
                    const newState = { ...prev };
                    path.forEach((id) => {
                        newState[id] = true;
                    });
                    return newState;
                });
            }
        }
    }, [selectedElementId]);

    const toggleLayer = (id: string) => {
        setExpandedLayers((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleElementClick = (element: EditorElement) => {
        selectElement(element);
    };

    const getTypeInfo = (type: string | null) => {
        if (!type) return { name: "Unknown", color: "bg-gray-500" };
        return elementTypeInfo[type] || { name: type, color: "bg-gray-500" };
    };

    const renderElement = (element: EditorElement, depth: number = 0) => {
        const hasChildren = Array.isArray(element.content) && element.content.length > 0;
        const isExpanded = expandedLayers[element.id] || false;
        const isSelected = selectedElementId === element.id;
        const typeInfo = getTypeInfo(element.type);

        return (
            <div key={element.id} className="relative">
                <div
                    className={clsx(
                        "flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-md transition-colors my-0.5 group",
                        {
                            "bg-blue-100 dark:bg-blue-900/50": isSelected,
                        }
                    )}
                    style={{ paddingLeft: `${(depth + 1) * 10}px` }}
                    onClick={() => handleElementClick(element)}
                >
                    {/* Element type indicator bar */}
                    <div className={clsx("absolute left-1 h-4 w-1 rounded-full opacity-70", typeInfo.color)} style={{ left: `${depth * 10 + 3}px` }} />

                    {/* Expand/collapse button */}
                    {hasChildren && (
                        <button
                            className="mr-1 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleLayer(element.id);
                            }}
                        >
                            {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                        </button>
                    )}
                    {!hasChildren && <div className="w-4 h-4" />}

                    {/* Element type icon and name */}
                    <span
                        className={clsx("truncate text-xs flex-1", {
                            "font-medium": isSelected,
                        })}
                    >
                        {element.name}
                    </span>

                    {/* Element type badge */}
                    <span className={clsx("text-xs text-white rounded px-1 py-0.5 ml-1 opacity-80 whitespace-nowrap", typeInfo.color)}>{typeInfo.name}</span>
                </div>

                {/* Child elements */}
                {hasChildren && isExpanded && (
                    <div className="relative">
                        {/* Vertical guide line */}
                        <div
                            className="absolute w-px bg-gray-300 dark:bg-gray-700"
                            style={{
                                left: `${depth * 10 + 15}px`,
                                top: "0px",
                                height: "100%",
                            }}
                        />
                        <div>{Array.isArray(element.content) && element.content.map((child: EditorElement) => renderElement(child, depth + 1))}</div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-3 flex-1 flex flex-col pb-8 overflow-y-auto">
            <div className="mb-3 flex items-center gap-2">
                <Layers size={16} />
                <h2 className="text-sm font-medium">Layers</h2>
                <Badge variant="outline" className="ml-auto text-xs">
                    {countElements(elements)}
                </Badge>
            </div>

            <div className="flex-1 overflow-auto pr-2">{elements.map((element) => renderElement(element))}</div>
        </div>
    );
};

// Helper to count total elements
function countElements(elements: EditorElement[]): number {
    let count = elements.length;

    for (const element of elements) {
        if (Array.isArray(element.content)) {
            count += countElements(element.content);
        }
    }

    return count;
}

export default LayersTab;
