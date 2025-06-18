import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider'
import { Move } from 'lucide-react'
import React from 'react'

type Props = {}

const PositionProperties = (props: Props) => {

    const { getCurrentStyles, handleOnChanges } = useEditorSidebar();

    return (
        <AccordionItem value="Position" className="px-0 py-0 border-y">
            <AccordionTrigger className="px-6 !no-underline">
                <div className="flex items-center gap-2">
                    <Move className="w-4 h-4" />
                    Position
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-6">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground">Position Type</Label>
                        <Select
                            onValueChange={(value) =>
                                handleOnChanges({
                                    target: {
                                        id: "position",
                                        value,
                                    },
                                })
                            }
                            value={getCurrentStyles().position || "static"}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select position" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="static">Static</SelectItem>
                                <SelectItem value="relative">Relative</SelectItem>
                                <SelectItem value="absolute">Absolute</SelectItem>
                                <SelectItem value="fixed">Fixed</SelectItem>
                                <SelectItem value="sticky">Sticky</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    {/* Position coordinates - only show if position is not static */}
                    {(getCurrentStyles().position && getCurrentStyles().position !== "static") && (
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Label className="text-muted-foreground">Top</Label>
                                    <Input 
                                        placeholder="px" 
                                        id="top" 
                                        onChange={handleOnChanges} 
                                        value={getCurrentStyles().top || ""} 
                                    />
                                </div>
                                <div className="flex-1">
                                    <Label className="text-muted-foreground">Bottom</Label>
                                    <Input 
                                        placeholder="px" 
                                        id="bottom" 
                                        onChange={handleOnChanges} 
                                        value={getCurrentStyles().bottom || ""} 
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Label className="text-muted-foreground">Left</Label>
                                    <Input 
                                        placeholder="px" 
                                        id="left" 
                                        onChange={handleOnChanges} 
                                        value={getCurrentStyles().left || ""} 
                                    />
                                </div>
                                <div className="flex-1">
                                    <Label className="text-muted-foreground">Right</Label>
                                    <Input 
                                        placeholder="px" 
                                        id="right" 
                                        onChange={handleOnChanges} 
                                        value={getCurrentStyles().right || ""} 
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}

export default PositionProperties 