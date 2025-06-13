import { DeviceTypes, EditorElement } from "./editor-provider";

export type EditorAction =
  | {
      type: "ADD_ELEMENT";
      payload: {
        containerId: string;
        elementDetails: EditorElement;
      };
    }
  | {
      type: "INSERT_ELEMENT";
      payload: {
        containerId: string;
        insertIndex: number;
        elementDetails: EditorElement;
      };
    }
  | {
      type: "UPDATE_ELEMENT";
      payload: {
        elementDetails: EditorElement;
      };
    }
  | {
      type: "DELETE_ELEMENT";
      payload: {
        elementDetails: EditorElement;
      };
    }
  | {
      type: "MOVE_ELEMENT";
      payload: {
        elementId: string;
        targetContainerId: string;
      };
    }
  | {
      type: "REORDER_COLUMNS"; // ← YENİ EKLENEN
      payload: {
        activeColumnId: string;
        overColumnId: string;
      };
    }
  | {
      type: "REORDER_ELEMENT";
      payload: {
        elementId: string;
        containerId: string;
        insertIndex: number;
      };
    }
  | {
      type: "CHANGE_CLICKED_ELEMENT";
      payload: {
        elementDetails?:
          | EditorElement
          | {
              id: "";
              content: [];
              name: "";
              styles: {};
              type: null;
            };
      };
    }
  | {
      type: "CHANGE_DEVICE";
      payload: {
        device: DeviceTypes;
      };
    }
  | {
      type: "TOGGLE_PREVIEW_MODE";
    }
  | {
      type: "TOGGLE_LIVE_MODE";
      payload?: {
        value: boolean;
      };
    }
  | { type: "REDO" }
  | { type: "UNDO" }
  | {
      type: "LOAD_DATA";
      payload: {
        elements: EditorElement[];
        withLive: boolean;
      };
    }
  | {
      type: "SET_PAGE_ID";
      payload: {
        pageId: string;
      };
    };
