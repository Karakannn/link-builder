import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DeviceTypes, EditorElement } from "@/providers/editor/editor-provider"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates the final styles based on current device and responsive overrides
 * @param element EditorElement with potential responsive styles
 * @param device Current device (Desktop, Tablet, Mobile)
 * @returns Computed styles with responsive overrides applied
 */
export function getElementStyles(element: EditorElement, device: DeviceTypes): React.CSSProperties {
  // Base styles are always from the desktop version
  const baseStyles = { ...element.styles };
  
  // If we're on desktop or no responsive styles exist, return base styles
  if (device === "Desktop" || !element.responsiveStyles) {
    return baseStyles;
  }
  
  // Get responsive override styles for current device
  const responsiveOverrides = element.responsiveStyles[device];
  
  // Merge base styles with responsive overrides
  return {
    ...baseStyles,
    ...responsiveOverrides
  };
}

/**
 * Gets content values based on current device with responsive overrides
 * @param element EditorElement with content and potential responsiveContent
 * @param device Current device (Desktop, Tablet, Mobile)
 * @returns Content values with responsive overrides applied
 */
export function getElementContent(element: EditorElement, device: DeviceTypes): any {
  // Handle array content (containers)
  if (Array.isArray(element.content)) {
    return element.content;
  }
  
  // Handle object content (components)
  const baseContent = element.content;
  
  // If we're on desktop or no responsiveContent exists, return base content
  if (
    device === "Desktop" || 
    !baseContent || 
    typeof baseContent !== 'object' || 
    !('responsiveContent' in baseContent) || 
    !baseContent.responsiveContent
  ) {
    return baseContent;
  }
  
  // Get responsive content override for current device
  const responsiveContentOverrides = baseContent.responsiveContent[device];
  
  if (!responsiveContentOverrides) {
    return baseContent;
  }
  
  // Return merged content
  return {
    ...baseContent,
    ...responsiveContentOverrides
  };
}
