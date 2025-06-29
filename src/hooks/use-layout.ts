import { EditorElement } from "@/providers/editor/editor-provider";
import { supportsLayout } from "@/lib/constants";

export type Layout = 'vertical' | 'horizontal';

export const useLayout = () => {
  // Get layout styles based on layout type
  const getLayoutStyles = (layout: Layout) => {
    switch (layout) {
      case 'horizontal':
        return {
          display: 'flex',
          flexDirection: 'row' as const,
          gap: '1rem',
          flexWrap: 'wrap' as const,
        };
      case 'vertical':
      default:
        return {
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '0.5rem',
        };
    }
  };

  // Convert element layout to Layout type
  const getElementLayout = (element: EditorElement): Layout => {
    if (!supportsLayout(element.type)) {
      return 'vertical'; // Default for non-layout elements
    }
    
    return element.layout === 'horizontal' ? 'horizontal' : 'vertical';
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