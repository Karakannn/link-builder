import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { DeviceTypes, EditorElement } from "@/providers/editor/editor-provider"
import { Building2, Users, File } from "lucide-react";
import { IconDashboard, IconSettings, IconDatabase, IconWorld } from "@tabler/icons-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses custom CSS string and converts it to CSS properties object
 * @param customCSS Custom CSS string
 * @returns CSS properties object
 */
function parseCustomCSS(customCSS: string): any {
  if (!customCSS || typeof customCSS !== 'string') {
    return {};
  }

  const cssProperties: any = {};

  // CSS string'ini parse et - tüm property'leri kabul et
  const cssRules = customCSS
    .split(';')
    .map(rule => rule.trim())
    .filter(rule => rule && !rule.startsWith('/*') && !rule.startsWith('//')); // Sadece yorumları filtrele

  cssRules.forEach(rule => {
    const colonIndex = rule.indexOf(':');
    if (colonIndex > 0) {
      const property = rule.substring(0, colonIndex).trim();
      const value = rule.substring(colonIndex + 1).trim();

      if (property && value) {
        // CSS property name'ini camelCase'e çevir
        const camelCaseProperty = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        cssProperties[camelCaseProperty] = value;
      }
    }
  });

  return cssProperties;
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
    // Apply custom CSS if it exists
    if ((baseStyles as any).customCSS) {
      const customCSSProperties = parseCustomCSS((baseStyles as any).customCSS);
      return {
        ...baseStyles,
        ...customCSSProperties,
      };
    }
    return baseStyles;
  }

  // Get responsive override styles for current device
  const responsiveOverrides = element.responsiveStyles[device];

  // Merge base styles with responsive overrides
  const mergedStyles = {
    ...baseStyles,
    ...responsiveOverrides
  };

  // Apply custom CSS if it exists (responsive styles'da da olabilir)
  const customCSS = (responsiveOverrides as any)?.customCSS || (baseStyles as any).customCSS;
  if (customCSS) {
    const customCSSProperties = parseCustomCSS(customCSS);
    return {
      ...mergedStyles,
      ...customCSSProperties,
    };
  }

  return mergedStyles;
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

function parseSpacingShorthand(value: string | number | undefined): [string, string, string, string] {
  if (typeof value === "number") return [`${value}px`, `${value}px`, `${value}px`, `${value}px`];
  if (!value) return ["0px", "0px", "0px", "0px"];
  const parts = value.toString().split(" ");
  if (parts.length === 1) return [parts[0], parts[0], parts[0], parts[0]];
  if (parts.length === 2) return [parts[0], parts[1], parts[0], parts[1]];
  if (parts.length === 3) return [parts[0], parts[1], parts[2], parts[1]];
  if (parts.length === 4) return [parts[0], parts[1], parts[2], parts[3]];
  return ["0px", "0px", "0px", "0px"];
}

export function expandSpacingShorthand(styles: React.CSSProperties): React.CSSProperties {
  const expanded = { ...styles };

  // Handle padding - expand shorthand if it exists and individual values don't
  if (expanded.padding && (!expanded.paddingTop && !expanded.paddingRight && !expanded.paddingBottom && !expanded.paddingLeft)) {
    const [top, right, bottom, left] = parseSpacingShorthand(expanded.padding);
    expanded.paddingTop = top;
    expanded.paddingRight = right;
    expanded.paddingBottom = bottom;
    expanded.paddingLeft = left;
  }

  // Ensure individual padding values exist (use existing or default to 0px)
  if (!expanded.paddingTop) expanded.paddingTop = "0px";
  if (!expanded.paddingRight) expanded.paddingRight = "0px";
  if (!expanded.paddingBottom) expanded.paddingBottom = "0px";
  if (!expanded.paddingLeft) expanded.paddingLeft = "0px";

  // Handle margin - expand shorthand if it exists and individual values don't
  if (expanded.margin && (!expanded.marginTop && !expanded.marginRight && !expanded.marginBottom && !expanded.marginLeft)) {
    const [top, right, bottom, left] = parseSpacingShorthand(expanded.margin);
    expanded.marginTop = top;
    expanded.marginRight = right;
    expanded.marginBottom = bottom;
    expanded.marginLeft = left;
  }

  // Ensure individual margin values exist (use existing or default to 0px)
  if (!expanded.marginTop) expanded.marginTop = "0px";
  if (!expanded.marginRight) expanded.marginRight = "0px";
  if (!expanded.marginBottom) expanded.marginBottom = "0px";
  if (!expanded.marginLeft) expanded.marginLeft = "0px";

  return expanded;
}



export const getIcon = (iconName: string) => {
  const icons = {
    dashboard: IconDashboard,
    file: File,
    world: IconWorld,
    database: IconDatabase,
    users: Users,
    settings: IconSettings,
    building: Building2,
  }
  return icons[iconName as keyof typeof icons]
}

export const onRenderCallback = (
  id: string, // Profiler tree'nin "id" prop'u 
  phase: string, // "mount" (ilk render) veya "update" (re-render) 
  actualDuration: number, // Bu update'i render etmek için harcanan süre 
  baseDuration: number, // Optimize olmadan render süresi 
  startTime: number, // React bu update'i render etmeye başladığı zaman 
  commitTime: number, // React bu update'i commit ettiği zaman 
) => {

  console.log(`🔍 Profiler [${id}]:`, { phase, actualDuration: `${actualDuration.toFixed(2)}ms`, baseDuration: `${baseDuration.toFixed(2)}ms`, startTime: `${startTime.toFixed(2)}ms`, commitTime: `${commitTime.toFixed(2)}ms`, }); // Yavaş render'ları yakala 
  if (actualDuration > 16) {
    // 60fps için 16ms limit 
    console.warn(`⚠️ Slow render detected in ${id}: ${actualDuration.toFixed(2)}ms`);
  }
};