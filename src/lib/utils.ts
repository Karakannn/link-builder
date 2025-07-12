import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DeviceTypes, EditorElement } from "@/providers/editor/editor-provider";
import { Building2, Users, File } from "lucide-react";
import { IconDashboard, IconSettings, IconDatabase, IconWorld } from "@tabler/icons-react";
import { v4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Parses custom CSS string and converts it to CSS properties object
 * @param customCSS Custom CSS string
 * @returns CSS properties object
 */
function parseCustomCSS(customCSS: string): any {
    if (!customCSS || typeof customCSS !== "string") {
        return {};
    }

    const cssProperties: any = {};

    // CSS string'ini parse et - tüm property'leri kabul et
    const cssRules = customCSS
        .split(";")
        .map((rule) => rule.trim())
        .filter((rule) => rule && !rule.startsWith("/*") && !rule.startsWith("//")); // Sadece yorumları filtrele

    cssRules.forEach((rule) => {
        const colonIndex = rule.indexOf(":");
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
        ...responsiveOverrides,
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
    if (device === "Desktop" || !baseContent || typeof baseContent !== "object" || !("responsiveContent" in baseContent) || !baseContent.responsiveContent) {
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
        ...responsiveContentOverrides,
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
    if (expanded.padding && !expanded.paddingTop && !expanded.paddingRight && !expanded.paddingBottom && !expanded.paddingLeft) {
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
    if (expanded.margin && !expanded.marginTop && !expanded.marginRight && !expanded.marginBottom && !expanded.marginLeft) {
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
    };
    return icons[iconName as keyof typeof icons];
};

export const onRenderCallback = (
    id: string, // Profiler tree'nin "id" prop'u
    phase: string, // "mount" (ilk render) veya "update" (re-render)
    actualDuration: number, // Bu update'i render etmek için harcanan süre
    baseDuration: number, // Optimize olmadan render süresi
    startTime: number, // React bu update'i render etmeye başladığı zaman
    commitTime: number // React bu update'i commit ettiği zaman
) => {
    console.log(`🔍 Profiler [${id}]:`, {
        phase,
        actualDuration: `${actualDuration.toFixed(2)}ms`,
        baseDuration: `${baseDuration.toFixed(2)}ms`,
        startTime: `${startTime.toFixed(2)}ms`,
        commitTime: `${commitTime.toFixed(2)}ms`,
    }); // Yavaş render'ları yakala
    if (actualDuration > 16) {
        // 60fps için 16ms limit
        console.warn(`⚠️ Slow render detected in ${id}: ${actualDuration.toFixed(2)}ms`);
    }
};

export const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
        return "Az önce";
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} dakika önce`;
    } else if (diffInMinutes < 1440) {
        // 24 hours
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours} saat önce`;
    } else {
        const days = Math.floor(diffInMinutes / 1440);
        return `${days} gün önce`;
    }
};


export function parsePageContent(content: any): EditorElement[] {
    try {
        if (Array.isArray(content)) {
            return content as EditorElement[];
        }
        if (typeof content === 'string') {
            return JSON.parse(content) as EditorElement[];
        }
        return [];
    } catch (error) {
        console.error("Error parsing page content:", error);
        return [];
    }
}


export const createSafePageTemplate = (title: string) => {
    return [
        {
            id: v4(), // ✅ v4 kullan
            name: "Container",
            type: "container" as const,
            layout: "vertical" as const,
            styles: {
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "center" as const,
                justifyContent: "center" as const,
                padding: "2rem",
                minHeight: "50vh",
                width: "100%",
                height: "auto",
                margin: "0px",
                border: "none",
                backgroundColor: "transparent",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                textAlign: "left" as const,
                opacity: "100%",
                position: "relative" as const
            },
            content: [
                {
                    id: v4(), // ✅ v4 kullan
                    name: "Welcome Text",
                    type: "text" as const,
                    styles: {
                        fontSize: "24px",
                        fontWeight: "bold",
                        textAlign: "center" as const,
                        color: "#333333",
                        margin: "0px",
                        padding: "0px",
                        lineHeight: "1.5",
                        fontFamily: "inherit",
                        border: "none",
                        backgroundColor: "transparent",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        opacity: "100%",
                        position: "relative" as const,
                        width: "100%",
                        height: "auto"
                    },
                    content: {
                        innerText: `Hoş geldiniz! Bu sayfa "${title}" başlıklı yeni sayfanızdır.`
                    }
                }
            ]
        }
    ];
};

export const createSafeOverlayTemplate = (name: string) => {
    return [
        {
            id: v4(),
            name: "Overlay Container",
            type: "container" as const,
            layout: "vertical" as const,
            styles: {
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "center" as const,
                justifyContent: "center" as const,
                padding: "40px",
                width: "500px",
                height: "300px",
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                margin: "0px",
                border: "none",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                textAlign: "left" as const,
                opacity: "100%",
                position: "relative" as const
            },
            content: [
                {
                    id: v4(),
                    name: "Overlay Title",
                    type: "text" as const,
                    styles: {
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#667eea",
                        marginBottom: "20px",
                        textAlign: "center" as const,
                        margin: "0px",
                        padding: "0px",
                        lineHeight: "1.5",
                        fontFamily: "inherit",
                        border: "none",
                        backgroundColor: "transparent",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        opacity: "100%",
                        position: "relative" as const,
                        width: "100%",
                        height: "auto"
                    },
                    content: {
                        innerText: name
                    }
                },
                {
                    id: v4(),
                    name: "Overlay Content",
                    type: "text" as const,
                    styles: {
                        fontSize: "16px",
                        color: "#666",
                        lineHeight: "1.6",
                        textAlign: "center" as const,
                        marginBottom: "20px",
                        margin: "0px",
                        padding: "0px",
                        fontFamily: "inherit",
                        border: "none",
                        backgroundColor: "transparent",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        opacity: "100%",
                        position: "relative" as const,
                        width: "100%",
                        height: "auto"
                    },
                    content: {
                        innerText: "Overlay içeriğini düzenlemek için editörde değişiklik yapın."
                    }
                },
                {
                    id: v4(),
                    name: "Overlay Button",
                    type: "link" as const,
                    styles: {
                        padding: "12px 24px",
                        fontSize: "16px",
                        backgroundColor: "#667eea",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "500",
                        textAlign: "center" as const,
                        textDecoration: "none",
                        margin: "0px",
                        fontFamily: "inherit",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        opacity: "100%",
                        position: "relative" as const,
                        width: "auto",
                        height: "auto"
                    },
                    content: {
                        href: "#",
                        innerText: "Tamam"
                    }
                }
            ]
        }
    ];
};

export const createSafeLiveStreamCardTemplate = (name: string) => {
    return [
        {
            id: v4(),
            name: "Stream Card Container",
            type: "container" as const,
            layout: "vertical" as const,
            styles: {
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 0 10px 0 rgba(239, 68, 68, 0.2)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                display: "flex",
                flexDirection: "column" as const,
                alignItems: "center" as const,
                justifyContent: "center" as const,
                margin: "0px",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                textAlign: "left" as const,
                opacity: "100%",
                position: "relative" as const,
                width: "100%",
                height: "auto"
            },
            content: [
                {
                    id: v4(),
                    name: "Stream Card Title",
                    type: "text" as const,
                    styles: {
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#EF4444",
                        marginBottom: "20px",
                        textAlign: "center" as const,
                        margin: "0px",
                        padding: "0px",
                        lineHeight: "1.5",
                        fontFamily: "inherit",
                        border: "none",
                        backgroundColor: "transparent",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        opacity: "100%",
                        position: "relative" as const,
                        width: "100%",
                        height: "auto"
                    },
                    content: {
                        innerText: name
                    }
                },
                {
                    id: v4(),
                    name: "Stream Card Description",
                    type: "text" as const,
                    styles: {
                        fontSize: "16px",
                        color: "#FFFFFF",
                        marginBottom: "20px",
                        textAlign: "center" as const,
                        margin: "0px",
                        padding: "0px",
                        lineHeight: "1.5",
                        fontFamily: "inherit",
                        border: "none",
                        backgroundColor: "transparent",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        opacity: "100%",
                        position: "relative" as const,
                        width: "100%",
                        height: "auto"
                    },
                    content: {
                        innerText: "🔴 Canlı Yayın Başladı!"
                    }
                }
            ]
        }
    ];
};