import { Layout } from "@/app/_components/editor/_components-editor/dropzone-wrapper";
import { EditorElement } from "@/providers/editor/editor-provider";
import { supportsLayout } from "@/lib/constants";

export const useLayout = () => {
  // Get layout styles based on layout type
  const getLayoutStyles = (layout: Layout) => {
    switch (layout) {
      case Layout.Horizontal:
        return {
          display: 'flex',
          flexDirection: 'row' as const,
          gap: '1rem',
          flexWrap: 'wrap' as const,
        };
      case Layout.Vertical:
      default:
        return {
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '0.5rem',
        };
    }
  };

  // Convert element layout to Layout enum
  const getElementLayout = (element: EditorElement): Layout => {
    if (!supportsLayout(element.type)) {
      return Layout.Vertical; // Default for non-layout elements
    }
    
    return element.layout === 'horizontal' ? Layout.Horizontal : Layout.Vertical;
  };

  // Check if element supports layout
  const elementSupportsLayout = (element: EditorElement): boolean => {
    return supportsLayout(element.type);
  };

  return {
    getLayoutStyles,
    getElementLayout,
    elementSupportsLayout,
  };
}; 