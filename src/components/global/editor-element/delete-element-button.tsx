import { Button } from "@/components/ui/button";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { useElementDeletion } from "@/hooks/editor/use-element-deletion";
import { useElementBorderHighlight } from "@/hooks/editor/use-element-selection";
import { Trash } from "lucide-react";
import React from "react";

type Props = {
    element: EditorElement;
};

const DeleteElementButton = ({ element }: Props) => {
    const { state } = useEditor();
    const { shouldShowDeleteButton } = useElementBorderHighlight(element);
    const { handleDelete, canDelete } = useElementDeletion(element, element.type !== "__body");

    // Eğer delete button gösterilmeyecekse null döndür
    if (!shouldShowDeleteButton || !canDelete) {
        return null;
    }

    return (
        <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 z-[999] h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg"
            onClick={handleDelete}
        >
            <Trash className="h-3 w-3" />
        </Button>
    );
};

export default DeleteElementButton;