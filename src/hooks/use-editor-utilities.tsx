import { defaultStyles } from '@/lib/constants';
import { EditorElement, EditorState } from '@/providers/editor/editor-provider';
import { UniqueIdentifier } from '@dnd-kit/core';
import React from 'react'
import { v4 } from 'uuid';

export const useEditorUtilities = () => {

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

      case "column":
        return {
          ...baseElement,
          name: "Column",
          content: [],
          type: "column",
          styles: {
            ...defaultStyles,
            minHeight: "120px",
          } as React.CSSProperties,
        } as EditorElement;

      case "gridLayout":
        // Başlangıçta 3 column oluştur
        const initialColumns = 3;
        const defaultGridColumns = 12;
        const defaultSpanPerColumn = Math.floor(defaultGridColumns / initialColumns); // 4
        const initialColumnElements = [];

        for (let i = 0; i < initialColumns; i++) {
          initialColumnElements.push({
            id: v4(),
            name: `Sütun ${i + 1}`,
            content: [],
            styles: {
              ...defaultStyles,
              minHeight: "120px",
            } as React.CSSProperties,
            type: "column",
          });
        }

        return {
          ...baseElement,
          name: "Grid Layout",
          content: initialColumnElements, // Sadece column array'i
          styles: {
            display: "grid",
            gridTemplateColumns: `repeat(${defaultGridColumns}, 1fr)`,
            gap: "1rem",
            // Grid ayarlarını styles'a ekle
            gridColumns: defaultGridColumns,
            columnSpans: Array(initialColumns).fill(defaultSpanPerColumn), // [4, 4, 4]
            gridGap: "1rem",
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

      case "neonGradientCard":
        return {
          ...baseElement,
          name: "Neon Gradient Card",
          content: {
            title: "LinkBet",
            subtitle: "999₺ Deneme Bonusu",
            logo: "",
            href: "#",
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
          type: "neonGradientCard",
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

  return {
    createElement
  }
}

// Extract all container IDs and their items for SortableContext
export const getContainerIds = (elements: EditorElement[]): UniqueIdentifier[] => {
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
export const getContainerItems = (state: EditorState, containerId: string): string[] => {
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
