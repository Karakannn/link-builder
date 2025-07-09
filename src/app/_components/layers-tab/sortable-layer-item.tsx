import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditorElement } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { ELEMENT_TYPE_INFO } from "@/constants";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useSelectedElementId } from "@/providers/editor/editor-elements-provider";

const SortableLayerItem = memo(({ element }: { element: EditorElement }) => {
    const selectedElementId = useSelectedElementId();
    const { selectElement } = useElementActions();
    const [isExpanded, setIsExpanded] = useState(false);

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
    const typeInfo = ELEMENT_TYPE_INFO[element.type as keyof typeof ELEMENT_TYPE_INFO] || { name: element.type, color: "bg-gray-500" };

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            selectElement(element);
        },
        [selectElement, element]
    );

    const handleToggleExpand = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
        },
        [isExpanded]
    );

    return (
        <div className="relative" ref={setNodeRef} style={style}>
            <div
                className={clsx(
                    "flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded-md transition-colors my-0.5 group",
                    {
                        "bg-blue-100 dark:bg-blue-900/50": selectedElementId === element.id,
                        "opacity-50": isDragging,
                    }
                )}
                onClick={handleClick}
            >
                <div className={clsx("absolute left-1 h-4 w-1 rounded-full opacity-70", typeInfo.color)} style={{ left: "3px" }} />
                
                {/* Drag handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="mr-1 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 opacity-80 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                    onClick={(e) => e.stopPropagation()}
                >
                    <GripVertical size={12} />
                </button>
                
                {hasChildren && (
                    <button 
                        className="mr-1 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
                        onClick={handleToggleExpand}
                    >
                        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </button>
                )}
                {!hasChildren && <div className="w-4 h-4" />}
                
                <span
                    className={clsx("truncate text-xs flex-1", {
                        "font-medium": selectedElementId === element.id,
                    })}
                >
                    {element.name}
                </span>

                <span className={clsx("text-xs text-white rounded px-1 py-0.5 ml-1 opacity-80 whitespace-nowrap", typeInfo.color)}>
                    {typeInfo.name}
                </span>
            </div>

            {/* Show children when expanded */}
            {hasChildren && isExpanded && (
                <div className="ml-4">
                    {Array.isArray(element.content) && element.content.map((child: EditorElement) => (
                        <SortableLayerItem key={child.id} element={child} />
                    ))}
                </div>
            )}
        </div>
    );
});

export default SortableLayerItem; 