import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useSelectedElementId } from "@/providers/editor/editor-elements-provider";
import { EditorElement } from "@/providers/editor/editor-provider";
import { memo, useState, useEffect, useCallback } from "react";
import LayerItem from "./layer-item";

const LayerItemContainer = memo(({ element, depth }: { element: EditorElement; depth: number }) => {
    // 🚀 REACT 19: Use optimized context hooks
    const selectedElementId = useSelectedElementId();
    const { selectElement } = useElementActions();

    // Local state for expansion
    const [isExpanded, setIsExpanded] = useState(depth === 0); // Root elements expanded by default

    // 🚀 REACT 19: Auto-expand when element is selected
    useEffect(() => {
        if (selectedElementId === element.id && !isExpanded) {
            setIsExpanded(true);
        }
    }, [selectedElementId, element.id, isExpanded]);

    // 🚀 REACT 19: Memoized handlers
    const handleToggleExpand = useCallback(
        (id: string) => {
            if (id === element.id) {
                setIsExpanded((prev) => !prev);
            }
        },
        [element.id]
    );

    const handleSelect = useCallback(
        (selectedElement: EditorElement) => {
            selectElement(selectedElement);
        },
        [selectElement]
    );

    return (
        <LayerItem
            element={element}
            depth={depth}
            isSelected={selectedElementId === element.id}
            isExpanded={isExpanded}
            onToggleExpand={handleToggleExpand}
            onSelect={handleSelect}
        />
    );
});

export default LayerItemContainer;
