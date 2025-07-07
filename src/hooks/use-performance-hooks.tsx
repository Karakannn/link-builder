"use client"

import { usePerformanceContext } from "@/providers/performance/performance-provider";
import { useEffect, useRef, useLayoutEffect, useCallback } from "react";


export const usePerformance = (componentName?: string) => {
    const { trackRender, isEnabled } = usePerformanceContext();
    const renderCount = useRef(0);
    const lastTrackedRender = useRef(0);

    // Component adını otomatik detect et
    const autoComponentName = useRef<string>(null);
    if (!autoComponentName.current && !componentName) {
        const stack = new Error().stack;
        const match = stack?.match(/at (\w+)/g);
        autoComponentName.current = match?.[1]?.replace("at ", "") || "UnknownComponent";
    }

    const finalComponentName = componentName || autoComponentName.current || "UnknownComponent";

    // Render sayısını artır (her render'da)
    renderCount.current++;

    // Sadece render count değiştiğinde track et (debounce için)
    useLayoutEffect(() => {
        if (isEnabled && renderCount.current !== lastTrackedRender.current) {
            lastTrackedRender.current = renderCount.current;
            trackRender(finalComponentName);
        }
    }, [trackRender, finalComponentName, isEnabled]);

    return {
        renderCount: renderCount.current,
        componentName: finalComponentName,
    };
};

/**
 * Global performance metrics'lerini almak için kullanılır
 */
export const usePerformanceMonitor = () => {
    const { metrics, resetMetrics, isEnabled, toggleEnabled } = usePerformanceContext();

    return {
        ...metrics,
        resetMetrics,
        isEnabled,
        toggleEnabled,
        // Utility functions
        getTopComponents: (limit = 5) => {
            return Object.values(metrics.components)
                .sort((a, b) => b.renderCount - a.renderCount)
                .slice(0, limit);
        },
        getTotalComponents: () => Object.keys(metrics.components).length,
        getAverageRenderPerComponent: () => {
            const totalComponents = Object.keys(metrics.components).length;
            return totalComponents > 0 ? Math.round(metrics.totalRenders / totalComponents) : 0;
        },
    };
};

/**
 * Sadece development mode'da performance tracking'i aktif eder
 */
export const useDevPerformance = (componentName?: string) => {
    const isDev = process.env.NODE_ENV === "development";
    const performance = usePerformance(componentName);

    return isDev ? performance : { renderCount: 0, componentName: "disabled" };
};
