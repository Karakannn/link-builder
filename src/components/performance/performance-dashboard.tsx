"use client"

import { usePerformanceMonitor } from "@/hooks/use-performance-hooks";
import React, { useState } from "react";

interface PerformancePanelProps {
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    minimized?: boolean;
}

export const PerformancePanel: React.FC<PerformancePanelProps> = ({ position = "top-right", minimized: initialMinimized = false }) => {
    const [minimized, setMinimized] = useState(initialMinimized);
    const { fps, memory, totalRenders, getTopComponents, getTotalComponents, getAverageRenderPerComponent, resetMetrics, isEnabled, toggleEnabled } =
        usePerformanceMonitor();

    const topComponents = getTopComponents(3);

    const getPositionClasses = () => {
        switch (position) {
            case "top-left":
                return "top-4 left-4";
            case "top-right":
                return "top-4 right-4";
            case "bottom-left":
                return "bottom-4 left-4";
            case "bottom-right":
                return "bottom-4 right-4";
            default:
                return "top-4 right-4";
        }
    };

    const getFPSColor = () => {
        if (fps >= 55) return "text-green-500";
        if (fps >= 30) return "text-yellow-500";
        return "text-red-500";
    };

    const getMemoryColor = () => {
        if (memory.percentage <= 50) return "text-green-500";
        if (memory.percentage <= 80) return "text-yellow-500";
        return "text-red-500";
    };

    if (!isEnabled) {
        return (
            <div className={`fixed ${getPositionClasses()} z-[9999]`}>
                <button onClick={toggleEnabled} className="bg-gray-800 text-white px-3 py-1 rounded text-xs hover:bg-gray-700">
                    Enable Performance
                </button>
            </div>
        );
    }

    return (
        <div className={`fixed ${getPositionClasses()} z-[9999] bg-black/90 text-white rounded-lg shadow-lg font-mono text-xs backdrop-blur-sm`}>
            <div className="flex items-center justify-between p-2 bg-gray-800 rounded-t-lg">
                <span className="font-semibold">Performance</span>
                <div className="flex items-center gap-1">
                    <button onClick={() => setMinimized(!minimized)} className="hover:bg-gray-700 px-1 rounded">
                        {minimized ? "▲" : "▼"}
                    </button>
                    <button onClick={resetMetrics} className="hover:bg-gray-700 px-1 rounded" title="Reset Metrics">
                        ↻
                    </button>
                    <button onClick={toggleEnabled} className="hover:bg-gray-700 px-1 rounded text-red-400" title="Disable">
                        ✕
                    </button>
                </div>
            </div>

            {!minimized && (
                <div className="p-3 space-y-2 min-w-[200px]">
                    {/* FPS */}
                    <div className="flex justify-between">
                        <span>FPS:</span>
                        <span className={`font-bold ${getFPSColor()}`}>{fps}</span>
                    </div>

                    {/* Memory */}
                    {memory.total > 0 && (
                        <div className="flex justify-between">
                            <span>Memory:</span>
                            <span className={getMemoryColor()}>
                                {memory.used}MB ({memory.percentage}%)
                            </span>
                        </div>
                    )}

                    {/* Total Renders */}
                    <div className="flex justify-between">
                        <span>Total Renders:</span>
                        <span className="text-blue-400 font-bold">{totalRenders}</span>
                    </div>

                    {/* Component Stats */}
                    <div className="flex justify-between">
                        <span>Components:</span>
                        <span>{getTotalComponents()}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Avg/Component:</span>
                        <span>{getAverageRenderPerComponent()}</span>
                    </div>

                    {/* Top Components */}
                    {topComponents.length > 0 && (
                        <div className="border-t border-gray-600 pt-2 mt-2">
                            <div className="text-gray-300 mb-1">Top Components:</div>
                            {topComponents.map((component, index) => (
                                <div key={component.name} className="flex justify-between text-xs">
                                    <span className="truncate max-w-[120px]" title={component.name}>
                                        {index + 1}. {component.name}
                                    </span>
                                    <span className="text-orange-400">{component.renderCount}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Performance Indicators */}
                    <div className="border-t border-gray-600 pt-2 mt-2">
                        <div className="flex items-center gap-2 text-xs">
                            <div className={`w-2 h-2 rounded-full ${fps >= 55 ? "bg-green-500" : fps >= 30 ? "bg-yellow-500" : "bg-red-500"}`} />
                            <span>{fps >= 55 ? "Excellent" : fps >= 30 ? "Good" : "Poor"} Performance</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
