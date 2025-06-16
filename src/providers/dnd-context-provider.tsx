"use client";

import { 
  closestCorners, 
  DndContext, 
  DragEndEvent, 
  DragOverEvent, 
  DragStartEvent, 
  PointerSensor, 
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

  // Collision detection - column için closestCorners
  const collisionDetection = (args: any) => {
    const { active } = args;
    const draggedType = active?.data?.current?.type;
    
    if (draggedType === "column") {
      return closestCorners(args);
    }
    
    return rectIntersection(args);
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

    console.log("\n📋 Drag End Analysis:");
    console.log("  - Dragged Type:", draggedType);
    console.log("  - From Sidebar:", isFromSidebar);
    console.log("  - From Editor:", isFromEditor);
    console.log("  - Over Type:", over.data?.current?.type);
    console.log("  - Over ID:", over.id);

    // 🎯 Sidebar element -> Column drop (YENİ LOGIC)
    if (isFromSidebar && over.data?.current?.type === "column") {
      console.log("\n🎯 SIDEBAR TO COLUMN DROP DETECTED");
      
      const columnId = over.id as string;
      const containerId = over.data?.current?.containerId || columnId;
      
      console.log("  - Target Column ID:", columnId);
      console.log("  - Container ID:", containerId);
      
      const newElement = createElement(draggedType);
      if (newElement) {
        console.log("  - Created element:", newElement.name);
        
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: containerId, // Column'un ID'si containerId olarak kullanılıyor
            elementDetails: newElement,
          },
        });
        
        console.log("✅ Element added to column successfully");
      } else {
        console.error("❌ Failed to create element");
      }
      return;
    }

    // Column reordering zaten onDragOver'da handle edildi
    if (draggedType === "column" && isFromEditor) {
      console.log("✅ Column reordering completed in onDragOver");
      return;
    }

    // Normal container/body drops
    if (over.data?.current?.type === "container" || over.data?.current?.type === "__body") {
      console.log("\n🏠 CONTAINER/BODY DROP");
      handleContainerDrop(active, over)
      return;
    }

    // INSERT operations (element positioning)
    if (over.data?.current?.type === "insert") {
      console.log("\n🔄 INSERT OPERATION");
      
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

    console.log("⚠️ Unhandled drop scenario");
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