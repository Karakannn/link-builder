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
        distance: 5, // Basit threshold
      },
    })
  );

  // Basit collision detection - grid için closestCorners kullan
  const collisionDetection = (args: any) => {
    const { active } = args;
    const draggedType = active?.data?.current?.type;
    
    // Column drag için closestCorners kullan
    if (draggedType === "column") {
      return closestCorners(args);
    }
    
    // Diğerleri için rectIntersection
    return rectIntersection(args);
  };

  const childItems = state.editor.elements.map(child => child.id);

  // Grid layout ve column'larını bul
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

  // Ana sorting logic - onDragOver ile live reordering
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || !active) return;

    const draggedType = active.data?.current?.type;
    
    // Sadece column drag'ında çalış
    if (draggedType === "column") {
      const overType = over.data?.current?.type;
      
      // Column üzerinde hover ediyorsa
      if (overType === "column") {
        const activeId = active.id as string;
        const overId = over.id as string;
        
        if (activeId === overId) return;
        
        // Grid layout'u bul
        const gridInfo = findGridLayoutAndColumns(state.editor.elements);
        if (!gridInfo) return;
        
        const { gridLayout, columns } = gridInfo;
        
        // Column indekslerini bul
        const oldIndex = columns.findIndex(col => col.id === activeId);
        const newIndex = columns.findIndex(col => col.id === overId);
        
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          console.log(`🔄 Reordering columns: ${oldIndex} -> ${newIndex}`);
          
          // arrayMove ile yeni sıralama oluştur
          const reorderedColumns = arrayMove(columns, oldIndex, newIndex);
          
          // Grid layout'u güncelle
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

    // Extract drag information
    const draggedType = active.data?.current?.type;
    const isFromSidebar = active.data?.current?.isSidebarElement;
    const isFromEditor = active.data?.current?.isEditorElement;
    const elementId = active.data?.current?.elementId;

    // Column drag zaten onDragOver'da handle edildi, skip et
    if (draggedType === "column" && isFromEditor) {
      console.log("✅ Column reordering completed in onDragOver");
      return;
    }

    // Handle INSERT operations (dropping on element top/bottom zones)
    if (over.data?.current?.type === "insert") {
      const { containerId, insertIndex, position, targetElementId } = over.data.current;

      // Handle sidebar elements (creating new elements)
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
      }
      // Handle existing editor elements (reordering)
      else if (isFromEditor && elementId) {
        dispatch({
          type: "REORDER_ELEMENT",
          payload: {
            elementId,
            containerId,
            insertIndex,
          },
        });
      }
    }
    // Handle CONTAINER drops (add to end of container)
    else if (over.data?.current?.type === "container" || over.data?.current?.type === "__body") {
      handleContainerDrop(active, over)
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
      onDragOver={handleDragOver} // ÇOK ÖNEMLİ - Live reordering için
      onDragEnd={handleDragEnd} 
      sensors={sensors}
    >
      <SortableContext items={childItems} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};