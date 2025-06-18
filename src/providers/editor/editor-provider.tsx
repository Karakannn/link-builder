"use client";

import { createContext, Dispatch, useContext, useReducer } from "react";
import { EditorBtns } from "@/lib/constants";
import { EditorAction } from "./editor-actions";

export type DeviceTypes = "Desktop" | "Mobile" | "Tablet";

export type EditorElement = {
  id: string;
  styles: React.CSSProperties;
  responsiveStyles?: {
    Tablet?: React.CSSProperties;
    Mobile?: React.CSSProperties;
  };
  name: string;
  type: EditorBtns;
  content:
  | EditorElement[]
  | {
    // Common content properties
    href?: string;
    innerText?: string;
    src?: string;

    // Shimmer button properties
    shimmerColor?: string;
    shimmerSize?: string;
    shimmerDuration?: string;
    borderRadius?: string;
    background?: string;

    // Neon gradient button properties
    firstColor?: string;
    secondColor?: string;
    borderSize?: number;

    // Card properties
    title?: string;
    subtitle?: string;
    logo?: string;

    // Button common properties
    buttonClass?: string;

    // Grid pattern properties
    width?: number;
    height?: number;
    numSquares?: number;
    maxOpacity?: number;
    duration?: number;
    repeatDelay?: number;
    squares?: [number, number];

    // Retro grid properties
    angle?: number;
    cellSize?: number;
    opacity?: number;
    lightLineColor?: string;
    darkLineColor?: string;

    // Dot pattern properties
    cx?: number;
    cy?: number;
    cr?: number;

    // Marquee properties
    direction?: "left" | "right";
    speed?: number;
    pauseOnHover?: boolean;
    items?: Array<{
      type: "text" | "image";
      content: string;
      alt?: string;
      width?: number;
      height?: number;
    }>;

    // Grid Layout properties
    columns?: number;
    gap?: string;
    minColumnWidth?: string;
    autoFit?: boolean;
    template?: string;
    templateType?: "equal" | "sidebar" | "hero" | "thirds" | "custom";
    columnSpans?: any[];

    // GIF properties
    alt?: string;
    autoplay?: boolean;
    loop?: boolean;
    controls?: boolean;
    loading?: "lazy" | "eager";

    responsiveContent?: {
      Tablet?: {
        // All the above properties can be responsive
        href?: string;
        innerText?: string;
        src?: string;
        shimmerColor?: string;
        shimmerSize?: string;
        shimmerDuration?: string;
        borderRadius?: string;
        background?: string;
        firstColor?: string;
        secondColor?: string;
        borderSize?: number;
        buttonClass?: string;
        width?: number;
        height?: number;
        numSquares?: number;
        maxOpacity?: number;
        duration?: number;
        repeatDelay?: number;
        squares?: [number, number];
        angle?: number;
        cellSize?: number;
        opacity?: number;
        lightLineColor?: string;
        darkLineColor?: string;
        cx?: number;
        cy?: number;
        cr?: number;
        direction?: "left" | "right";
        speed?: number;
        pauseOnHover?: boolean;
        items?: Array<{
          type: "text" | "image";
          content: string;
          alt?: string;
          width?: number;
          height?: number;
        }>;
        // Grid Layout responsive properties
        columns?: number;
        gap?: string;
        minColumnWidth?: string;
        autoFit?: boolean;
        template?: string;
        templateType?: "equal" | "sidebar" | "hero" | "thirds" | "custom";
        
        // GIF responsive properties
        alt?: string;
        autoplay?: boolean;
        loop?: boolean;
        controls?: boolean;
        loading?: "lazy" | "eager";
      };
      Mobile?: {
        // Same properties as Tablet
        href?: string;
        innerText?: string;
        src?: string;
        shimmerColor?: string;
        shimmerSize?: string;
        shimmerDuration?: string;
        borderRadius?: string;
        background?: string;
        firstColor?: string;
        secondColor?: string;
        borderSize?: number;
        buttonClass?: string;
        width?: number;
        height?: number;
        numSquares?: number;
        maxOpacity?: number;
        duration?: number;
        repeatDelay?: number;
        squares?: [number, number];
        angle?: number;
        cellSize?: number;
        opacity?: number;
        lightLineColor?: string;
        darkLineColor?: string;
        cx?: number;
        cy?: number;
        cr?: number;
        direction?: "left" | "right";
        speed?: number;
        pauseOnHover?: boolean;
        items?: Array<{
          type: "text" | "image";
          content: string;
          alt?: string;
          width?: number;
          height?: number;
        }>;
        // Grid Layout responsive properties
        columns?: number;
        gap?: string;
        minColumnWidth?: string;
        autoFit?: boolean;
        template?: string;
        templateType?: "equal" | "sidebar" | "hero" | "thirds" | "custom";
        // GIF responsive properties
        alt?: string;
        autoplay?: boolean;
        loop?: boolean;
        controls?: boolean;
        loading?: "lazy" | "eager";
      };
    };
  };
};

export type Editor = {
  liveMode: boolean;
  elements: EditorElement[];
  selectedElement: EditorElement;
  device: DeviceTypes;
  previewMode: boolean;
  funnelPageId: string;
};

export type HistoryState = {
  history: Editor[];
  currentIndex: number;
};

export type EditorState = {
  editor: Editor;
  history: HistoryState;
};

const initialEditorState: EditorState["editor"] = {
  elements: [
    {
      content: [],
      id: "__body",
      name: "Body",
      styles: {},
      type: "__body",
    },
  ],
  selectedElement: {
    content: [],
    id: "__body",
    name: "Body",
    styles: {},
    type: "__body",
  },
  liveMode: false,
  device: "Desktop",
  previewMode: false,
  funnelPageId: "",
};

const initialHistoryState: EditorState["history"] = {
  history: [initialEditorState],
  currentIndex: 0,
};

const initialState: EditorState = {
  editor: initialEditorState,
  history: initialHistoryState,
};

// Add element editor
const addAnElement = (editorArray: EditorElement[], action: EditorAction): EditorElement[] => {
  if (action.type !== "ADD_ELEMENT") throw Error("You sent the wrong action type on the ADD_ELEMENT editor State");

  return editorArray.map((item) => {
    if (item.id === action.payload.containerId && Array.isArray(item.content)) {
      return {
        ...item,
        content: [...item.content, action.payload.elementDetails],
      };
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: addAnElement(item.content, action),
      };
    }

    return item;
  });
};

// Find an element by ID and its parent container
const findElementAndParent = (
  elements: EditorElement[],
  elementId: string,
  parent: EditorElement | null = null
): { element: EditorElement | null; parent: EditorElement | null } => {
  for (const item of elements) {
    if (item.id === elementId) {
      return { element: item, parent };
    }
    if (Array.isArray(item.content) && item.content.length > 0) {
      const result = findElementAndParent(item.content, elementId, item);
      if (result.element) return result;
    }
  }
  return { element: null, parent: null };
};

// Move an element from one container to another
const moveElement = (elements: EditorElement[], action: EditorAction): EditorElement[] => {
  if (action.type !== "MOVE_ELEMENT") throw Error("You sent the wrong action type on the MOVE_ELEMENT editor State");

  const { elementId, targetContainerId } = action.payload;

  console.log("MOVE_ELEMENT - Element ID:", elementId);
  console.log("MOVE_ELEMENT - Target Container ID:", targetContainerId);

  // Step 1: Find the element and its parent
  const { element, parent } = findElementAndParent(elements, elementId);

  if (!element || !parent) {
    console.error("Could not find element or its parent:", elementId);
    return elements;
  }

  console.log("Found element to move:", element);
  console.log("Original parent:", parent.id);
  console.log("Target container:", targetContainerId);

  // Check if trying to move to its own container
  if (parent.id === targetContainerId) {
    console.log("Element is already in this container, no need to move");
    return elements;
  }

  // Step 2: Create a deep copy of the elements to avoid mutation
  const newElements = JSON.parse(JSON.stringify(elements));

  // Step 3: Find the element copy and parent copy
  const { element: elementCopy, parent: parentCopy } = findElementAndParent(newElements, elementId);

  if (!elementCopy || !parentCopy || !Array.isArray(parentCopy.content)) {
    console.error("Could not find element copy or parent copy or parent content is not an array");
    return elements;
  }

  console.log("Found element copy:", elementCopy);

  // Step 4: Find the target container in the copied elements
  const findTargetContainer = (elements: EditorElement[], id: string): EditorElement | null => {
    for (const element of elements) {
      if (element.id === id) {
        return element;
      }
      if (Array.isArray(element.content)) {
        const found = findTargetContainer(element.content, id);
        if (found) return found;
      }
    }
    return null;
  };

  const targetContainer = findTargetContainer(newElements, targetContainerId);

  if (!targetContainer) {
    console.error("Target container not found:", targetContainerId);
    return elements;
  }

  if (!Array.isArray(targetContainer.content)) {
    console.error("Target container doesn't have an array content");
    return elements;
  }

  console.log("Found target container:", targetContainer.id);

  // Step 5: Remove the element from its original parent
  parentCopy.content = parentCopy.content.filter((item) => item.id !== elementId);

  // Step 6: Add the element to the target container directly
  targetContainer.content.push(elementCopy);

  console.log("Element moved successfully from", parentCopy.id, "to", targetContainer.id);

  return newElements;
};

const updateAnElement = (editorArray: EditorElement[], action: EditorAction): EditorElement[] => {
  if (action.type !== "UPDATE_ELEMENT") throw Error("You sent the wrong action type on the UPDATE_ELEMENT editor State");

  console.log("🔍 updateAnElement called, looking for ID:", action.payload.elementDetails.id);
  console.log("🔍 Array has", editorArray.length, "elements");

  return editorArray.map((item) => {
    console.log("🔎 Checking element:", item.id, "vs target:", action.payload.elementDetails.id);
    
    if (item.id === action.payload.elementDetails.id) {
      console.log("✅ Found matching element! Updating...");
      console.log("🔄 Old content length:", Array.isArray(item.content) ? item.content.length : 'not array');
      console.log("🔄 New content length:", Array.isArray(action.payload.elementDetails.content) ? action.payload.elementDetails.content.length : 'not array');
      
      return {
        ...item,
        ...action.payload.elementDetails,
      };
    } else if (item.content && Array.isArray(item.content)) {
      console.log("🔄 Searching in nested content of:", item.id);
      return {
        ...item,
        content: updateAnElement(item.content, action),
      };
    }
    return item;
  });
};

const deleteAnElement = (editorArray: EditorElement[], action: EditorAction) => {
  if (action.type !== "DELETE_ELEMENT") throw Error("You sent the wrong action type on the DELETE_ELEMENT editor State");

  return editorArray.filter((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return false;
    } else if (item.content && Array.isArray(item.content)) {
      item.content = deleteAnElement(item.content, action);
    }
    return true;
  });
};

const handleClickedElement = (state: EditorState, action: EditorAction): EditorState => {
  if (action.type !== "CHANGE_CLICKED_ELEMENT") throw Error("You sent the wrong action type on the CHANGE_CLICKED_ELEMENT editor State");
  
  const newSelectedElement = action.payload.elementDetails || {
    id: "",
    name: "",
    styles: {},
    type: null,
    content: [],
  };
  
  return {
    ...state,
    editor: {
      ...state.editor,
      selectedElement: newSelectedElement,
    },
  };
};

// Change device editor
const handleChangeDevice = (state: EditorState, action: EditorAction) => {
  if (action.type !== "CHANGE_DEVICE") throw Error("You sent the wrong action type on the CHANGE_DEVICE editor State");

  return {
    ...state,
    editor: {
      ...state.editor,
      device: action.payload.device,
    },
  };
};

const handleTogglePreviewMode = (state: EditorState, action: EditorAction): EditorState => {
  if (action.type !== "TOGGLE_PREVIEW_MODE") throw Error("You sent the wrong action type on the TOGGLE_PREVIEW_MODE editor State");

  return {
    ...state,
    editor: {
      ...state.editor,
      previewMode: !state.editor.previewMode,
    },
  };
};

const handleToggleLiveMode = (state: EditorState, action: EditorAction): EditorState => {
  if (action.type !== "TOGGLE_LIVE_MODE") throw Error("You sent the wrong action type on the TOGGLE_LIVE_MODE editor State");

  return {
    ...state,
    editor: {
      ...state.editor,
      liveMode: action.payload ? action.payload.value : !state.editor.liveMode,
    },
  };
};

const handleRedoState = (state: EditorState, action: EditorAction): EditorState => {
  if (action.type !== "REDO") throw Error("You sent the wrong action type on the REDO editor State");

  if (state.history.currentIndex < state.history.history.length - 1) {
    const nextIndex = state.history.currentIndex + 1;
    const nextEditorState = {
      ...state.history.history[nextIndex],
    };

    return {
      ...state,
      editor: nextEditorState,
      history: {
        ...state.history,
        currentIndex: nextIndex,
      },
    };
  }
  return state;
};

const handleUndoState = (state: EditorState, action: EditorAction): EditorState => {
  if (action.type !== "UNDO") throw Error("You sent the wrong action type on the UNDO editor State");

  if (state.history.currentIndex > 0) {
    const previousIndex = state.history.currentIndex - 1;
    const previousEditorState = {
      ...state.history.history[previousIndex],
    };

    return {
      ...state,
      editor: previousEditorState,
      history: {
        ...state.history,
        currentIndex: previousIndex,
      },
    };
  }
  return state;
};

const handleSetPageIdState = (state: EditorState, action: EditorAction): EditorState => {
  if (action.type !== "SET_PAGE_ID") throw Error("You sent the wrong action type on the SET_FUNNEL_PAGE_ID editor State");

  const { pageId } = action.payload;

  const updatedEditorStateWithPageId = {
    ...state.editor,
    pageId,
  };

  const updateHistoryWithPageId = [
    ...state.history.history.slice(0, state.history.currentIndex + 1),
    {
      ...updatedEditorStateWithPageId,
    },
  ];

  return {
    ...state,
    editor: updatedEditorStateWithPageId,
    history: {
      ...state.history,
      currentIndex: updateHistoryWithPageId.length - 1,
    },
  };
};

const handleLoadData = (initialState: EditorState, initialEditorState: EditorState["editor"], action: EditorAction): EditorState => {
  if (action.type !== "LOAD_DATA") throw Error("You sent the wrong action type on the LOAD_DATA editor State");

  return {
    ...initialState,
    editor: {
      ...initialState.editor,
      elements: action.payload.elements || initialEditorState.elements,
      liveMode: !!action.payload.withLive,
    },
  };
};

const insertAnElement = (editorArray: EditorElement[], action: EditorAction): EditorElement[] => {
  if (action.type !== "INSERT_ELEMENT") throw Error("You sent the wrong action type on the INSERT_ELEMENT editor State");

  console.log("📥 INSERT_ELEMENT function called");
  console.log("   - Insert Index:", action.payload.insertIndex);
  console.log("   - Element:", action.payload.elementDetails.name);

  return editorArray.map((item) => {
    if (item.id === action.payload.containerId && Array.isArray(item.content)) {
      console.log("   - Found container, inserting element at index", action.payload.insertIndex);
      const newContent = [...item.content];
      newContent.splice(action.payload.insertIndex, 0, action.payload.elementDetails);

      return {
        ...item,
        content: newContent,
      };
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: insertAnElement(item.content, action),
      };
    }
    return item;
  });
};

const reorderElement = (elements: EditorElement[], action: EditorAction): EditorElement[] => {
  if (action.type !== "REORDER_ELEMENT") throw Error("You sent the wrong action type on the REORDER_ELEMENT editor State");

  const { elementId, containerId, insertIndex } = action.payload;

  console.log("🔄 REORDER_ELEMENT function called");
  console.log("   - Element ID:", elementId);
  console.log("   - Container ID:", containerId);
  console.log("   - Insert Index:", insertIndex);

  // Find the element and its parent
  const { element, parent } = findElementAndParent(elements, elementId);

  if (!element || !parent) {
    console.error("   ❌ Could not find element or its parent:", elementId);
    return elements;
  }

  console.log("   - Found element:", element.name);
  console.log("   - Current parent:", parent.id);

  // Create a deep copy of the elements
  const newElements = JSON.parse(JSON.stringify(elements));

  // Find the element copy and parent copy in new structure
  const { element: elementCopy, parent: parentCopy } = findElementAndParent(newElements, elementId);

  if (!elementCopy || !parentCopy || !Array.isArray(parentCopy.content)) {
    console.error("   ❌ Could not find element copy or parent copy");
    return elements;
  }

  // Find current index of element
  const currentIndex = parentCopy.content.findIndex((item) => item.id === elementId);
  console.log("   - Current index:", currentIndex);

  // Remove the element from its current position
  parentCopy.content = parentCopy.content.filter((item) => item.id !== elementId);
  console.log("   - Removed element from current position");

  // Find the target container
  const findTargetContainer = (elements: EditorElement[], id: string): EditorElement | null => {
    for (const element of elements) {
      if (element.id === id) {
        return element;
      }
      if (Array.isArray(element.content)) {
        const found = findTargetContainer(element.content, id);
        if (found) return found;
      }
    }
    return null;
  };

  const targetContainer = findTargetContainer(newElements, containerId);

  if (!targetContainer || !Array.isArray(targetContainer.content)) {
    console.error("   ❌ Target container not found or doesn't have array content");
    return elements;
  }

  console.log("   - Found target container:", targetContainer.id);
  console.log("   - Target container current length:", targetContainer.content.length);

  // If moving within same container, adjust index if needed
  let finalInsertIndex = insertIndex;
  if (containerId === parent.id && currentIndex < insertIndex) {
    finalInsertIndex = insertIndex - 1;
    console.log("   - Adjusted insert index for same container:", finalInsertIndex);
  }

  // Insert the element at the specified index
  targetContainer.content.splice(finalInsertIndex, 0, elementCopy);
  console.log("   ✅ Element inserted at index:", finalInsertIndex);
  console.log("   - Target container new length:", targetContainer.content.length);

  return newElements;
};

const editorReducer = (state: EditorState = initialState, action: EditorAction): EditorState => {
  switch (action.type) {
    case "ADD_ELEMENT":
      const updatedEditorState = {
        ...state.editor,
        elements: addAnElement(state.editor.elements, action),
      };

      const updatedHistory = [...state.history.history.slice(0, state.history.currentIndex + 1), { ...updatedEditorState }];

      const newEditorState = {
        ...state,
        editor: updatedEditorState,
        history: {
          ...state.history,
          history: updatedHistory,
          currentIndex: updatedHistory.length - 1,
        },
      };
      return newEditorState;

    case "UPDATE_ELEMENT":

      console.log("🔧 UPDATE_ELEMENT reducer called:", action.payload);

      const updateElements = updateAnElement(state.editor.elements, action);

      // Check if the updated element is the currently selected element
      const updatedElementIsSelected = state.editor.selectedElement.id === action.payload.elementDetails.id;

      console.log("🔍 Updated element ID:", action.payload.elementDetails.id);
      console.log("🔍 Selected element ID:", state.editor.selectedElement.id);
      console.log("🔍 Is updated element selected:", updatedElementIsSelected);

      const updatedEditorStateWithUpdate = {
        ...state.editor,
        elements: updateElements,
        // Only update selectedElement if the updated element is the selected one
        // Otherwise, keep the current selected element but update it with the new data
        selectedElement: updatedElementIsSelected
          ? action.payload.elementDetails
          : state.editor.selectedElement, // Keep the current selected element
      };

      const updatedHistoryWithUpdate = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        {
          ...updatedEditorStateWithUpdate,
        },
      ];

      const updateEditor = {
        ...state,
        editor: updatedEditorStateWithUpdate,
        history: {
          ...state.history,
          history: updatedHistoryWithUpdate,
          currentIndex: updatedHistoryWithUpdate.length - 1,
        },
      };

      console.log("✅ UPDATE_ELEMENT reducer completed");

      return updateEditor;

    case "MOVE_ELEMENT":
      const movedElements = moveElement(state.editor.elements, action);

      const updatedEditorStateAfterMove = {
        ...state.editor,
        elements: movedElements,
      };

      const updatedHistoryAfterMove = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        {
          ...updatedEditorStateAfterMove,
        },
      ];

      const movedState = {
        ...state,
        editor: updatedEditorStateAfterMove,
        history: {
          ...state.history,
          history: updatedHistoryAfterMove,
          currentIndex: updatedHistoryAfterMove.length - 1,
        },
      };

      return movedState;

    case "DELETE_ELEMENT":
      const updatedElementsAfterDelete = deleteAnElement(state.editor.elements, action);

      const updatedEditorStateAfterDelete = {
        ...state.editor,
        elements: updatedElementsAfterDelete,
      };
      const updatedHistoryAfterDelete = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        {
          ...updatedEditorStateAfterDelete,
        },
      ];

      const deletedState = {
        ...state,
        editor: updatedEditorStateAfterDelete,
        history: {
          ...state.history,
          history: updatedHistoryAfterDelete,
          currentIndex: updatedHistoryAfterDelete.length - 1,
        },
      };
      return deletedState;
    case "INSERT_ELEMENT":
      console.log("🚀 INSERT_ELEMENT case triggered");
      const insertedElements = insertAnElement(state.editor.elements, action);

      const updatedEditorStateAfterInsert = {
        ...state.editor,
        elements: insertedElements,
      };

      const updatedHistoryAfterInsert = [...state.history.history.slice(0, state.history.currentIndex + 1), { ...updatedEditorStateAfterInsert }];

      const insertedState = {
        ...state,
        editor: updatedEditorStateAfterInsert,
        history: {
          ...state.history,
          history: updatedHistoryAfterInsert,
          currentIndex: updatedHistoryAfterInsert.length - 1,
        },
      };

      console.log("✅ INSERT_ELEMENT completed");
      return insertedState;

    case "REORDER_ELEMENT":
      console.log("🚀 REORDER_ELEMENT case triggered");
      const reorderedElements = reorderElement(state.editor.elements, action);

      const updatedEditorStateAfterReorder = {
        ...state.editor,
        elements: reorderedElements,
      };

      const updatedHistoryAfterReorder = [...state.history.history.slice(0, state.history.currentIndex + 1), { ...updatedEditorStateAfterReorder }];

      const reorderedState = {
        ...state,
        editor: updatedEditorStateAfterReorder,
        history: {
          ...state.history,
          history: updatedHistoryAfterReorder,
          currentIndex: updatedHistoryAfterReorder.length - 1,
        },
      };

      console.log("✅ REORDER_ELEMENT completed");
      return reorderedState;

    case "CHANGE_CLICKED_ELEMENT":
      const clickedState = handleClickedElement(state, action);
      return clickedState;
    case "CHANGE_DEVICE":
      const changedDeviceState = handleChangeDevice(state, action);
      return changedDeviceState;
    case "TOGGLE_PREVIEW_MODE":
      const togglePreviewMode = handleTogglePreviewMode(state, action);
      return togglePreviewMode;
    case "TOGGLE_LIVE_MODE":
      const toggleLiveMode = handleToggleLiveMode(state, action);
      return toggleLiveMode;
    case "REDO":
      const redoState = handleRedoState(state, action);
      return redoState;
    case "UNDO":
      const undoState = handleUndoState(state, action);
      return undoState;
    case "LOAD_DATA":
      const loadedDataState = handleLoadData(initialState, initialEditorState, action);
      return loadedDataState;
    case "SET_PAGE_ID":
      const setPageIdState = handleSetPageIdState(state, action);
      return setPageIdState;
    default:
      return state;
  }
};

export type EditorContextData = {
  device: DeviceTypes;
  previewMode: boolean;
  setPreviewMode: (previewMode: boolean) => void;
  setDevice: (device: DeviceTypes) => void;
};

export const EditorContext = createContext<{
  state: EditorState;
  dispatch: Dispatch<EditorAction>;
  siteId: string;
  pageDetails: null;
}>({
  state: initialState,
  dispatch: () => undefined,
  siteId: "",
  pageDetails: null,
});

type EditorProps = {
  children: React.ReactNode;
  siteId: string;
  pageDetails: any;
};

const EditorProvider = (props: EditorProps) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  return (
    <EditorContext.Provider
      value={{
        state,
        dispatch,
        siteId: props.siteId,
        pageDetails: props.pageDetails,
      }}
    >
      {props.children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error("useEditor Hook must be used within the Editor Provider");
  return context;
};

export default EditorProvider;
