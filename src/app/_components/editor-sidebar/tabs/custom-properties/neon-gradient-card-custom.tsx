import { Button } from '@/components/ui/button';
import { ColorPicker, ColorPickerSelection, ColorPickerHue, ColorPickerAlpha, ColorPickerOutput, ColorPickerFormat } from '@/components/ui/color-picker';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider';
import React from 'react'

type Props = {}

const NeonGradientCardCustomProperties = (props: Props) => {

    const { handleChangeCustomValues, getCurrentContent, handleColorChange } = useEditorSidebar();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Button Text</p>
                <Input id="innerText" placeholder="Button Text" onChange={handleChangeCustomValues} value={getCurrentContent().innerText} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">First Color</p>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <div
                                    className="w-4 h-4 rounded"
                                    style={{ backgroundColor: getCurrentContent().firstColor as string }}
                                />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <ColorPicker
                                value={getCurrentContent().firstColor}
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
                    <Input id="firstColor" placeholder="#ff00aa" className="flex-1" onChange={handleChangeCustomValues} value={getCurrentContent().firstColor} />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Second Color</p>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <div
                                    className="w-4 h-4 rounded"
                                    style={{ backgroundColor: getCurrentContent().secondColor as string }}
                                />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <ColorPicker
                                value={getCurrentContent().secondColor}
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
                    <Input id="secondColor" placeholder="#00FFF1" className="flex-1" onChange={handleChangeCustomValues} value={getCurrentContent().secondColor} />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Border Size</p>
                <Input id="borderSize" type="number" placeholder="2" onChange={handleChangeCustomValues} value={getCurrentContent().borderSize} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Border Radius</p>
                <Input id="borderRadius" type="number" placeholder="20" onChange={handleChangeCustomValues} value={getCurrentContent().borderRadius} />
            </div>
        </div>
    )
}

export default NeonGradientCardCustomProperties