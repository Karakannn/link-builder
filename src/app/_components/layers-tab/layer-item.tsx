import { EditorElement } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import { memo, useCallback } from "react";
import LayerItemContainer from "./layer-item-container";
import { ELEMENT_TYPE_INFO } from "@/constants";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const LayerItem = memo(
    ({
        element,
        depth,
        isSelected,
        isExpanded,
        onToggleExpand,
        onSelect,
    }: {
        element: EditorElement;
        depth: number;
        isSelected: boolean;
        isExpanded: boolean;
        onToggleExpand: (id: string) => void;
        onSelect: (element: EditorElement) => void;
    }) => {
        if (!element || !element.type) return;

        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ 
            id: element.id,
            data: {
                type: "layer",
                isEditorElement: true,
                element: element,
                elementId: element.id
            }
        });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        const hasChildren = Array.isArray(element.content) && element.content.length > 0;
        const typeInfo = ELEMENT_TYPE_INFO[element.type] || { name: element.type, color: "bg-gray-500" };

        // 🚀 REACT 19: Memoized handlers
        const handleClick = useCallback(
            (e: React.MouseEvent) => {
                e.stopPropagation();
                onSelect(element);
            },
            [onSelect, element]
        );

        const handleToggle = useCallback(
            (e: React.MouseEvent) => {
                e.stopPropagation();
                onToggleExpand(element.id);
            },
            [onToggleExpand, element.id]
        );

        return (
            <div className="relative" ref={setNodeRef} style={style}>
                <div
                    className={clsx(
                        "flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-md transition-colors my-0.5 group",
                        {
                            "bg-blue-100 dark:bg-blue-900/50": isSelected,
                            "opacity-50": isDragging,
                        }
                    )}
                    style={{ paddingLeft: `${(depth + 1) * 10}px` }}
                    onClick={handleClick}
                >
                    <div className={clsx("absolute left-1 h-4 w-1 rounded-full opacity-70", typeInfo.color)} style={{ left: `${depth * 10 + 3}px` }} />
                    
                    {/* Drag handle - show for all elements */}
                    <button
                        {...attributes}
                        {...listeners}
                        className="mr-1 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 opacity-80 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <GripVertical size={12} />
                    </button>
                    
                    {hasChildren && (
                        <button className="mr-1 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500" onClick={handleToggle}>
                            {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                        </button>
                    )}
                    {!hasChildren && <div className="w-4 h-4" />}
                    <span
                        className={clsx("truncate text-xs flex-1", {
                            "font-medium": isSelected,
                        })}
                    >
                        {element.name}
                    </span>

                    <span className={clsx("text-xs text-white rounded px-1 py-0.5 ml-1 opacity-80 whitespace-nowrap", typeInfo.color)}>{typeInfo.name}</span>
                </div>

                {hasChildren && isExpanded && (
                    <div className="relative">
                        <div
                            className="absolute w-px bg-gray-300 dark:bg-gray-700"
                            style={{
                                left: `${depth * 10 + 15}px`,
                                top: "0px",
                                height: "100%",
                            }}
                        />
                        <div>
                            {Array.isArray(element.content) &&
                                element.content.map((child: EditorElement) => <LayerItemContainer key={child.id} element={child} depth={depth + 1} />)}
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

export default LayerItem;
