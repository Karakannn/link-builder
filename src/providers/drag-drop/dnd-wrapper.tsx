"use client";

import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import { defaultStyles } from '@/lib/constants';
import { useEditor } from '@/providers/editor/editor-provider';

interface DndWrapperProps {
  children: React.ReactNode;
}

const DndWrapper: React.FC<DndWrapperProps> = ({ children }) => {
  const { dispatch } = useEditor();

  console.log("sa");
  
  const onDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;

    console.log("destination", destination);
    
    
    // Dropped outside a valid drop zone
    if (!destination) return;
    
    // If dragging from components sidebar to editor
    if (source.droppableId.includes('components') && destination.droppableId === 'editor-content') {
      // Add the element to the editor based on its type
      switch (draggableId) {
        case "text":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: "__body",
              elementDetails: {
                id: uuidv4(),
                name: "Text",
                content: {
                  innerText: "Text Element",
                },
                styles: {
                  ...defaultStyles,
                },
                type: "text",
              },
            },
          });
          break;
        case "container":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: "__body",
              elementDetails: {
                id: uuidv4(),
                name: "Container",
                content: [],
                styles: {
                  ...defaultStyles,
                },
                type: "container",
              },
            },
          });
          break;
        case "contactForm":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: "__body",
              elementDetails: {
                id: uuidv4(),
                name: "Contact Form",
                content: [],
                styles: {},
                type: "contactForm",
              },
            },
          });
          break;
        case "video":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: "__body",
              elementDetails: {
                content: {
                  src: "https://www.youtube.com/embed/A3l6YYkXzzg?si=zbcCeWcpq7Cwf8W1",
                },
                id: uuidv4(),
                name: "Video",
                styles: {
                  width: "560px",
                  height: "315px",
                  ...defaultStyles,
                },
                type: "video",
              },
            },
          });
          break;
        case "shimmerButton":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: "__body",
              elementDetails: {
                content: {
                  innerText: "Tıkla",
                  shimmerColor: "#ffffff",
                  shimmerSize: "0.1em",
                  shimmerDuration: "2s",
                  borderRadius: "10px",
                  background: "rgba(99, 102, 241, 1)",
                },
                id: uuidv4(),
                name: "Shimmer Button",
                styles: {
                  width: "200px",
                  textAlign: "center",
                  margin: "10px auto",
                  ...defaultStyles,
                },
                type: "shimmerButton",
              },
            },
          });
          break;
        case "link":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: "__body",
              elementDetails: {
                id: uuidv4(),
                name: "Link",
                content: {
                  href: "#",
                  innerText: "Link Element",
                },
                styles: {
                  ...defaultStyles,
                },
                type: "link",
              },
            },
          });
          break;
        case "2Col":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: "__body",
              elementDetails: {
                content: [
                  {
                    content: [],
                    id: uuidv4(),
                    name: "Container",
                    styles: {
                      width: "50%",
                      ...defaultStyles,
                    },
                    type: "container",
                  },
                  {
                    content: [],
                    id: uuidv4(),
                    name: "Container",
                    styles: {
                      width: "50%",
                      ...defaultStyles,
                    },
                    type: "container",
                  },
                ],
                id: uuidv4(),
                name: "Two Columns",
                styles: {
                  display: "flex",
                  ...defaultStyles,
                },
                type: "2Col",
              },
            },
          });
          break;
      }
    }
    
    // If dragging to a specific container (for nested elements)
    else if (destination.droppableId.startsWith('container-')) {
      const containerId = destination.droppableId.replace('container-', '');
      
      // Similar switch case as above but with containerId instead of "__body"
      // This would need to be implemented for each container where dropping is allowed
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {children}
    </DragDropContext>
  );
};

export default DndWrapper;