"use client";

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useEditor, EditorElement } from "@/providers/editor/editor-provider";
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

  // Helper function to create new element based on type
  const createElement = (type: string): EditorElement | null => {
    console.log("🔧 Creating new element of type:", type);

    const baseElement = {
      id: v4(),
      styles: { ...defaultStyles } as React.CSSProperties,
    };

    switch (type) {
      case "text":
        return {
          ...baseElement,
          name: "Text",
          content: { innerText: "Text Element" },
          type: "text",
        } as EditorElement;

      case "container":
        return {
          ...baseElement,
          name: "Container",
          content: [],
          type: "container",
        } as EditorElement;

      case "2Col":
        return {
          ...baseElement,
          name: "Two Columns",
          content: [
            {
              content: [],
              id: v4(),
              name: "Container",
              styles: { width: "50%", ...defaultStyles } as React.CSSProperties,
              type: "container",
            },
            {
              content: [],
              id: v4(),
              name: "Container",
              styles: { width: "50%", ...defaultStyles } as React.CSSProperties,
              type: "container",
            },
          ],
          styles: { display: "flex", ...defaultStyles } as React.CSSProperties,
          type: "2Col",
        } as EditorElement;

      case "gridLayout":
        // Başlangıçta 3 container oluştur
        const initialColumns = 3;
        const initialContainers = [];

        for (let i = 0; i < initialColumns; i++) {
          initialContainers.push({
            id: v4(),
            name: `Grid Container ${i + 1}`,
            content: [],
            styles: {
              ...defaultStyles,
              minHeight: "120px",
              width: "100%",
            } as React.CSSProperties,
            type: "container",
          });
        }

        return {
          ...baseElement,
          name: "Grid Layout",
          content: initialContainers, // Container'ları içeren array
          styles: {
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "1rem",
            ...defaultStyles,
          } as React.CSSProperties,
          type: "gridLayout",
        } as EditorElement;

      case "video":
        return {
          ...baseElement,
          name: "Video",
          content: { src: "https://www.youtube.com/embed/A3l6YYkXzzg?si=zbcCeWcpq7Cwf8W1" },
          styles: { width: "560px", height: "315px", ...defaultStyles } as React.CSSProperties,
          type: "video",
        } as EditorElement;

      case "gif":
        return {
          ...baseElement,
          name: "GIF",
          content: {
            src: "",
            alt: "GIF",
            autoplay: true,
            loop: true,
            controls: false,
          },
          styles: { width: "300px", height: "auto", ...defaultStyles } as React.CSSProperties,
          type: "gif",
        } as EditorElement;

      case "contactForm":
        return {
          ...baseElement,
          name: "Contact Form",
          content: [],
          styles: {} as React.CSSProperties,
          type: "contactForm",
        } as EditorElement;

      case "link":
        return {
          ...baseElement,
          name: "Link",
          content: { href: "#", innerText: "Link Element" },
          type: "link",
        } as EditorElement;

      case "shimmerButton":
        return {
          ...baseElement,
          name: "Shimmer Button",
          content: {
            innerText: "Tıkla",
            shimmerColor: "#ffffff",
            shimmerSize: "0.1em",
            shimmerDuration: "2s",
            borderRadius: "10px",
            background: "rgba(99, 102, 241, 1)",
          },
          styles: {
            width: "200px",
            textAlign: "center" as const,
            margin: "10px auto",
            ...defaultStyles,
          } as React.CSSProperties,
          type: "shimmerButton",
        } as EditorElement;

      case "animatedShinyButton":
        return {
          ...baseElement,
          name: "Animated Shiny Button",
          content: {
            innerText: "Shiny Button",
            buttonClass: "default",
          },
          styles: {
            width: "200px",
            textAlign: "center" as const,
            margin: "10px auto",
            ...defaultStyles,
          } as React.CSSProperties,
          type: "animatedShinyButton",
        } as EditorElement;

      case "neonGradientButton":
        return {
          ...baseElement,
          name: "Neon Gradient Button",
          content: {
            innerText: "Neon Button",
            firstColor: "#ff00aa",
            secondColor: "#00FFF1",
            borderSize: 2,
            borderRadius: "20",
          },
          styles: {
            width: "200px",
            textAlign: "center" as const,
            margin: "10px auto",
            ...defaultStyles,
          } as React.CSSProperties,
          type: "neonGradientButton",
        } as EditorElement;

      case "animatedBorderButton":
        return {
          ...baseElement,
          name: "Animated Border Button",
          content: {
            innerText: "Border Button",
            buttonClass: "default",
          },
          styles: {
            width: "200px",
            textAlign: "center" as const,
            margin: "10px auto",
            ...defaultStyles,
          } as React.CSSProperties,
          type: "animatedBorderButton",
        } as EditorElement;

      case "animatedTextButton":
        return {
          ...baseElement,
          name: "Animated Text Button",
          content: {
            innerText: "Text Button",
            buttonClass: "default",
          },
          styles: {
            width: "200px",
            textAlign: "center" as const,
            margin: "10px auto",
            ...defaultStyles,
          } as React.CSSProperties,
          type: "animatedTextButton",
        } as EditorElement;

      case "animatedGridPattern":
        return {
          ...baseElement,
          name: "Animated Grid Pattern",
          content: {
            width: 40,
            height: 40,
            numSquares: 50,
            maxOpacity: 0.5,
            duration: 4,
            repeatDelay: 0.5,
          },
          styles: {
            width: "100%",
            height: "200px",
            position: "relative" as const,
            ...defaultStyles,
          } as React.CSSProperties,
          type: "animatedGridPattern",
        } as EditorElement;

      case "interactiveGridPattern":
        return {
          ...baseElement,
          name: "Interactive Grid Pattern",
          content: {
            width: 40,
            height: 40,
            squares: [24, 24],
          },
          styles: {
            width: "100%",
            height: "200px",
            position: "relative" as const,
            ...defaultStyles,
          } as React.CSSProperties,
          type: "interactiveGridPattern",
        } as EditorElement;

      case "retroGrid":
        return {
          ...baseElement,
          name: "Retro Grid",
          content: {
            angle: 65,
            cellSize: 60,
            opacity: 0.5,
            lightLineColor: "gray",
            darkLineColor: "gray",
          },
          styles: {
            width: "100%",
            height: "200px",
            position: "relative" as const,
            ...defaultStyles,
          } as React.CSSProperties,
          type: "retroGrid",
        } as EditorElement;

      case "dotPattern":
        return {
          ...baseElement,
          name: "Dot Pattern",
          content: {
            width: 16,
            height: 16,
            cx: 1,
            cy: 1,
            cr: 1,
          },
          styles: {
            width: "100%",
            height: "200px",
            position: "relative" as const,
            ...defaultStyles,
          } as React.CSSProperties,
          type: "dotPattern",
        } as EditorElement;

      case "marquee":
        return {
          ...baseElement,
          name: "Marquee",
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
          styles: {
            width: "100%",
            height: "80px",
            ...defaultStyles,
          } as React.CSSProperties,
          type: "marquee",
        } as EditorElement;

      default:
        console.error("❌ Unknown element type:", type);
        return null;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log("\n" + "=".repeat(50));
    console.log("🎯 DRAG END EVENT STARTED");
    console.log("=".repeat(50));

    console.log("📦 Active (what's being dragged):");
    console.log("  - ID:", active?.id);
    console.log("  - Data:", active?.data?.current);

    console.log("\n🎯 Over (where it's being dropped):");
    console.log("  - ID:", over?.id);
    console.log("  - Data:", over?.data?.current);

    if (!over || !active) {
      console.log("❌ No over or active element, aborting drag");
      console.log("=".repeat(50) + "\n");
      return;
    }

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
          console.log("🚀 Dispatching INSERT_ELEMENT action:");
          console.log("  - Container ID:", containerId);
          console.log("  - Insert Index:", insertIndex);
          console.log("  - Element:", newElement.name, newElement.id);

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
    // Handle CONTAINER drops (add to end of container) - MEVCUT YAPIYI KORUYORUZ
    else if (over.data?.current?.type === "container") {
      console.log("\n📦 CONTAINER DROP OPERATION DETECTED");

      const containerId = over.data.current.containerId;
      console.log("📍 Container Details:");
      console.log("  - Container ID:", containerId);

      // Handle sidebar elements (creating new elements)
      if (isFromSidebar) {
        console.log("\n🆕 Adding new element to container end");

        const newElement = createElement(draggedType);
        if (newElement) {
          console.log("🚀 Dispatching ADD_ELEMENT action:");
          console.log("  - Container ID:", containerId);
          console.log("  - Element:", newElement.name, newElement.id);

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
          console.log("=".repeat(50) + "\n");
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

    console.log("\n" + "=".repeat(50));
    console.log("🏁 DRAG END EVENT COMPLETED");
    console.log("=".repeat(50) + "\n");
  };

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      {children}
    </DndContext>
  );
};
