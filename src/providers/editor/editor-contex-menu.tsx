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
  const { state, dispatch } = useEditor();

  // Element'in parent container'ını ve index'ini bul
  const findParentContainer = (targetElementId: string, elements: EditorElement[]): { containerId: string; index: number } | null => {
    // Recursive olarak tüm elementlerde arama yap
    const searchInElements = (elements: EditorElement[], parentId: string = "__body"): { containerId: string; index: number } | null => {
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        
        // Eğer bu element target ise, parent'ını döndür
        if (element.id === targetElementId) {
          return { containerId: parentId, index: i };
        }
        
        // Eğer bu element'in content'i array ise (container ise), içinde ara
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

  const handleDuplicate = () => {
    const duplicatedElement = {
      ...element,
      id: v4(),
      name: `${element.name} Copy`,
    };

    // Element'in parent container'ını ve index'ini bul
    const parentInfo = findParentContainer(element.id, state.editor.elements);
    
    console.log("🔧 Duplicate operation:", {
      elementId: element.id,
      elementName: element.name,
      parentInfo,
      allElements: state.editor.elements
    });
    
    if (parentInfo) {
      // Aynı container'da hemen altına ekle
      console.log("🔧 Inserting at:", {
        containerId: parentInfo.containerId,
        insertIndex: parentInfo.index + 1
      });
      
      dispatch({
        type: "INSERT_ELEMENT",
        payload: {
          containerId: parentInfo.containerId,
          elementDetails: duplicatedElement,
          insertIndex: parentInfo.index + 1, // Hemen altına
        },
      });
    } else {
      // Fallback: body'ye ekle
      console.log("🔧 Fallback: adding to body");
    dispatch({
      type: "ADD_ELEMENT",
      payload: {
          containerId: "__body",
        elementDetails: duplicatedElement,
      },
    });
    }
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
