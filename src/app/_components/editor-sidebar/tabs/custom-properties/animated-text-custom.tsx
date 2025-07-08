import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ColorPicker, ColorPickerSelection, ColorPickerHue, ColorPickerAlpha, ColorPickerOutput, ColorPickerFormat } from '@/components/ui/color-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider';
import React from 'react';

type Props = {}

const AnimatedTextCustomProperties = (props: Props) => {
    const { handleChangeCustomValues, getCurrentContent } = useEditorSidebar();

    const currentContent = getCurrentContent();
    const neonTextColor = currentContent.neonTextColor || "#00ff00";
    const neonBorderColor = currentContent.neonBorderColor || "#00ff00";

    const handleColorPickerChange = (value: any, colorType: 'text' | 'border') => {
        let colorValue: string;
        
        if (Array.isArray(value) && value.length >= 3) {
            const r = Math.round(Number(value[0]) || 0);
            const g = Math.round(Number(value[1]) || 0);
            const b = Math.round(Number(value[2]) || 0);
            const a = Number(value[3]) !== undefined ? Number(value[3]) : 1;
            colorValue = `rgba(${r}, ${g}, ${b}, ${a})`;
        } else if (typeof value === "string" && value.length > 0) {
            colorValue = value;
        } else {
            colorValue = "#00ff00";
        }

        handleChangeCustomValues({
            target: {
                id: colorType === 'text' ? "neonTextColor" : "neonBorderColor",
                value: colorValue,
            },
        } as any);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChangeCustomValues(e);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label htmlFor="innerText">Text Content</Label>
                <Input 
                    id="innerText" 
                    placeholder="Enter animated text content..." 
                    onChange={handleInputChange} 
                    value={currentContent.innerText || ""} 
                />
            </div>
            
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">Neon Text Color</Label>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <div
                                    className="w-4 h-4 rounded"
                                    style={{ backgroundColor: neonTextColor }}
                                />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <ColorPicker
                                value={neonTextColor}
                                onChange={(value) => handleColorPickerChange(value, 'text')}
                                onChangeComplete={(value) => handleColorPickerChange(value, 'text')}
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
                        id="neonTextColor" 
                        placeholder="#00ff00" 
                        onChange={handleInputChange} 
                        value={neonTextColor} 
                    />
                </div>
            </div>
            
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">Neon Border Color</Label>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <div
                                    className="w-4 h-4 rounded"
                                    style={{ backgroundColor: neonBorderColor }}
                                />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <ColorPicker
                                value={neonBorderColor}
                                onChange={(value) => handleColorPickerChange(value, 'border')}
                                onChangeComplete={(value) => handleColorPickerChange(value, 'border')}
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
                        id="neonBorderColor" 
                        placeholder="#00ff00" 
                        onChange={handleInputChange} 
                        value={neonBorderColor} 
                    />
                </div>
            </div>
        </div>
    )
}

export default AnimatedTextCustomProperties 