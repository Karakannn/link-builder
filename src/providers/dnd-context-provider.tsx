"use client";

import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { useEditorUtilities } from "@/hooks/use-editor-utilities";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useDrops } from "@/hooks/use-drops";
import { useDropIndicator } from "@/hooks/use-drop-indicator";
import { useDropHere } from "@/hooks/use-drop-here";
import { DropHere } from "@/components/global/drop-here";
import { DropIndicator } from "@/components/global/drop-indicator";

type DndContextProviderProps = {
  children: React.ReactNode;
};

export const DndContextProvider = ({ children }: DndContextProviderProps) => {
  const { state, dispatch } = useEditor();
  const { createElement } = useEditorUtilities();
  const { handleContainerDrop } = useDrops();

  const {
    indicatorState,
    updateIndicatorFromDragOver,
    updateIndicatorFromDragMove,
    handleDragEndInsert,
    clearIndicator
  } = useDropIndicator();

  const {
    dropHereState,
    updateDropHereFromDragOver,
    updateDropHereFromDragMove,
    clearDropHere
  } = useDropHere();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  );

  const findGridLayoutAndColumns = (elements: EditorElement[]): { gridLayout: EditorElement; columns: EditorElement[] } | null => {
    for (const element of elements) {
      if (element.type === 'gridLayout' && Array.isArray(element.content)) {
        return { gridLayout: element, columns: element.content };
      }
      if (Array.isArray(element.content)) {
        const result = findGridLayoutAndColumns(element.content);
        if (result) return result;
      }
    }
    return null;
  };

  const handleColumnReordering = (active: any, over: any) => {
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
          elementDetails: { ...gridLayout, content: reorderedColumns }
        }
      });
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    updateIndicatorFromDragMove(event, state.editor.elements);
    updateDropHereFromDragMove(event, state.editor.elements);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !active) return;

    const draggedType = active.data?.current?.type;

    // Column reordering
    if (draggedType === "column" && over.data?.current?.type === "column") {
      handleColumnReordering(active, over);
    }

    updateIndicatorFromDragOver(event, state.editor.elements);
    updateDropHereFromDragOver(event, state.editor.elements);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    clearIndicator();
    clearDropHere();

    if (!over || !active) return

    const draggedType = active.data?.current?.type;
    const isFromSidebar = active.data?.current?.isSidebarElement;
    const isFromEditor = active.data?.current?.isEditorElement;
    const elementId = active.data?.current?.elementId;
    const overType = over.data?.current?.type;
    const overId = over.id as string;


    // Önce mathematical positioning'i kontrol et
    const insertInfo = handleDragEndInsert(event, state.editor.elements);

    if (insertInfo) {
      const { containerId, insertIndex } = insertInfo;



      if (isFromSidebar) {
        const newElement = createElement(draggedType);
        if (newElement) {
          dispatch({
            type: "INSERT_ELEMENT",
            payload: { containerId, insertIndex, elementDetails: newElement }
          });
        }
      } else if (isFromEditor && elementId) {
        dispatch({
          type: "REORDER_ELEMENT",
          payload: { elementId, containerId, insertIndex }
        });
      }
      return;
    }

    // Drop handlers (fallback)
    const dropHandlers = {
      column: () => {
        if (isFromSidebar) {
          const containerId = over.data?.current?.containerId || overId;
          const newElement = createElement(draggedType);
          if (newElement) {
            dispatch({
              type: "ADD_ELEMENT",
              payload: { containerId, elementDetails: newElement }
            });
          }
        }
      },

      container: () => {
        handleContainerDrop(active, over);
      },

      __body: () => {
        handleContainerDrop(active, over);
      },

      closableContainer: () => {
        const containerId = over.data?.current?.containerId || overId;
        if (isFromSidebar) {
          const newElement = createElement(draggedType);
          if (newElement) {
            dispatch({
              type: "ADD_ELEMENT",
              payload: { containerId, elementDetails: newElement }
            });
          }
        } else if (isFromEditor && elementId) {
          dispatch({
            type: "MOVE_ELEMENT",
            payload: { elementId: elementId as string, targetContainerId: containerId }
          });
        }
      }
    };

    // Execute drop handler
    if (dropHandlers[overType as keyof typeof dropHandlers]) {
      dropHandlers[overType as keyof typeof dropHandlers]();
    } else {
    }
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    if (!active.data.current) return;

    if (!state.editor.liveMode && active.data.current.isEditorElement) {
      dispatch({
        type: "CHANGE_CLICKED_ELEMENT",
        payload: { elementDetails: active.data.current.element }
      });
    }
  };

  const handleDragCancel = () => {
    clearIndicator();
    clearDropHere();
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {}
    });
  };

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragCancel={handleDragCancel}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <SortableContext
        items={state.editor.elements.map(child => child.id)}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
      <DropIndicator state={indicatorState} />
      <DropHere state={dropHereState} />
    </DndContext>
  );
};