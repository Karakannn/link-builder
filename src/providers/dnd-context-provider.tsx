"use client";

import { DndContext, DragEndEvent, PointerSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { useEditorUtilities } from "@/hooks/use-editor-utilities";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

type DndContextProviderProps = {
  children: React.ReactNode;
};

export const DndContextProvider = ({ children }: DndContextProviderProps) => {

  const { state, dispatch } = useEditor();
  const { createElement } = useEditorUtilities()

  // PointerSensor with activation constraint to prevent accidental drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Extract all container IDs and their items for SortableContext
  const getContainerIds = (elements: EditorElement[]): UniqueIdentifier[] => {
    const containerIds: UniqueIdentifier[] = [];

    const findContainers = (items: EditorElement[]) => {
      items.forEach(item => {
        if (item.type === 'container' || item.type === '2Col') {
          containerIds.push(item.id);
        }
        if (Array.isArray(item.content)) {
          findContainers(item.content);
        }
      });
    };

    findContainers(elements);
    return containerIds;
  };

  // Get items for a specific container
  const getContainerItems = (containerId: string): string[] => {
    const findContainer = (elements: EditorElement[]): EditorElement | null => {
      for (const element of elements) {
        if (element.id === containerId) return element;
        if (Array.isArray(element.content)) {
          const found = findContainer(element.content);
          if (found) return found;
        }
      }
      return null;
    };

    const container = findContainer(state.editor.elements);
    if (container && Array.isArray(container.content)) {
      return container.content.map(item => item.id);
    }
    return [];
  };

  // All containers in the editor
  const containers = getContainerIds(state.editor.elements);

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
      console.log("\n📦 CONTAINER DROP OPERATION DETECTED");

      const containerId = over.data.current.containerId;

      // Handle sidebar elements (creating new elements)
      if (isFromSidebar) {
        console.log("\n🆕 Adding new element to container end");

        const newElement = createElement(draggedType);
        if (newElement) {
          console.log("🚀 Dispatching ADD_ELEMENT action:");
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId,
              elementDetails: newElement,
            },
          });

          console.log("✅ ADD_ELEMENT dispatched successfully");
        } else {
          console.error("❌ Failed to create new element");
        }
      }
      // Handle existing editor elements (moving to different container)
      else if (isFromEditor && elementId) {
        console.log("\n🔄 Moving existing element to different container");

        // Check if trying to move element to itself
        if (elementId === containerId) {
          console.warn("⚠️ Cannot move element to itself, aborting");
          return;
        }

        console.log("🚀 Dispatching MOVE_ELEMENT action:");
        console.log("  - Element ID:", elementId);
        console.log("  - Target Container ID:", containerId);

        dispatch({
          type: "MOVE_ELEMENT",
          payload: {
            elementId,
            targetContainerId: containerId,
          },
        });

        console.log("✅ MOVE_ELEMENT dispatched successfully");
      } else {
        console.warn("⚠️ CONTAINER operation but no valid source detected");
      }
    }
    // Handle unknown drop targets
    else {
      console.warn("⚠️ Unknown drop target type:", over.data?.current?.type);
      console.log("📦 Over data:", over.data?.current);
    }

    console.log("🏁 DRAG END EVENT COMPLETED");
  };

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <SortableContext items={containers} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};
