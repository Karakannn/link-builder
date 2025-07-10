"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColorPicker, ColorPickerSelection, ColorPickerHue, ColorPickerAlpha, ColorPickerOutput, ColorPickerFormat } from "@/components/ui/color-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEditorSidebar } from "@/providers/editor/editor-sidebar-provider";
import { Sparkles, Type, Palette } from "lucide-react";

type Props = {};

const ContainerCustomProperties = (props: Props) => {
  const { handleOnChanges, getCurrentStyles } = useEditorSidebar();

  // Get current styles
  const currentStyles = getCurrentStyles();
  const currentCustomClass = (currentStyles as any).customClass || "";
  
  // Get current animation colors
  const currentAnimationColors = (currentStyles as any).animationColors || {};

  // Pre-defined background animation classes from globals.css
  const predefinedClasses = [
    { value: "", label: "None" },
    { value: "bg-animated-grid", label: "Animated Grid" },
    { value: "bg-dot-pattern", label: "Dot Pattern" },
    { value: "bg-gradient-waves", label: "Gradient Waves" },
    { value: "bg-twinkling-stars", label: "Twinkling Stars" },
    { value: "bg-pulsing-orbs", label: "Pulsing Orbs" },
  ];

  // Define which animations support color customization and their default colors
  const animationColorConfigs = {
    "bg-gradient-waves": {
      colors: [
        { key: "color1", label: "Color 1", default: "#ee7752" },
        { key: "color2", label: "Color 2", default: "#e73c7e" },
        { key: "color3", label: "Color 3", default: "#23a6d5" },
        { key: "color4", label: "Color 4", default: "#23d5ab" },
      ]
    },
    "bg-pulsing-orbs": {
      colors: [
        { key: "color1", label: "Orb 1", default: "#ff0096" },
        { key: "color2", label: "Orb 2", default: "#0096ff" },
      ]
    },
    "bg-twinkling-stars": {
      colors: [
        { key: "color1", label: "Background", default: "#0c0c2a" },
        { key: "color2", label: "Stars", default: "#ffffff" },
      ]
    },
    "bg-dot-pattern": {
      colors: [
        { key: "color1", label: "Dot Color", default: "#9ca3af" },
      ]
    },
    "bg-animated-grid": {
      colors: [
        { key: "color1", label: "Grid Color", default: "#9ca3af" },
      ]
    },
  };

  // Check if current animation supports color customization
  const currentColorConfig = animationColorConfigs[currentCustomClass as keyof typeof animationColorConfigs];

  const handleClassChange = (value: string) => {
    handleOnChanges({
      target: {
        id: "customClass",
        value: value,
      },
    } as any);
  };

  const handleColorChange = (colorKey: string, color: string) => {
    const updatedColors = {
      ...currentAnimationColors,
      [currentCustomClass]: {
        ...currentAnimationColors[currentCustomClass],
        [colorKey]: color,
      }
    };
    
    handleOnChanges({
      target: {
        id: "animationColors",
        value: updatedColors,
      },
    } as any);
  };

  const handleColorPickerChange = (colorKey: string, value: any) => {
    let colorValue: string;
    
    if (Array.isArray(value) && value.length >= 3) {
      const r = Math.round(Number(value[0]) || 0);
      const g = Math.round(Number(value[1]) || 0);
      const b = Math.round(Number(value[2]) || 0);
      const a = Number(value[3]) !== undefined ? Number(value[3]) : 1;
      colorValue = a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    } else if (typeof value === "string" && value.length > 0) {
      colorValue = value;
    } else {
      colorValue = "#000000";
    }

    handleColorChange(colorKey, colorValue);
  };

  return (
    <div className="space-y-6">
      {/* Custom CSS Class Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Type size={16} />
          <span className="font-medium">Animation & Style Classes</span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customClass">Animation & Style Classes</Label>
          <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
            {predefinedClasses.map((classOption) => (
              <Button
                key={classOption.value}
                variant={currentCustomClass === classOption.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleClassChange(classOption.value)}
                className="text-xs"
              >
                {classOption.label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Select a pre-defined class for the container
          </p>
        </div>

        {/* Current Selection Display */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="text-xs text-muted-foreground">Currently Selected:</div>
          <div className="font-medium text-sm">
            {predefinedClasses.find(c => c.value === currentCustomClass)?.label || "None"}
          </div>
          {currentCustomClass && (
            <div className="font-mono text-xs text-muted-foreground mt-1">
              Class: {currentCustomClass}
            </div>
          )}
        </div>
      </div>

      {/* Color Customization Section - only show if animation supports colors */}
      {currentColorConfig && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Palette size={16} />
            <span className="font-medium">Animation Colors</span>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">
              Customize colors for {predefinedClasses.find(c => c.value === currentCustomClass)?.label}
            </Label>
            
            <div className="grid grid-cols-1 gap-3">
              {currentColorConfig.colors.map((colorConfig) => {
                const currentColor = currentAnimationColors[currentCustomClass]?.[colorConfig.key] || colorConfig.default;
                
                return (
                  <div key={colorConfig.key} className="space-y-2">
                    <Label className="text-sm font-medium">{colorConfig.label}</Label>
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: currentColor }}
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <ColorPicker
                            value={currentColor}
                            onChange={(value) => handleColorPickerChange(colorConfig.key, value)}
                            onChangeComplete={(value) => handleColorPickerChange(colorConfig.key, value)}
                          >
                            <ColorPickerSelection className="h-32" />
                            <div className="flex flex-col gap-2 mt-4">
                              <ColorPickerHue />
                              <ColorPickerAlpha />
                              <div className="flex items-center gap-2">
                                <ColorPickerOutput />
                                <ColorPickerFormat />
                              </div>
                            </div>
                          </ColorPicker>
                        </PopoverContent>
                      </Popover>
                      <Input
                        value={currentColor}
                        onChange={(e) => handleColorChange(colorConfig.key, e.target.value)}
                        className="flex-1 font-mono"
                        placeholder={colorConfig.default}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reset to defaults button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const resetColors: Record<string, string> = {};
                currentColorConfig.colors.forEach(colorConfig => {
                  resetColors[colorConfig.key] = colorConfig.default;
                });
                
                const updatedColors = {
                  ...currentAnimationColors,
                  [currentCustomClass]: resetColors,
                };
                
                handleOnChanges({
                  target: {
                    id: "animationColors",
                    value: updatedColors,
                  },
                } as any);
              }}
              className="w-full text-xs"
            >
              Reset to Default Colors
            </Button>
          </div>
        </div>
      )}

      <div className="text-sm text-muted-foreground p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
        <div className="flex items-start gap-2">
          <Sparkles size={16} className="mt-0.5 text-primary" />
          <div>
            <strong>Tips:</strong>
            <ul className="mt-1 text-xs space-y-1">
              <li>• Select from pre-defined animation and style classes</li>
              <li>• Customize colors for supported animations (Gradient Waves, Pulsing Orbs, Twinkling Stars, Dot Pattern, Animated Grid)</li>
              <li>• Use color picker or enter hex codes manually</li>
              <li>• Click "Reset to Default Colors" to restore original colors</li>
              <li>• Changes apply immediately to the container</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContainerCustomProperties; 