import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider'
import { AlignHorizontalSpaceBetween, AlignHorizontalSpaceAround, AlignHorizontalJustifyCenterIcon, AlignHorizontalJustifyStart, AlignHorizontalJustifyEndIcon, AlignVerticalJustifyCenter, AlignVerticalJustifyStart, ArrowRight, ArrowDown } from 'lucide-react'
import React from 'react'

type Props = {}

const FlexboxProperties = (props: Props) => {

    const { getCurrentStyles, handleOnChanges } = useEditorSidebar();

    return (
        <AccordionItem value="Flexbox" className="px-0 py-0">
            <AccordionTrigger className="px-6 !no-underline">Flexbox</AccordionTrigger>
            <AccordionContent className="px-6 gap-2 flex flex-col">
                <Label className="text-muted-foreground">Justify Content</Label>
                <Tabs
                    onValueChange={(e) =>
                        handleOnChanges({
                            target: {
                                id: "justifyContent",
                                value: e,
                            },
                        })
                    }
                    value={getCurrentStyles().justifyContent}
                >
                    <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                        <TabsTrigger value="space-between" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                            <AlignHorizontalSpaceBetween size={18} />
                        </TabsTrigger>
                        <TabsTrigger value="space-evenly" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                            <AlignHorizontalSpaceAround size={18} />
                        </TabsTrigger>
                        <TabsTrigger value="center" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                            <AlignHorizontalJustifyCenterIcon size={18} />
                        </TabsTrigger>
                        <TabsTrigger value="start" className="w-10 h-10 p-0 data-[state=active]:bg-muted ">
                            <AlignHorizontalJustifyStart size={18} />
                        </TabsTrigger>
                        <TabsTrigger value="end" className="w-10 h-10 p-0 data-[state=active]:bg-muted ">
                            <AlignHorizontalJustifyEndIcon size={18} />
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
                <Label className="text-muted-foreground">Align Items</Label>
                <Tabs
                    onValueChange={(e) =>
                        handleOnChanges({
                            target: {
                                id: "alignItems",
                                value: e,
                            },
                        })
                    }
                    value={getCurrentStyles().alignItems}
                >
                    <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                        <TabsTrigger value="center" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                            <AlignVerticalJustifyCenter size={18} />
                        </TabsTrigger>
                        <TabsTrigger value="normal" className="w-10 h-10 p-0 data-[state=active]:bg-muted ">
                            <AlignVerticalJustifyStart size={18} />
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="flex items-center gap-2">
                    <Input
                        className="h-4 w-4"
                        placeholder="px"
                        type="checkbox"
                        id="display"
                        onChange={(va) => {
                            handleOnChanges({
                                target: {
                                    id: "display",
                                    value: va.target.checked ? "flex" : "block",
                                },
                            });
                        }}
                    />
                    <Label className="text-muted-foreground">Flex</Label>
                </div>
                <Label className="text-muted-foreground">Direction</Label>
                <Tabs
                    onValueChange={(e) =>
                        handleOnChanges({
                            target: {
                                id: "flexDirection",
                                value: e,
                            },
                        })
                    }
                    value={getCurrentStyles().flexDirection}
                >
                    <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                        <TabsTrigger value="row" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                            <ArrowRight size={18} />
                        </TabsTrigger>
                        <TabsTrigger value="column" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                            <ArrowDown size={18} />
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </AccordionContent>
        </AccordionItem>
    )
}

export default FlexboxProperties