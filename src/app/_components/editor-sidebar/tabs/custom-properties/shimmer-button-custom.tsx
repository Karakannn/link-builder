import { Button } from '@/components/ui/button';
import { ColorPicker, ColorPickerSelection, ColorPickerHue, ColorPickerAlpha, ColorPickerOutput, ColorPickerFormat } from '@/components/ui/color-picker';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider';
import React from 'react'

type Props = {}

const ShimmerButtonCustomProperties = (props: Props) => {

    const { handleChangeCustomValues, getCurrentContent, handleColorChange } = useEditorSidebar();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Button Text</p>
                <Input id="innerText" placeholder="Button Text" onChange={handleChangeCustomValues} value={getCurrentContent().innerText} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Shimmer Color</p>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <div
                                    className="w-4 h-4 rounded"
                                    style={{ backgroundColor: getCurrentContent().shimmerColor as string }}
                                />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <ColorPicker
                                value={getCurrentContent().shimmerColor || "#ffffff"}
                                onChangeComplete={(value) => handleColorChange('shimmerColor', value)}
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
                    <Input id="shimmerColor" placeholder="#ffffff" className="flex-1" onChange={handleChangeCustomValues} value={getCurrentContent().shimmerColor} />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Shimmer Size</p>
                <Input id="shimmerSize" placeholder="0.05em" onChange={handleChangeCustomValues} value={getCurrentContent().shimmerSize} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Shimmer Duration</p>
                <Input id="shimmerDuration" placeholder="3s" onChange={handleChangeCustomValues} value={getCurrentContent().shimmerDuration} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Border Radius</p>
                <Input id="borderRadius" placeholder="100px" onChange={handleChangeCustomValues} value={getCurrentContent().borderRadius} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Background Color</p>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <div
                                    className="w-4 h-4 rounded"
                                    style={{ backgroundColor: getCurrentContent().background as string }}
                                />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <ColorPicker
                                value={getCurrentContent().background}
                                onChangeComplete={(value) => handleColorChange('background', value)}
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
                    <Input id="background" placeholder="rgba(0, 0, 0, 1)" className="flex-1" onChange={handleChangeCustomValues} value={getCurrentContent().background} />
                </div>
            </div>
        </div>
    )
}

export default ShimmerButtonCustomProperties