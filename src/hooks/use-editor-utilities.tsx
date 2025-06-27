import { 
  defaultStyles, 
  textDefaultStyles, 
  linkDefaultStyles, 
  animatedBorderButtonDefaultStyles,
  shimmerButtonDefaultStyles,

  containerDefaultStyles,
  closableContainerDefaultStyles,
  supportsLayout
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

    // Add default layout for layout-supported elements
    const layoutElement = supportsLayout(type as any) ? { layout: "vertical" as const } : {};

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
          ...layoutElement,
          name: "Container",
          content: [],
          type: "container",
          styles: { ...containerDefaultStyles } as React.CSSProperties,
        } as EditorElement;

      case "closableContainer":
        return {
          ...baseElement,
          ...layoutElement,
          name: "Closable Container",
          content: [],
          type: "closableContainer",
          styles: { ...closableContainerDefaultStyles } as React.CSSProperties,
        } as EditorElement;

      case "2Col":
        return {
          ...baseElement,
          ...layoutElement,
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
          ...layoutElement,
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
          ...layoutElement,
          id: neonCardId,
          name: "Neon Card",
          content: [
            // Container wrapper for layout control
            {
              id: containerElementId,
              name: "Card Container",
              type: "container",
              layout: "vertical",
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
                {
                  id: imageElementId,
                  name: "Card Image",
                  type: "gif",
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
                  type: "text",
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
                  type: "text",
                  styles: {
                    fontSize: "16px",
                    color: "#6b7280",
                    textAlign: "center" as const,
                    margin: "0 0 16px 0",
                    ...textDefaultStyles,
                  } as React.CSSProperties,
                  content: {
                    innerText: "Card description goes here",
                  },
                },
              ],
            },
          ],
          styles: {
            width: "300px",
            height: "auto",
            ...defaultStyles,
          } as React.CSSProperties,
          type: "neonCard",
        } as EditorElement;

      case "sponsorNeonCard":
        const sponsorNeonCardId = crypto.randomUUID();
        const sponsorContainerElementId = crypto.randomUUID();
        const logoElementId = crypto.randomUUID();
        const sponsorTitleElementId = crypto.randomUUID();
        const sponsorTextElementId = crypto.randomUUID();
        
        return {
          ...baseElement,
          ...layoutElement,
          id: sponsorNeonCardId,
          name: "Sponsor Neon Card",
          content: [
            // Main container - exactly matches the example
            {
              id: sponsorContainerElementId,
              name: "Main Container",
              type: "container",
              layout: "vertical",
              styles: {
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "center" as const,
                justifyContent: "center" as const,
                gap: "8px",
                width: "100%",
                height: "100%",
                padding: "4px 12px",
                margin: "0px",
                ...containerDefaultStyles,
              } as React.CSSProperties,
              content: [
                // Logo wrapper - exactly matches the example
                {
                  id: crypto.randomUUID(),
                  name: "Logo Wrapper",
                  type: "container",
                  layout: "vertical",
                  styles: {
                    display: "flex",
                    alignItems: "center" as const,
                    justifyContent: "center" as const,
                    width: "100%",
                    margin: "0px",
                    padding: "0px",
                    ...containerDefaultStyles,
                  } as React.CSSProperties,
                  content: [
                    // Logo image - exactly matches the example
                    {
                      id: logoElementId,
                      name: "Sponsor Logo",
                      type: "image",
                      styles: {
                        maxWidth: "80%",
                        height: "24px",
                        objectFit: "contain" as const,
                        margin: "0px",
                        padding: "0px",
                        ...defaultStyles,
                      } as React.CSSProperties,
                      content: {
                        src: "/file.svg",
                        alt: "Sponsor Logo",
                      },
                    },
                  ],
                },
                // Content wrapper - exactly matches the example
                {
                  id: crypto.randomUUID(),
                  name: "Content Wrapper",
                  type: "container",
                  layout: "vertical",
                  styles: {
                    position: "relative" as const,
                    zIndex: "20",
                    display: "flex",
                    flexDirection: "column" as const,
                    alignItems: "center" as const,
                    gap: "0px",
                    margin: "0px",
                    padding: "0px",
                    ...containerDefaultStyles,
                  } as React.CSSProperties,
                  content: [
                    // Title - exactly matches the example
                    {
                      id: sponsorTitleElementId,
                      name: "Sponsor Title",
                      type: "text",
                      styles: {
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "var(--card-color)",
                        textAlign: "center" as const,
                        margin: "0px",
                        padding: "0px",
                        lineHeight: "1",
                        ...textDefaultStyles,
                      } as React.CSSProperties,
                      content: {
                        innerText: "Sponsor Title",
                      },
                    },
                    // Text - exactly matches the example
                    {
                      id: sponsorTextElementId,
                      name: "Sponsor Text",
                      type: "text",
                      styles: {
                        fontSize: "10px",
                        color: "var(--card-color)",
                        textAlign: "center" as const,
                        margin: "0px",
                        padding: "0px",
                        lineHeight: "1",
                        ...textDefaultStyles,
                      } as React.CSSProperties,
                      content: {
                        innerText: "Sponsored content",
                      },
                    },
                  ],
                },
              ],
            },
          ],
          styles: {
            width: "200px",
            height: "auto",
            ...defaultStyles,
          } as React.CSSProperties,
          type: "sponsorNeonCard",
        } as EditorElement;

      case "marquee":
        return {
          ...baseElement,
          ...layoutElement,
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
            height: "60px",
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
