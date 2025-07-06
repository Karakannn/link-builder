import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ColorPicker, ColorPickerSelection, ColorPickerHue, ColorPickerAlpha, ColorPickerOutput, ColorPickerFormat } from '@/components/ui/color-picker'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider';
import React from 'react'

type Props = {}

const PulsatingButtonCustomProperties = (props: Props) => {

    const { handleChangeCustomValues, getCurrentContent } = useEditorSidebar();

    const currentContent = getCurrentContent();
    console.log("🔧 PulsatingButton Custom Properties - Current Content:", currentContent);
    
    const pulseColor = currentContent.pulseColor || "#808080";
    console.log("🔧 PulsatingButton - Pulse Color:", pulseColor);

    const handleColorPickerChange = (value: any) => {
        console.log("🔧 PulsatingButton - Color Picker Change:", value);
        
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
            colorValue = "#808080";
        }

        console.log("🔧 PulsatingButton - Final Color Value:", colorValue);

        handleChangeCustomValues({
            target: {
                id: "pulseColor",
                value: colorValue,
            },
        } as any);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("🔧 PulsatingButton - Input Change:", e.target.id, "=", e.target.value);
        handleChangeCustomValues(e);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">Button Text</Label>
                <Input 
                    id="innerText" 
                    placeholder="Click me" 
                    onChange={handleInputChange} 
                    value={currentContent.innerText || ""} 
                />
            </div>
            
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">Link URL</Label>
                <Input 
                    id="href" 
                    placeholder="https://example.com" 
                    onChange={handleInputChange} 
                    value={currentContent.href || ""} 
                />
            </div>
            
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">Pulse Color</Label>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <div
                                    className="w-4 h-4 rounded"
                                    style={{ backgroundColor: pulseColor }}
                                />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <ColorPicker
                                value={pulseColor}
                                onChange={handleColorPickerChange}
                                onChangeComplete={handleColorPickerChange}
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
                        id="pulseColor" 
                        placeholder="#808080" 
                        onChange={handleInputChange} 
                        value={pulseColor} 
                    />
                </div>
            </div>
            
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">Animation Duration</Label>
                <Input 
                    id="duration" 
                    placeholder="1.5s" 
                    onChange={handleInputChange} 
                    value={currentContent.duration || "1.5s"} 
                />
            </div>
        </div>
    )
}

export default PulsatingButtonCustomProperties 