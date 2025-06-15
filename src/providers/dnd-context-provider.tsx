"use client";

import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { getContainerIds, useEditorUtilities } from "@/hooks/use-editor-utilities";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
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

  const childItems = state.editor.elements.map(child => child.id);

  const handleDragEnd = (event: DragEndEvent) => {

    const { active, over } = event;

    if (!over || !active) return

    // Extract drag information
    const draggedType = active.data?.current?.type;
    const isFromSidebar = active.data?.current?.isSidebarElement;
    const isFromEditor = active.data?.current?.isEditorElement;
    const elementId = active.data?.current?.elementId;

    console.log("\n📋 Drag Analysis:");
    console.log("  - Dragged Type:", draggedType);
    console.log("  - From Sidebar:", isFromSidebar);
    console.log("  - From Editor:", isFromEditor);
    console.log("  - Element ID:", elementId);

    // Handle INSERT operations (dropping on element top/bottom zones)
    if (over.data?.current?.type === "insert") {
      console.log("\n🔄 INSERT OPERATION DETECTED");

      const { containerId, insertIndex, position, targetElementId } = over.data.current;

      console.log("📍 Insert Details:");
      console.log("  - Container ID:", containerId);
      console.log("  - Insert Index:", insertIndex);
      console.log("  - Position:", position);
      console.log("  - Target Element ID:", targetElementId);

      // Handle sidebar elements (creating new elements)
      if (isFromSidebar) {
        console.log("\n🆕 Creating new element from sidebar");

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

          console.log("✅ INSERT_ELEMENT dispatched successfully");
        } else {
          console.error("❌ Failed to create new element");
        }
      }
      // Handle existing editor elements (reordering)
      else if (isFromEditor && elementId) {
        console.log("\n🔄 Reordering existing element");
        console.log("  - Moving element:", elementId);
        console.log("  - To container:", containerId);
        console.log("  - At index:", insertIndex);

        console.log("🚀 Dispatching REORDER_ELEMENT action:");
        dispatch({
          type: "REORDER_ELEMENT",
          payload: {
            elementId,
            containerId,
            insertIndex,
          },
        });

        console.log("✅ REORDER_ELEMENT dispatched successfully");
      } else {
        console.warn("⚠️ INSERT operation but no valid source detected");
      }
    }
    // Handle CONTAINER drops (add to end of container)
    else if (over.data?.current?.type === "container" || over.data?.current?.type === "__body") {
      handleContainerDrop(active, over)
    }
    // Handle unknown drop targets
    else {
      console.warn("⚠️ Unknown drop target type:", over.data?.current?.type);
    }
    console.log("🏁 DRAG END EVENT COMPLETED");
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
    <DndContext onDragCancel={handleDragCancel} onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
      <SortableContext items={childItems} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};
