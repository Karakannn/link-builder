"use client";

import { createContext, Dispatch, useContext, useReducer } from "react";
import { EditorBtns } from "@/lib/constants";
import { EditorAction } from "./editor-actions";
import { arrayMove } from "@dnd-kit/sortable";

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
  backgroundAnimation?: string;
  layout?: 'vertical' | 'horizontal';
  customProperties?: {
    borderSize?: number;
    borderRadius?: number;
    neonColor?: string;
    animationDelay?: number;
    imageUrl?: string;
    title?: string;
    description?: string;
  };
  content:
  | EditorElement[]
  | {
    // Common content properties
    href?: string;
    innerText?: string;
    src?: string;

    // Background animation property
    backgroundAnimation?: string;

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
    
    // Neon card properties
    imageSrc?: string;
    imageAlt?: string;
    imageHeight?: number;

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

    // Sponsor Neon Card properties
    neonColor?: string;
    animationDelay?: number;

    responsiveContent?: {
      Tablet?: {
        // All the above properties can be responsive
        href?: string;
        innerText?: string;
        src?: string;
        backgroundAnimation?: string;
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
        
        // Neon card responsive properties
        imageSrc?: string;
        imageAlt?: string;
        imageHeight?: number;
        
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
        backgroundAnimation?: string;
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
        
        // Neon card responsive properties
        imageSrc?: string;
        imageAlt?: string;
        imageHeight?: number;
        
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
  if (action.type !== "ADD_ELEMENT") return editorArray;

  return editorArray.map((item) => {
    if (item.id === action.payload.containerId && Array.isArray(item.content)) {
      return {
        ...item,
        content: [...item.content, action.payload.elementDetails],
      };
    } else if (Array.isArray(item.content)) {
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

  // Step 1: Find the element and its parent
  const { element, parent } = findElementAndParent(elements, elementId);

  if (!element || !parent) {
    return elements;
  }

  // Step 2: Create a deep copy of the elements to avoid mutation
  const newElements = JSON.parse(JSON.stringify(elements));

  // Step 3: Find the element copy and parent copy
  const { element: elementCopy, parent: parentCopy } = findElementAndParent(newElements, elementId);

  if (!elementCopy || !parentCopy || !Array.isArray(parentCopy.content)) {
    return elements;
  }

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
    return elements;
  }

  if (!Array.isArray(targetContainer.content)) {
    return elements;
  }

  // Step 5: Remove the element from its original parent
  parentCopy.content = parentCopy.content.filter((item) => item.id !== elementId);

  // Step 6: Add the element to the target container directly
  targetContainer.content.push(elementCopy);

  return newElements;
};

const updateAnElement = (editorArray: EditorElement[], action: EditorAction): EditorElement[] => {
  if (action.type !== "UPDATE_ELEMENT") throw Error("You sent the wrong action type on the UPDATE_ELEMENT editor State");

  return editorArray.map((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return {
        ...item,
        ...action.payload.elementDetails,
      };
    } else if (item.content && Array.isArray(item.content)) {
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

  return editorArray.map((item) => {
    if (item.id === action.payload.containerId && Array.isArray(item.content)) {
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

  console.log(`🔧 REORDER_ELEMENT Logic Start:`, { elementId, containerId, insertIndex });

  // Find the element and its parent
  const { element, parent } = findElementAndParent(elements, elementId);

  if (!element || !parent) {
    console.log(`❌ Element or parent not found`);
    return elements;
  }

  // Create a deep copy of the elements
  const newElements = JSON.parse(JSON.stringify(elements));

  // Find the element copy and parent copy in new structure
  const { element: elementCopy, parent: parentCopy } = findElementAndParent(newElements, elementId);

  if (!elementCopy || !parentCopy || !Array.isArray(parentCopy.content)) {
    console.log(`❌ Element copy or parent copy not found`);
    return elements;
  }

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
    console.log(`❌ Target container not found or not array`);
    return elements;
  }

  // SAME CONTAINER: Use arrayMove for optimal reordering
  if (containerId === parent.id) {
    console.log(`🔄 Same container move - using arrayMove`);
    
    const currentIndex = parentCopy.content.findIndex((item) => item.id === elementId);
    console.log(`📐 ArrayMove: ${currentIndex} -> ${insertIndex}`);
    
    // Use dnd-kit's arrayMove for safe reordering within same container
    parentCopy.content = arrayMove(parentCopy.content, currentIndex, insertIndex);
    
  } else {
    // DIFFERENT CONTAINER: Manual move between containers
    console.log(`↔️ Different container move`);
    
    // Remove from source
    parentCopy.content = parentCopy.content.filter((item) => item.id !== elementId);
    
    // Insert to target at specified index
    targetContainer.content.splice(insertIndex, 0, elementCopy);
  }

  console.log(`✅ REORDER_ELEMENT completed`);
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
      const updateElements = updateAnElement(state.editor.elements, action);

      // Check if the updated element is the currently selected element
      const updatedElementIsSelected = state.editor.selectedElement.id === action.payload.elementDetails.id;

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

      return insertedState;

    case "REORDER_ELEMENT":
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
