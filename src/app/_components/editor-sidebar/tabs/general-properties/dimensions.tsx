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
import { expandSpacingShorthand } from "@/lib/utils";

type Props = {}

const DimensionsProperties = (props: Props) => {

    const { getCurrentStyles, handleOnChanges } = useEditorSidebar();
    const currentStyles = expandSpacingShorthand(getCurrentStyles());

    return (
        <AccordionItem value="Dimensions" className="px-0 py-0 border-y">
            <AccordionTrigger className="px-6 !no-underline">Dimensions</AccordionTrigger>
            <AccordionContent className="px-6">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Height</Label>
                                    <Input id="height" placeholder="px" onChange={handleOnChanges} value={currentStyles.height || ""} />
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Width</Label>
                                    <Input placeholder="px" id="width" onChange={handleOnChanges} value={currentStyles.width || ""} />
                                </div>
                            </div>
                            
                            <p>Margin px</p>
                            <div className="flex gap-4 flex-col">
                                <div className="flex gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Top</Label>
                                        <Input id="marginTop" placeholder="px" onChange={handleOnChanges} value={currentStyles.marginTop || ""} />
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Bottom</Label>
                                        <Input placeholder="px" id="marginBottom" onChange={handleOnChanges} value={currentStyles.marginBottom || ""} />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Left</Label>
                                        <Input placeholder="px" id="marginLeft" onChange={handleOnChanges} value={currentStyles.marginLeft || ""} />
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Right</Label>
                                        <Input placeholder="px" id="marginRight" onChange={handleOnChanges} value={currentStyles.marginRight || ""} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p>Padding px</p>
                            <div className="flex gap-4 flex-col">
                                <div className="flex gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Top</Label>
                                        <Input placeholder="px" id="paddingTop" onChange={handleOnChanges} value={currentStyles.paddingTop || ""} />
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Bottom</Label>
                                        <Input placeholder="px" id="paddingBottom" onChange={handleOnChanges} value={currentStyles.paddingBottom || ""} />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Left</Label>
                                        <Input placeholder="px" id="paddingLeft" onChange={handleOnChanges} value={currentStyles.paddingLeft || ""} />
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Right</Label>
                                        <Input placeholder="px" id="paddingRight" onChange={handleOnChanges} value={currentStyles.paddingRight || ""} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}

export default DimensionsProperties