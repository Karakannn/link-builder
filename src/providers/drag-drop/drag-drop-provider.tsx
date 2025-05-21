"use client";

import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';

type DropIndicator = {
  containerId: string | null;
  position: 'top' | 'bottom' | null;
};

interface DragDropState {
  activeContainer: string | null;
  isDragging: boolean;
  dropIndicator: DropIndicator;
}

type DragDropAction =
  | { type: 'SET_ACTIVE_CONTAINER'; payload: string | null }
  | { type: 'SET_IS_DRAGGING'; payload: boolean }
  | { type: 'SET_DROP_INDICATOR'; payload: DropIndicator }
  | { type: 'RESET_DRAG_STATE' };

const initialState: DragDropState = {
  activeContainer: null,
  isDragging: false,
  dropIndicator: {
    containerId: null,
    position: null,
  },
};

const dragDropReducer = (state: DragDropState, action: DragDropAction): DragDropState => {
  switch (action.type) {
    case 'SET_ACTIVE_CONTAINER':
      return {
        ...state,
        activeContainer: action.payload,
      };
    case 'SET_IS_DRAGGING':
      return {
        ...state,
        isDragging: action.payload,
      };
    case 'SET_DROP_INDICATOR':
      return {
        ...state,
        dropIndicator: action.payload,
      };
    case 'RESET_DRAG_STATE':
      return initialState;
    default:
      return state;
  }
};

interface DragDropContextProps {
  state: DragDropState;
  dispatch: Dispatch<DragDropAction>;
}

const DragDropContext = createContext<DragDropContextProps | undefined>(undefined);

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};

interface DragDropProviderProps {
  children: ReactNode;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(dragDropReducer, initialState);

  return (
    <DragDropContext.Provider value={{ state, dispatch }}>
      {children}
    </DragDropContext.Provider>
  );
}; 