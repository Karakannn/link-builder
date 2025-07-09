import { useElements, useSelectedElementId } from "@/providers/editor/editor-elements-provider";
import { EditorElement } from "@/providers/editor/editor-provider";
import { useIsEditMode } from "@/providers/editor/editor-ui-context";
import { Layers } from "lucide-react";
import { memo, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableLayerItem from "./sortable-layer-item";

const LayersTab = memo(() => {
    const elements = useElements();
    const selectedElementId = useSelectedElementId();
    const isEditMode = useIsEditMode();

    const totalElementCount = useMemo(() => {
        const countElements = (elements: EditorElement[]): number => {
            return elements.reduce((count, element) => {
                const childCount = Array.isArray(element.content) ? countElements(element.content) : 0;
                return count + 1 + childCount;
            }, 0);
        };
        return countElements(elements);
    }, [elements]);

    const rootElements = useMemo(() => {
        return elements;
    }, [elements]);

    if (!isEditMode) return null;

    return (
        <div className="p-3 flex-1 flex flex-col pb-8 overflow-y-auto">
            <div className="mb-3 flex items-center gap-2">
                <Layers size={16} />
                <h2 className="text-sm font-medium">Layers</h2>
                <Badge variant="outline" className="ml-auto text-xs">
                    {totalElementCount}
                </Badge>
            </div>

            <div className="flex-1 overflow-auto pr-2">
                <SortableContext items={rootElements.map(el => el.id)} strategy={verticalListSortingStrategy}>
                    {rootElements.map((element) => (
                        <SortableLayerItem key={element.id} element={element} />
                    ))}
                </SortableContext>

                {rootElements.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                        <Layers size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No elements yet</p>
                        <p className="text-xs">Drag components from the right panel</p>
                    </div>
                )}
            </div>
        </div>
    );
});

export default LayersTab;
