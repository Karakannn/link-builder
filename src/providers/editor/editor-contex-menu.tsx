// components/editor/element-context-menu.tsx
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from "@/components/ui/context-menu";
import { Copy, Trash2, Eye, EyeOff, Settings, CopyIcon } from "lucide-react";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { v4 } from "uuid";

interface ElementContextMenuProps {
  element: EditorElement;
  children: React.ReactNode;
}

const ElementContextMenu = ({ element, children }: ElementContextMenuProps) => {
  const { dispatch } = useEditor();

  const handleDuplicate = () => {
    const duplicatedElement = {
      ...element,
      id: v4(),
      name: `${element.name} Copy`,
    };

    dispatch({
      type: "ADD_ELEMENT",
      payload: {
        containerId: "__body", // Parent container bulunabilir ama şimdilik body
        elementDetails: duplicatedElement,
      },
    });
  };

  const handleDelete = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const handleToggleVisibility = () => {
    dispatch({
      type: "UPDATE_ELEMENT",
      payload: {
        elementDetails: {
          ...element,
          styles: {
            ...element.styles,
            display: element.styles.display === "none" ? "block" : "none",
          },
        },
      },
    });
  };

  const handleOpenSettings = () => {
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: { elementDetails: element },
    });
  };

  const isHidden = element.styles.display === "none";

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={handleDuplicate} className="flex items-center gap-2">
          <CopyIcon className="h-4 w-4" />
          Duplicate
        </ContextMenuItem>

        <ContextMenuItem onClick={handleToggleVisibility} className="flex items-center gap-2">
          {isHidden ? (
            <>
              <Eye className="h-4 w-4" />
              Show
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4" />
              Hide
            </>
          )}
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
