import {
  defaultStyles,
  textDefaultStyles,
  linkDefaultStyles,
  containerDefaultStyles,
  closableContainerDefaultStyles,
  pulsatingButtonDefaultStyles,
  animatedTextDefaultStyles,
  supportsLayout,
  liveStreamCardDefaultStyles
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
          content: {
            innerText: "Sponsor Title",
            fontSize: "12px",
            fontWeight: "bold",
            color: "var(--card-color)",
            textAlign: "center",
          },
          type: "text",
          styles: {
            ...textDefaultStyles,
            fontSize: "12px",
            fontWeight: "bold",
            color: "var(--card-color)",
            textAlign: "center",
            margin: "0px",
            padding: "0px",
            lineHeight: "1",
          } as React.CSSProperties,
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
            minHeight: "30px",
          } as React.CSSProperties,
        } as EditorElement;

      case "gridLayout":
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
              padding: "0px",
              minHeight: "30px",
              margin: "0px",
            } as React.CSSProperties,
            type: "column",
          });
        }

        return {
          ...baseElement,
          name: "Grid Layout",
          content: initialColumnElements,
          styles: {
            ...containerDefaultStyles,
            display: "grid",
            gridTemplateColumns: `repeat(${defaultGridColumns}, 1fr)`,
            gap: "1rem",
            gridColumns: defaultGridColumns,
            columnSpans: Array(initialColumns).fill(defaultSpanPerColumn),
            gridGap: "1rem",


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
            alt: "Sponsor Logo",
            objectFit: "contain",
            height: "24px",
          } as any,
          styles: {
            height: "24px",
            objectFit: "contain",
            margin: "0px",
            padding: "0px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            ...defaultStyles
          } as React.CSSProperties,
          type: "image",
        } as EditorElement;

      case "link":
        return {
          ...baseElement,
          name: "Link",
          content: { href: "#", innerText: "Link Element" },
          type: "link",
          styles: { ...linkDefaultStyles } as React.CSSProperties,
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
                margin: "12px",
                fontSize: "16px",
              } as React.CSSProperties,
              content: [
                {
                  id: logoElementId,
                  name: "Sponsor Logo",
                  type: "image",
                  styles: {
                    height: "24px",
                    objectFit: "contain" as const,
                    margin: "0px",
                    padding: "0px",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    opacity: "100%",
                    position: "relative",
                    width: "100%",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  } as React.CSSProperties,
                  content: {
                    src: "/file.svg",
                    alt: "Sponsor Logo",
                  },
                },
                {
                  id: crypto.randomUUID(),
                  name: "Content Wrapper",
                  type: "container",
                  layout: "vertical",
                  styles: {
                    position: "relative" as const,
                    display: "flex",
                    flexDirection: "column" as const,
                    alignItems: "center" as const,
                    padding: "0",
                    width: "auto",
                  } as React.CSSProperties,
                  content: [
                    {
                      id: sponsorTitleElementId,
                      name: "Sponsor Title",
                      type: "text",
                      styles: {
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#ff00aa",
                        textAlign: "center" as const,
                        margin: "0px",
                        padding: "0px",
                        lineHeight: "1.25rem",
                      } as React.CSSProperties,
                      content: {
                        innerText: "V.I.P",
                      },
                    },
                    {
                      id: sponsorTextElementId,
                      name: "Sponsor Description",
                      type: "text",
                      styles: {
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "white",
                        textAlign: "center" as const,
                        margin: "0px",
                        padding: "0px",
                        lineHeight: "1rem",
                      } as React.CSSProperties,
                      content: {
                        innerText: "Description",
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
            borderSize: 2,
            zIndex: 10,
            neonColor: "#ff00aa",
            animationDelay: 0,
            cardType: "neon",
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

      case "pulsatingButton":
        return {
          ...baseElement,
          name: "Pulsating Button",
          content: {
            innerText: "Click me",
            pulseColor: "#808080",
            duration: "1.5s",
            href: "",
          } as any,
          styles: { ...pulsatingButtonDefaultStyles } as React.CSSProperties,
          type: "pulsatingButton",
        } as EditorElement;

      case "animatedText":
        return {
          ...baseElement,
          name: "Animated Text",
          content: {
            innerText: "ANIMATED TEXT",
            neonTextColor: "#00ff00",
            neonBorderColor: "#00ff00",
          },
          styles: { ...animatedTextDefaultStyles } as React.CSSProperties,
          type: "animatedText",
        } as EditorElement;

      case "liveStreamCard":
        return {
          ...baseElement,
          name: "Live Stream Card",
          content: [],
          styles: { ...liveStreamCardDefaultStyles } as React.CSSProperties,
          type: "liveStreamCard",
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
