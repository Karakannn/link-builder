"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ColorPicker, ColorPickerSelection, ColorPickerHue, ColorPickerAlpha, ColorPickerOutput, ColorPickerFormat } from "@/components/ui/color-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette, Settings } from "lucide-react";
import { useEditorSidebar } from "@/providers/editor/editor-sidebar-provider";

const NeonCardCustomProperties = () => {
  const { handleChangeCustomValues, getCurrentContent, handleColorChange } = useEditorSidebar();

  return (
    <div className="space-y-6">
      
      {/* Neon Colors Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Palette size={16} />
          <span className="font-medium">Neon Colors</span>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="firstColor">Primary Color</Label>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: getCurrentContent().firstColor as string || "#ff00aa" }}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <ColorPicker
                  value={getCurrentContent().firstColor || "#ff00aa"}
                  onChangeComplete={(value) => handleColorChange('firstColor', value)}
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
              id="firstColor" 
              placeholder="#ff00aa" 
              className="flex-1" 
              onChange={handleChangeCustomValues} 
              value={getCurrentContent().firstColor || "#ff00aa"} 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="secondColor">Secondary Color</Label>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: getCurrentContent().secondColor as string || "#00FFF1" }}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <ColorPicker
                  value={getCurrentContent().secondColor || "#00FFF1"}
                  onChangeComplete={(value) => handleColorChange('secondColor', value)}
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
              id="secondColor" 
              placeholder="#00FFF1" 
              className="flex-1" 
              onChange={handleChangeCustomValues} 
              value={getCurrentContent().secondColor || "#00FFF1"} 
            />
          </div>
        </div>
      </div>

      {/* Border Settings Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Settings size={16} />
          <span className="font-medium">Border Settings</span>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="borderSize">Border Size: {getCurrentContent().borderSize || 2}px</Label>
          <Input
            id="borderSize"
            type="number"
            value={getCurrentContent().borderSize || 2}
            onChange={handleChangeCustomValues}
            placeholder="2"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="borderRadius">Border Radius: {getCurrentContent().borderRadius || 20}px</Label>
          <Input
            id="borderRadius"
            type="number"
            value={getCurrentContent().borderRadius || 20}
            onChange={handleChangeCustomValues}
            placeholder="20"
          />
        </div>
      </div>

      <div className="text-sm text-muted-foreground p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
        💡 <strong>Tip:</strong> Drag text, image, and other elements into the neon card to create your content. Each element can be edited individually by clicking on it.
      </div>
    </div>
  );
};

export default NeonCardCustomProperties; 