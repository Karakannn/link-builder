import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { ColorPicker, ColorPickerSelection, ColorPickerHue, ColorPickerAlpha, ColorPickerOutput, ColorPickerFormat } from '@/components/ui/color-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider'
import { AlignLeft, AlignRight, AlignJustify, AlignHorizontalSpaceBetween, AlignHorizontalSpaceAround, AlignHorizontalJustifyCenterIcon, AlignHorizontalJustifyStart, AlignHorizontalJustifyEndIcon, AlignVerticalJustifyCenter, AlignVerticalJustifyStart } from 'lucide-react'
import React from 'react'

type Props = {}

const TypographyProperties = (props: Props) => {

    const { getCurrentStyles, handleOnChanges, handleStyleColorChangeComplete } = useEditorSidebar();

    return (

        <AccordionItem value="Typography" className="px-0 py-0 border-y">
            <AccordionTrigger className="px-6 !no-underline">Typography</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 px-6">
                <div className="flex flex-col gap-2">
                    <p className="text-muted-foreground">Text Align</p>
                    <Tabs
                        onValueChange={(value) =>
                            handleOnChanges({
                                target: {
                                    id: "textAlign",
                                    value,
                                },
                            })
                        }
                        value={getCurrentStyles().textAlign}
                    >
                        <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                            <TabsTrigger value="left" className="w-10 h-10 data-[state=action]:bg-muted">
                                <AlignLeft size={18} />
                            </TabsTrigger>
                            <TabsTrigger value="right" className="w-10 h-10 data-[state=action]:bg-muted">
                                <AlignRight size={18} />
                            </TabsTrigger>
                            <TabsTrigger value="justify" className="w-10 h-10 data-[state=action]:bg-muted">
                                <AlignJustify size={18} />
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-muted-foreground">Font Family</p>
                    <Input id="DM Sans" placeholder="Arial, sans-serif" onChange={handleOnChanges} value={getCurrentStyles().fontFamily} />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-muted-foreground">Color</p>
                    <div className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                    <div
                                        className="w-4 h-4 rounded"
                                        style={{ backgroundColor: getCurrentStyles().color as string }}
                                    />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <ColorPicker
                                    value={getCurrentStyles().color}
                                    onChangeComplete={(value) => handleStyleColorChangeComplete("color", value)}
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
                        <Input id="color" className="flex-1" onChange={handleOnChanges} value={getCurrentStyles().color} />
                    </div>
                </div>
                <div className="flex gap-4">
                    <div>
                        <Label className="text-muted-foreground">Weight</Label>
                        <Select
                            onValueChange={(e) =>
                                handleOnChanges({
                                    target: {
                                        id: "font-weight",
                                        value: e,
                                    },
                                })
                            }
                            value={getCurrentStyles().fontWeight?.toString()}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a weight" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Font Weights</SelectLabel>
                                    <SelectItem value="bold">Bold</SelectItem>
                                    <SelectItem value="normal">Regular</SelectItem>
                                    <SelectItem value="lighter">Light</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="text-muted-foreground">Size</Label>
                        <Input placeholder="px" id="fontSize" onChange={handleOnChanges} value={getCurrentStyles().fontSize} />
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}

export default TypographyProperties