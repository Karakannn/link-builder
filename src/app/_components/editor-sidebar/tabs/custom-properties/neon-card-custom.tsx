"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ColorPicker, ColorPickerSelection, ColorPickerHue, ColorPickerAlpha, ColorPickerOutput, ColorPickerFormat } from "@/components/ui/color-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette, Settings, Clock } from "lucide-react";
import { useEditorSidebar } from "@/providers/editor/editor-sidebar-provider";

const presetColors = [
  "#ff00aa", // Pink
  "#00FFF1", // Cyan
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#FECA57", // Yellow
  "#FF9FF3", // Light Pink
  "#54A0FF", // Light Blue
  "#5F27CD", // Purple
];

const SponsorNeonCardCustomProperties = () => {
  const { handleChangeCustomValues, getCurrentContent, handleColorChange } = useEditorSidebar();

  // Get current content and extract custom properties
  const currentContent = getCurrentContent();
  const customProps = currentContent?.customProperties || {};

  // Default values with fallbacks
  const borderSize = customProps.borderSize || 2;
  const borderRadius = customProps.borderRadius || 12;
  const neonColor = customProps.neonColor || "#ff00aa";
  const animationDelay = customProps.animationDelay || 0;

  const handleSliderChange = (property: string, value: number[]) => {
    handleChangeCustomValues({
      target: {
        id: `customProperties.${property}`,
        value: value[0],
      },
    } as any);
  };

  const handleColorPickerChange = (color: any) => {
    let hexColor = "#ff00aa"; // Default color
    
    if (Array.isArray(color) && color.length >= 3) {
      // Convert RGBA array to hex
      const r = Math.round(color[0]);
      const g = Math.round(color[1]);
      const b = Math.round(color[2]);
      hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    } else if (typeof color === 'string') {
      hexColor = color;
    }
    
    handleChangeCustomValues({
      target: {
        id: "customProperties.neonColor",
        value: hexColor,
      },
    } as any);
  };

  return (
    <div className="space-y-6">

      {/* Neon Color Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Palette size={16} />
          <span className="font-medium">Neon Color</span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="neonColor">Neon Color</Label>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: neonColor }}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <ColorPicker
                  value={neonColor}
                  onChangeComplete={(value) => handleColorPickerChange(value)}
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
              id="neonColor"
              placeholder="#ff00aa"
              className="flex-1"
              onChange={handleChangeCustomValues}
              value={neonColor}
            />
          </div>

          {/* Preset Color Options */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Preset Colors</Label>
            <div className="grid grid-cols-5 gap-2">
              {presetColors.map((color, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={`h-8 w-8 p-0 rounded-full border-2 ${neonColor === color ? 'border-primary border-2' : 'border-gray-300'
                    }`}
                  onClick={() => handleColorPickerChange(color)}
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {neonColor === color && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Border Settings Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Settings size={16} />
          <span className="font-medium">Border Settings</span>
        </div>

        {/* Border Size with Slider */}
        <div className="space-y-2">
          <Label className="text-muted-foreground">
            Border Size: {borderSize}px
          </Label>
          <Slider
            value={[borderSize]}
            onValueChange={(value) => handleSliderChange("borderSize", value)}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <Input
            id="borderSize"
            type="number"
            min="1"
            max="10"
            value={borderSize}
            onChange={handleChangeCustomValues}
            placeholder="2"
            className="text-xs"
          />
        </div>

        {/* Border Radius with Slider */}
        <div className="space-y-2">
          <Label className="text-muted-foreground">
            Border Radius: {borderRadius}px
          </Label>
          <Slider
            value={[borderRadius]}
            onValueChange={(value) => handleSliderChange("borderRadius", value)}
            max={50}
            min={0}
            step={1}
            className="w-full"
          />
          <Input
            id="borderRadius"
            type="number"
            min="0"
            max="50"
            value={borderRadius}
            onChange={handleChangeCustomValues}
            placeholder="12"
            className="text-xs"
          />
        </div>
      </div>

      {/* Animation Settings Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Clock size={16} />
          <span className="font-medium">Animation Settings</span>
        </div>

        {/* Animation Delay with Slider */}
        <div className="space-y-2">
          <Label className="text-muted-foreground">
            Animation Delay: {animationDelay}s
          </Label>
          <Slider
            value={[animationDelay]}
            onValueChange={(value) => handleSliderChange("animationDelay", value)}
            max={5}
            min={0}
            step={0.1}
            className="w-full"
          />
          <Input
            id="animationDelay"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={animationDelay}
            onChange={handleChangeCustomValues}
            placeholder="0"
            className="text-xs"
          />
        </div>
      </div>

      {/* Quick Settings Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Settings size={16} />
          <span className="font-medium">Quick Settings</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">Border Size</Label>
            <Input
              id="borderSize"
              value={borderSize}
              onChange={handleChangeCustomValues}
              type="number"
              min="1"
              max="10"
              className="text-xs"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Border Radius</Label>
            <Input
              id="borderRadius"
              value={borderRadius}
              onChange={handleChangeCustomValues}
              type="number"
              min="0"
              max="50"
              className="text-xs"
            />
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
        💡 <strong>Tip:</strong> Drag logo, text, and other elements into the sponsor card to create your sponsor content. Perfect for displaying sponsor logos with animated neon borders.
      </div>
    </div>
  );
};

export default SponsorNeonCardCustomProperties;