"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo, ReactNode } from "react";

interface ComponentStats {
    name: string;
    renderCount: number;
    lastRenderTime: number;
}

interface PerformanceMetrics {
    fps: number;
    memory: {
        used: number;
        total: number;
        percentage: number;
    };
    totalRenders: number;
    components: Record<string, ComponentStats>;
}

interface PerformanceContextType {
    metrics: PerformanceMetrics;
    trackRender: (componentName: string) => void;
    resetMetrics: () => void;
    isEnabled: boolean;
    toggleEnabled: () => void;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

const initialMetrics: PerformanceMetrics = {
    fps: 0,
    memory: { used: 0, total: 0, percentage: 0 },
    totalRenders: 0,
    components: {},
};

interface PerformanceProviderProps {
    children: ReactNode;
    enabled?: boolean;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({ children, enabled = true }) => {
    const [metrics, setMetrics] = useState<PerformanceMetrics>(initialMetrics);
    const [isEnabled, setIsEnabled] = useState(enabled);
    const frameCount = useRef(0);
    const lastTime = useRef(performance.now());
    const animationId = useRef<number>(null);

    // FPS Tracking
    useEffect(() => {
        if (!isEnabled) return;

        const updateFPS = () => {
            frameCount.current++;
            const currentTime = performance.now();
            const deltaTime = currentTime - lastTime.current;

            if (deltaTime >= 1000) {
                const fps = Math.round((frameCount.current * 1000) / deltaTime);

                setMetrics((prev) => ({
                    ...prev,
                    fps,
                }));

                frameCount.current = 0;
                lastTime.current = currentTime;
            }

            animationId.current = requestAnimationFrame(updateFPS);
        };

        animationId.current = requestAnimationFrame(updateFPS);

        return () => {
            if (animationId.current) {
                cancelAnimationFrame(animationId.current);
            }
        };
    }, [isEnabled]);

    // Memory Tracking
    useEffect(() => {
        if (!isEnabled) return;

        const updateMemory = () => {
            // @ts-ignore - performance.memory sadece Chrome'da mevcut
            if (performance.memory) {
                // @ts-ignore
                const { usedJSHeapSize, totalJSHeapSize } = performance.memory;
                const used = Math.round(usedJSHeapSize / 1024 / 1024); // MB
                const total = Math.round(totalJSHeapSize / 1024 / 1024); // MB
                const percentage = Math.round((used / total) * 100);

                setMetrics((prev) => ({
                    ...prev,
                    memory: { used, total, percentage },
                }));
            }
        };

        updateMemory();
        const interval = setInterval(updateMemory, 2000); // Her 2 saniyede bir güncelle

        return () => clearInterval(interval);
    }, [isEnabled]);

    const trackRender = useCallback(
        (componentName: string) => {
            if (!isEnabled) return;

            setMetrics((prev) => {
                const now = performance.now();
                const componentStats = prev.components[componentName] || {
                    name: componentName,
                    renderCount: 0,
                    lastRenderTime: now,
                };

                return {
                    ...prev,
                    totalRenders: prev.totalRenders + 1,
                    components: {
                        ...prev.components,
                        [componentName]: {
                            ...componentStats,
                            renderCount: componentStats.renderCount + 1,
                            lastRenderTime: now,
                        },
                    },
                };
            });
        },
        [isEnabled]
    );

    const resetMetrics = useCallback(() => {
        setMetrics(initialMetrics);
        frameCount.current = 0;
        lastTime.current = performance.now();
    }, []);

    const toggleEnabled = useCallback(() => {
        setIsEnabled((prev) => !prev);
    }, []);

    const value: PerformanceContextType = useMemo(
        () => ({
            metrics,
            trackRender,
            resetMetrics,
            isEnabled,
            toggleEnabled,
        }),
        [metrics, trackRender, resetMetrics, isEnabled, toggleEnabled]
    );

    return <PerformanceContext.Provider value={value}>{children}</PerformanceContext.Provider>;
};

export const usePerformanceContext = () => {
    const context = useContext(PerformanceContext);
    if (!context) {
        throw new Error("usePerformanceContext must be used within a PerformanceProvider");
    }
    return context;
};
