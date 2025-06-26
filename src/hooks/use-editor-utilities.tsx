import { 
  defaultStyles, 
  textDefaultStyles, 
  linkDefaultStyles, 
  animatedBorderButtonDefaultStyles,
  shimmerButtonDefaultStyles,

  containerDefaultStyles,
  closableContainerDefaultStyles
} from '@/lib/constants';
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
          styles: { ...textDefaultStyles } as React.CSSProperties,
        } as EditorElement;

      case "container":
        return {
          ...baseElement,
          name: "Container",
          content: [],
          type: "container",
          styles: { ...containerDefaultStyles } as React.CSSProperties,
        } as EditorElement;

      case "closableContainer":
        return {
          ...baseElement,
          name: "Closable Container",
          content: [],
          type: "closableContainer",
          styles: { ...closableContainerDefaultStyles } as React.CSSProperties,
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
              styles: { width: "50%", ...containerDefaultStyles } as React.CSSProperties,
              type: "container",
            },
            {
              content: [],
              id: v4(),
              name: "Container",
              styles: { width: "50%", ...containerDefaultStyles } as React.CSSProperties,
              type: "container",
            },
          ],
          styles: { display: "flex", ...containerDefaultStyles } as React.CSSProperties,
          type: "2Col",
        } as EditorElement;

      case "column":
        return {
          ...baseElement,
          name: "Column",
          content: [],
          type: "column",
          styles: {
            ...containerDefaultStyles,
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
              ...containerDefaultStyles,
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
            ...containerDefaultStyles,
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

      case "image":
        return {
          ...baseElement,
          name: "Image",
          content: {
            src: "",
            alt: "Image",
            objectFit: "cover",
            borderRadius: "0",
            shadow: "none",
            filter: "none",
            opacity: "1",
          } as any,
          styles: { 
            width: "300px", 
            height: "auto", 
            ...defaultStyles 
          } as React.CSSProperties,
          type: "image",
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
          styles: { ...linkDefaultStyles } as React.CSSProperties,
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
            ...shimmerButtonDefaultStyles,
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
            ...animatedBorderButtonDefaultStyles,
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

      case "neonCard":
        const neonCardId = crypto.randomUUID();
        const containerElementId = crypto.randomUUID();
        const imageElementId = crypto.randomUUID();
        const titleElementId = crypto.randomUUID();
        const subtitleElementId = crypto.randomUUID();
        
        return {
          ...baseElement,
          id: neonCardId,
          name: "Neon Card",
          content: [
            // Container wrapper for layout control
            {
              id: containerElementId,
              name: "Card Container",
              type: "container" as any,
              styles: {
                display: "flex",
                flexDirection: "column" as const,
                gap: "0px",
                width: "100%",
                height: "100%",
                padding: "0px",
                ...containerDefaultStyles,
              } as React.CSSProperties,
              content: [
                // Image element (using gif type for image functionality)
                {
                  id: imageElementId,
                  name: "Card Image",
                  type: "gif" as any,
                  styles: {
                    width: "100%",
                    height: "200px",
                    objectFit: "cover" as const,
                    borderRadius: "8px 8px 0 0",
                    ...defaultStyles,
                  } as React.CSSProperties,
                  content: {
                    src: "/file.svg",
                    alt: "Card Image",
                    autoplay: false,
                    loop: false,
                    controls: false,
                  },
                },
                // Title text element
                {
                  id: titleElementId,
                  name: "Card Title",
                  type: "text" as any,
                  styles: {
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#1f2937",
                    textAlign: "center" as const,
                    margin: "16px 0 8px 0",
                    ...textDefaultStyles,
                  } as React.CSSProperties,
                  content: {
                    innerText: "Neon Card Title",
                  },
                },
                // Subtitle text element
                {
                  id: subtitleElementId,
                  name: "Card Subtitle",
                  type: "text" as any,
                  styles: {
                    fontSize: "16px",
                    fontWeight: "normal",
                    color: "#6b7280",
                    textAlign: "center" as const,
                    margin: "0 0 16px 0",
                    ...textDefaultStyles,
                  } as React.CSSProperties,
                  content: {
                    innerText: "Amazing neon card subtitle",
                  },
                },
              ],
            },
          ],
          styles: {
            width: "350px",
            textAlign: "center" as const,
            margin: "10px auto",
            minHeight: "300px",
            padding: "0px",
            ...defaultStyles,
          } as React.CSSProperties,
          type: "neonCard",
        };

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
