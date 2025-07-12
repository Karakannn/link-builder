import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from "@/components/ui/context-menu";
import { Trash2, Eye, EyeOff, Settings, CopyIcon } from "lucide-react";
import { EditorElement } from "@/providers/editor/editor-provider";
import { v4 } from "uuid";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useElements } from "./editor-elements-provider";

interface ElementContextMenuProps {
    element: EditorElement;
    children: React.ReactNode;
}

const ElementContextMenu = ({ element, children }: ElementContextMenuProps) => {

    const { selectElement, insertElement, addElement, deleteElement, updateElement } = useElementActions();
    const elements = useElements();

    const findParentContainer = (targetElementId: string, elements: EditorElement[]): { containerId: string; index: number } | null => {
        const searchInElements = (elements: EditorElement[], parentId: string = "__body"): { containerId: string; index: number } | null => {
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];

                if (element.id === targetElementId) {
                    return { containerId: parentId, index: i };
                }

                if (Array.isArray(element.content)) {
                    const result = searchInElements(element.content, element.id);
                    if (result) {
                        return result;
                    }
                }
            }
            return null;
        };

        return searchInElements(elements);
    };

    const duplicateElementWithNewIds = (element: EditorElement): EditorElement => {
        const newId = v4();

        const getNewName = (currentName: string): string => {
            if (currentName.includes("Copy")) {
                const baseName = currentName.replace(/\s+Copy(\s+\d+)?$/, "");
                const existingElements = getAllElementNames(elements);
                let counter = 1;
                while (existingElements.includes(`${baseName} Copy ${counter}`)) {
                    counter++;
                }
                return `${baseName} Copy ${counter}`;
            }
            return `${currentName} Copy`;
        };

        const getAllElementNames = (elements: EditorElement[]): string[] => {
            const names: string[] = [];
            const collectNames = (elements: EditorElement[]) => {
                elements.forEach((element) => {
                    names.push(element.name);
                    if (Array.isArray(element.content)) {
                        collectNames(element.content);
                    }
                });
            };
            collectNames(elements);
            return names;
        };

        if (Array.isArray(element.content)) {
            return {
                ...element,
                id: newId,
                name: getNewName(element.name),
                content: element.content.map((childElement) => duplicateElementWithNewIds(childElement)),
            };
        }

        return {
            ...element,
            id: newId,
            name: getNewName(element.name),
        };
    };

    const handleDuplicate = () => {
        const duplicatedElement = duplicateElementWithNewIds(element);
        const parentInfo = findParentContainer(element.id, elements);

        if (parentInfo) {
            insertElement(parentInfo.containerId, parentInfo.index + 1, duplicatedElement);
        } else {
            addElement("__body", duplicatedElement);
        }
    };

    const handleDelete = () => {
        deleteElement(element);
    };


    const handleOpenSettings = () => {
        selectElement(element);
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

            <ContextMenuContent className="w-48">
                <ContextMenuItem onClick={handleDuplicate} className="flex items-center gap-2">
                    <CopyIcon className="h-4 w-4" />
                    Duplicate
                </ContextMenuItem>


                <ContextMenuSeparator />

                <ContextMenuItem onClick={handleOpenSettings} className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                </ContextMenuItem>

                <ContextMenuSeparator />

                <ContextMenuItem onClick={handleDelete} className="flex items-center gap-2 text-red-600">
                    <Trash2 className="h-4 w-4" />
                    Delete
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
};

export default ElementContextMenu;
