"use client";

import { 
  closestCorners, 
  DndContext, 
  DragEndEvent, 
  DragOverEvent, 
  DragStartEvent, 
  PointerSensor, 
  pointerWithin, 
  rectIntersection, 
  useSensor, 
  useSensors 
} from "@dnd-kit/core";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { getContainerIds, useEditorUtilities } from "@/hooks/use-editor-utilities";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useDrops } from "@/hooks/use-drops";

type DndContextProviderProps = {
  children: React.ReactNode;
};

export const DndContextProvider = ({ children }: DndContextProviderProps) => {

  const { state, dispatch } = useEditor();
  const { createElement } = useEditorUtilities()
  const { handleContainerDrop } = useDrops()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const collisionDetection = (args: any) => {
    const { active, over } = args;
    const draggedType = active?.data?.current?.type;
    
    // Use pointerWithin for precise drop detection - only when mouse pointer is within drop zone
    const result = pointerWithin(args);
    
    return result;
  };


  const childItems = state.editor.elements.map(child => child.id);

  // Grid layout'u bul ve column'larını döndür
  const findGridLayoutAndColumns = (elements: EditorElement[]): { gridLayout: EditorElement; columns: EditorElement[] } | null => {
    for (const element of elements) {
      if (element.type === 'gridLayout' && Array.isArray(element.content)) {
        return {
          gridLayout: element,
          columns: element.content
        };
      }
      if (Array.isArray(element.content)) {
        const result = findGridLayoutAndColumns(element.content);
        if (result) return result;
      }
    }
    return null;
  };

  // Column reordering - onDragOver ile live
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || !active) return;

    const draggedType = active.data?.current?.type;
    
    // Column reordering
    if (draggedType === "column") {
      const overType = over.data?.current?.type;
      
      if (overType === "column") {
        const activeId = active.id as string;
        const overId = over.id as string;
        
        if (activeId === overId) return;
        
        const gridInfo = findGridLayoutAndColumns(state.editor.elements);
        if (!gridInfo) return;
        
        const { gridLayout, columns } = gridInfo;
        
        const oldIndex = columns.findIndex(col => col.id === activeId);
        const newIndex = columns.findIndex(col => col.id === overId);
        
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const reorderedColumns = arrayMove(columns, oldIndex, newIndex);
          
          dispatch({
            type: "UPDATE_ELEMENT",
            payload: {
              elementDetails: {
                ...gridLayout,
                content: reorderedColumns,
              },
            },
          });
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !active) return

    const draggedType = active.data?.current?.type;
    const isFromSidebar = active.data?.current?.isSidebarElement;
    const isFromEditor = active.data?.current?.isEditorElement;
    const elementId = active.data?.current?.elementId;

    // Sidebar element -> Column drop
    if (isFromSidebar && over.data?.current?.type === "column") {
      const columnId = over.id as string;
      const containerId = over.data?.current?.containerId || columnId;
      
      const newElement = createElement(draggedType);
      if (newElement) {
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: containerId,
            elementDetails: newElement,
          },
        });
      }
      return;
    }

    // Column reordering already handled in onDragOver
    if (draggedType === "column" && isFromEditor) {
      return;
    }

    // Normal container/body drops
    if (over.data?.current?.type === "container" || over.data?.current?.type === "__body") {
      handleContainerDrop(active, over)
      return;
    }

    // Closable container drops
    if (over.data?.current?.type === "closableContainer") {
      const containerId = over.data?.current?.containerId || over.id as string;
      
      if (isFromSidebar) {
        const newElement = createElement(draggedType);
        if (newElement) {
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: containerId,
              elementDetails: newElement,
            },
          });
        }
      } else if (isFromEditor && elementId) {
        dispatch({
          type: "MOVE_ELEMENT",
          payload: {
            elementId: elementId as string,
            targetContainerId: containerId,
          },
        });
      }
      return;
    }

    // INSERT operations (element positioning)
    if (over.data?.current?.type === "insert") {
      const { containerId, insertIndex } = over.data.current;

      if (isFromSidebar) {
        const newElement = createElement(draggedType);
        if (newElement) {
          dispatch({
            type: "INSERT_ELEMENT",
            payload: {
              containerId,
              insertIndex,
              elementDetails: newElement,
            },
          });
        }
      } else if (isFromEditor && elementId) {
        dispatch({
          type: "REORDER_ELEMENT",
          payload: {
            elementId,
            containerId,
            insertIndex,
          },
        });
      }
      return;
    }
  };

  function handleDragStart({ active }: DragStartEvent) {
    if (!active.data.current) return

    const isFromEditor = active.data.current.isEditorElement

    if (!state.editor.liveMode && isFromEditor) {
      dispatch({
        type: "CHANGE_CLICKED_ELEMENT",
        payload: {
          elementDetails: active.data.current.element,
        },
      });
    }
  }

  function handleDragCancel() {
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {},
    });
  }

  return (
    <DndContext 
      collisionDetection={collisionDetection} 
      onDragCancel={handleDragCancel} 
      onDragStart={handleDragStart} 
      onDragOver={handleDragOver} 
      onDragEnd={handleDragEnd} 
      sensors={sensors}
    >
      <SortableContext items={childItems} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};