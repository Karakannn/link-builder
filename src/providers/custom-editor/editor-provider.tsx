import { EditorBtns } from "@/lib/constants";
import { CSSProperties, Dispatch } from "react";
import { EditorAction } from "../editor/editor-actions";

export type DeviceTypes = "Desktop" | "Tablet" | "Mobile";

export type EditorElement = {
  id: string;
  styles: CSSProperties;
  name: string;
  type: EditorBtns;
  content: EditorElement[] | {};
};

export type Editor = {
  liveMode: boolean;
  elements: EditorElement[];
  selectedElement: EditorElement;
  device: DeviceTypes;
  previewMode: boolean;
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
      id: "__body",
      name: "__body",
      type: "__body",
      content: [],
      styles: {},
    },
  ],
  selectedElement: {
    id: "",
    styles: {},
    name: "",
    type: null,
    content: [],
  },
  liveMode: false,
  device: "Desktop",
  previewMode: false,
};

const initialHistoryState: EditorState["history"] = {
  history: [initialEditorState],
  currentIndex: 0,
};

const initialState: EditorState = {
  editor: initialEditorState,
  history: initialHistoryState,
};

const editorReducer = (state: EditorState = initialState, action: EditorAction): EditorState => {
  switch (action.type) {
    case "ADD_ELEMENT":

    

    case "UPDATE_ELEMENT":
    case "DELETE_ELEMENT":
    case "CHANGE_CLICKED_ELEMENT":
    case "CHANGE_DEVICE":
    case "TOGGLE_PREVIEW_MODE":
    case "TOGGLE_LIVE_MODE":
    case "REDO":
    case "UNDO":
    case "LOAD_DATA":
    case "SET_FUNNEL_PAGE_ID":
    default:
      return state;
  }
};
