"use client";

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useEditor } from "@/providers/editor/editor-provider";
import { v4 } from "uuid";
import { defaultStyles } from "@/lib/constants";

type DndContextProviderProps = {
  children: React.ReactNode;
};

export const DndContextProvider = ({ children }: DndContextProviderProps) => {
  const { dispatch } = useEditor();

  // PointerSensor with activation constraint to prevent accidental drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, 
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log("=== DRAG END EVENT ===");
    console.log("Active:", active);
    console.log("Over:", over);
    console.log("Active data:", active?.data?.current);
    console.log("Over data:", over?.data?.current);

    if (!over || !active) {
      console.log("No over or active, returning");
      return;
    }

    console.log("DndKit drag end:", { active, over });

    // Check if dropping on a container
    if (over.data?.current?.type === "container") {
      const containerId = over.data.current.containerId;
      const draggedType = active.data?.current?.type;
      const isFromSidebar = active.data?.current?.isSidebarElement;
      const isFromEditor = active.data?.current?.isEditorElement;
      const elementId = active.data?.current?.elementId;

      console.log("Dropping on container:", containerId, "Type:", draggedType, "From sidebar:", isFromSidebar, "From editor:", isFromEditor);

      // Handle sidebar elements (creating new elements)
      if (isFromSidebar) {
        console.log("Creating new element from sidebar");
        switch (draggedType) {
          case "text":
            console.log("Adding TEXT via dnd-kit to container:", containerId);
            dispatch({
              type: "ADD_ELEMENT",
              payload: {
                containerId: containerId,
                elementDetails: {
                  id: v4(),
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
            console.log("Adding CONTAINER via dnd-kit to container:", containerId);
            dispatch({
              type: "ADD_ELEMENT",
              payload: {
                containerId: containerId,
                elementDetails: {
                  id: v4(),
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

          case "2Col":
            console.log("Adding 2COL via dnd-kit to container:", containerId);
            dispatch({
              type: "ADD_ELEMENT",
              payload: {
                containerId: containerId,
                elementDetails: {
                  content: [
                    {
                      content: [],
                      id: v4(),
                      name: "Container",
                      styles: {
                        width: "50%",
                        ...defaultStyles,
                      },
                      type: "container",
                    },
                    {
                      content: [],
                      id: v4(),
                      name: "Container",
                      styles: {
                        width: "50%",
                        ...defaultStyles,
                      },
                      type: "container",
                    },
                  ],
                  id: v4(),
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

          case "video":
            console.log("Adding VIDEO via dnd-kit to container:", containerId);
            dispatch({
              type: "ADD_ELEMENT",
              payload: {
                containerId: containerId,
                elementDetails: {
                  content: {
                    src: "https://www.youtube.com/embed/A3l6YYkXzzg?si=zbcCeWcpq7Cwf8W1",
                  },
                  id: v4(),
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

          case "contactForm":
            console.log("Adding CONTACT FORM via dnd-kit to container:", containerId);
            dispatch({
              type: "ADD_ELEMENT",
              payload: {
                containerId: containerId,
                elementDetails: {
                  id: v4(),
                  name: "Contact Form",
                  content: [],
                  styles: {},
                  type: "contactForm",
                },
              },
            });
            break;

          case "link":
            console.log("Adding LINK via dnd-kit to container:", containerId);
            dispatch({
              type: "ADD_ELEMENT",
              payload: {
                containerId: containerId,
                elementDetails: {
                  id: v4(),
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

          case "shimmerButton":
            console.log("Adding SHIMMER BUTTON via dnd-kit to container:", containerId);
            dispatch({
              type: "ADD_ELEMENT",
              payload: {
                containerId: containerId,
                elementDetails: {
                  content: {
                    innerText: "Tıkla",
                    shimmerColor: "#ffffff",
                    shimmerSize: "0.1em",
                    shimmerDuration: "2s",
                    borderRadius: "10px",
                    background: "rgba(99, 102, 241, 1)",
                  },
                  id: v4(),
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

          // New Button Types
          case "animatedShinyButton":
            console.log("Adding ANIMATED SHINY BUTTON via dnd-kit to container:", containerId);
            dispatch({
              type: "ADD_ELEMENT",
              payload: {
                containerId: containerId,
                elementDetails: {
                  content: {
                    innerText: "Shiny Button",
                    buttonClass: "default",
                  },
                  id: v4(),
                  name: "Animated Shiny Button",
                  styles: {
                    width: "200px",
                    textAlign: "center",
                    margin: "10px auto",
                    ...defaultStyles,
                  },
                  type: "animatedShinyButton",
                },
              },
            });
            break;

          case "neonGradientButton":
            console.log("Adding NEON GRADIENT BUTTON via dnd-kit to container:", containerId);
            dispatch({
              type: "ADD_ELEMENT",
              payload: {
                containerId: containerId,
                elementDetails: {
                  content: {
                    innerText: "Neon Button",
                    firstColor: "#ff00aa",
                    secondColor: "#00FFF1",
                    borderSize: 2,
                    borderRadius: "20",
                  },
                  id: v4(),
                  name: "Neon Gradient Button",
                  styles: {
                    width: "200px",
                    textAlign: "center",
                    margin: "10px auto",
                    ...defaultStyles,
                  },
                  type: "neonGradientButton",
                },
              },
            });
            break;

          case "animatedBorderButton":
            console.log("Adding ANIMATED BORDER BUTTON via dnd-kit to container:", containerId);
            dispatch({
              type: "ADD_ELEMENT",
              payload: {
                containerId: containerId,
                elementDetails: {
                  content: {
                    innerText: "Border Button",
                    buttonClass: "default",
                  },
                  id: v4(),
                  name: "Animated Border Button",
                  styles: {
                    width: "200px",
                    textAlign: "center",
                    margin: "10px auto",
                    ...defaultStyles,
                  },
                  type: "animatedBorderButton",
                },
              },
            });
            break;

          case "animatedTextButton":
            console.log("Adding ANIMATED TEXT BUTTON via dnd-kit to container:", containerId);
            dispatch({
              type: "ADD_ELEMENT",
              payload: {
                containerId: containerId,
                elementDetails: {
                  content: {
                    innerText: "Text Button",
                    buttonClass: "default",
                  },
                  id: v4(),
                  name: "Animated Text Button",
                  styles: {
                    width: "200px",
                    textAlign: "center",
                    margin: "10px auto",
                    ...defaultStyles,
                  },
                  type: "animatedTextButton",
                },
              },
            });
            break;

          // Background Types
          case "animatedGridPattern":
            console.log("Adding ANIMATED GRID PATTERN via dnd-kit to container:", containerId);
            dispatch({
              type: "ADD_ELEMENT",
              payload: {
                containerId: containerId,
                elementDetails: {
                  content: {
                    width: 40,
                    height: 40,
                    numSquares: 50,
                    maxOpacity: 0.5,
                    duration: 4,
                    repeatDelay: 0.5,
                  },
                  id: v4(),
                  name: "Animated Grid Pattern",
                  styles: {
                    width: "100%",
                    height: "200px",
                    position: "relative",
                    ...defaultStyles,
                  },
                  type: "animatedGridPattern",
                },
              },
            });
            break;

          case "interactiveGridPattern":
            console.log("Adding INTERACTIVE GRID PATTERN via dnd-kit to container:", containerId);
            dispatch({
              type: "ADD_ELEMENT",
              payload: {
                containerId: containerId,
                elementDetails: {
                  content: {
                    width: 40,
                    height: 40,
                    squares: [24, 24],
                  },
                  id: v4(),
                  name: "Interactive Grid Pattern",
                  styles: {
                    width: "100%",
                    height: "200px",
                    position: "relative",
                    ...defaultStyles,
                  },
                  type: "interactiveGridPattern",
                },
              },
            });
            break;

          case "retroGrid":
            console.log("Adding RETRO GRID via dnd-kit to container:", containerId);
            dispatch({
              type: "ADD_ELEMENT",
              payload: {
                containerId: containerId,
                elementDetails: {
                  content: {
                    angle: 65,
                    cellSize: 60,
                    opacity: 0.5,
                    lightLineColor: "gray",
                    darkLineColor: "gray",
                  },
                  id: v4(),
                  name: "Retro Grid",
                  styles: {
                    width: "100%",
                    height: "200px",
                    position: "relative",
                    ...defaultStyles,
                  },
                  type: "retroGrid",
                },
              },
            });
            break;

          case "dotPattern":
            console.log("Adding DOT PATTERN via dnd-kit to container:", containerId);
            dispatch({
              type: "ADD_ELEMENT",
              payload: {
                containerId: containerId,
                elementDetails: {
                  content: {
                    width: 16,
                    height: 16,
                    cx: 1,
                    cy: 1,
                    cr: 1,
                  },
                  id: v4(),
                  name: "Dot Pattern",
                  styles: {
                    width: "100%",
                    height: "200px",
                    position: "relative",
                    ...defaultStyles,
                  },
                  type: "dotPattern",
                },
              },
            });
            break;

          case "marquee":
            console.log("Adding MARQUEE via dnd-kit to container:", containerId);
            dispatch({
              type: "ADD_ELEMENT",
              payload: {
                containerId: containerId,
                elementDetails: {
                  content: {
                    direction: "left",
                    speed: 50,
                    pauseOnHover: true,
                    items: [
                      { type: "text", content: "Sample Text 1" },
                      { type: "text", content: "Sample Text 2" },
                      { type: "text", content: "Sample Text 3" },
                    ],
                  },
                  id: v4(),
                  name: "Marquee",
                  styles: {
                    width: "100%",
                    height: "80px",
                    ...defaultStyles,
                  },
                  type: "marquee",
                },
              },
            });
            break;

          default:
            console.log("Unknown dnd-kit element type:", draggedType);
            break;
        }
      }

      // Handle editor elements (moving existing elements)
      else if (isFromEditor && elementId) {
        console.log("Moving existing element:", elementId, "to container:", containerId);

        // Check if trying to move element to itself
        if (elementId === containerId) {
          console.log("Cannot move element to itself, skipping");
          return;
        }

        // Dispatch move element action
        dispatch({
          type: "MOVE_ELEMENT",
          payload: {
            elementId: elementId,
            targetContainerId: containerId,
          },
        });
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      {children}
    </DndContext>
  );
};