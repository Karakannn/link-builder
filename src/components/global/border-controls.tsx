// src/components/global/border-controls.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useBorderVisibility } from "@/providers/border-visibility-provider";
import {
    Eye,
    EyeOff,
    Layers,
    Focus,
    RotateCcw,
    Keyboard,
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BorderControlsProps {
    className?: string;
    compact?: boolean;
}

export const BorderControls = ({ className, compact = false }: BorderControlsProps) => {
    const {
        showBorders,
        borderLevel,
        focusMode,
        hoveredElementId,
        toggleBorders,
        setBorderLevel,
        toggleFocusMode,
        resetBorders
    } = useBorderVisibility();

    const levelLabels = ['Minimal', 'Basic', 'Normal', 'All'];
    const currentLevelLabel = levelLabels[borderLevel] || 'All';

    if (compact) {
        return (
            <TooltipProvider delayDuration={300}>
                <div className={cn("flex items-center gap-1", className)}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                variant={showBorders ? "default" : "outline"}
                                onClick={toggleBorders}
                                className="h-8 w-8 p-0"
                            >
                                {showBorders ? <Eye size={14} /> : <EyeOff size={14} />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Toggle borders (Ctrl+B)</p>
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                variant={focusMode ? "default" : "outline"}
                                onClick={toggleFocusMode}
                                className="h-8 w-8 p-0"
                            >
                                <Focus size={14} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Focus mode (Ctrl+F)</p>
                        </TooltipContent>
                    </Tooltip>

                    <Badge variant="outline" className="text-xs px-1 h-6">
                        L{borderLevel}
                    </Badge>
                </div>
            </TooltipProvider>
        );
    }

    return (
        <TooltipProvider delayDuration={300}>
            <div className={cn(
                "flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border",
                className
            )}>
                {/* Border Toggle */}
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                variant={showBorders ? "default" : "outline"}
                                onClick={toggleBorders}
                                className="h-8"
                            >
                                {showBorders ? <Eye size={16} /> : <EyeOff size={16} />}
                                <span className="ml-2">Borders</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Toggle element borders (Ctrl+B)</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                <Separator orientation="vertical" className="h-6" />

                {/* Level Control */}
                <div className="flex items-center gap-3 min-w-[180px]">
                    <div className="flex items-center gap-2">
                        <Layers size={16} className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Level:
                        </span>
                    </div>

                    <div className="flex-1">
                        <Slider
                            value={[borderLevel]}
                            onValueChange={([value]) => setBorderLevel(value)}
                            max={3}
                            min={0}
                            step={1}
                            className="flex-1"
                            disabled={!showBorders}
                        />
                    </div>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Badge
                                variant="outline"
                                className={cn(
                                    "min-w-[60px] text-center cursor-help",
                                    !showBorders && "opacity-50"
                                )}
                            >
                                {currentLevelLabel}
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="space-y-1">
                                <p className="font-medium">Border Levels:</p>
                                <p className="text-xs">Level 0: Only selected elements</p>
                                <p className="text-xs">Level 1: + Direct parents/children</p>
                                <p className="text-xs">Level 2: + 2 levels deep</p>
                                <p className="text-xs">Level 3: All elements</p>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </div>

                <Separator orientation="vertical" className="h-6" />

                {/* Focus Mode */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="sm"
                            variant={focusMode ? "default" : "outline"}
                            onClick={toggleFocusMode}
                            className="h-8"
                            disabled={!showBorders}
                        >
                            <Focus size={16} />
                            <span className="ml-2">Focus</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Focus mode - show only selected and nearby elements (Ctrl+F)</p>
                    </TooltipContent>
                </Tooltip>

                {/* Reset */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={resetBorders}
                            className="h-8"
                        >
                            <RotateCcw size={16} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Reset to defaults</p>
                    </TooltipContent>
                </Tooltip>

                {/* Keyboard shortcuts info */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-gray-500"
                        >
                            <Keyboard size={16} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="space-y-1">
                            <p className="font-medium">Keyboard Shortcuts:</p>
                            <p className="text-xs">Ctrl+B: Toggle borders</p>
                            <p className="text-xs">Ctrl+F: Toggle focus mode</p>
                            <p className="text-xs">Ctrl+1-4: Set border level</p>
                            <p className="text-xs">Esc: Clear hover</p>
                        </div>
                    </TooltipContent>
                </Tooltip>

                {/* Status indicator */}
                {hoveredElementId && (
                    <Badge variant="secondary" className="text-xs">
                        Hovering: {hoveredElementId.slice(0, 8)}...
                    </Badge>
                )}
            </div>
        </TooltipProvider>
    );
};

// Compact version for toolbar
export const CompactBorderControls = ({ className }: { className?: string }) => {
    return <BorderControls className={className} compact />;
};