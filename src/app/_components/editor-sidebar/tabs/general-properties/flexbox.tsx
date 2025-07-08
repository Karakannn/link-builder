import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEditorSidebar } from "@/providers/editor/editor-sidebar-provider";
import { supportsLayout } from "@/lib/constants";
import {
    AlignHorizontalSpaceBetween,
    AlignHorizontalSpaceAround,
    AlignHorizontalJustifyCenterIcon,
    AlignHorizontalJustifyStart,
    AlignHorizontalJustifyEndIcon,
    AlignVerticalJustifyCenter,
    AlignVerticalJustifyStart,
    ArrowRight,
    ArrowDown,
    AlignVerticalJustifyEnd,
} from "lucide-react";
import React from "react";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useEditorElements, useSelectedElement } from "@/providers/editor/editor-elements-provider";

type Props = {};

const FlexboxProperties = (props: Props) => {
    const { getCurrentStyles, handleOnChanges, activeDevice } = useEditorSidebar();
    
    const { updateElement } = useElementActions();
    const selectedElement = useSelectedElement();

    const currentStyles = getCurrentStyles();
    const isFlexEnabled = currentStyles.display === "flex";

    const handleFlexToggle = (checked: boolean) => {
        handleOnChanges({
            target: {
                id: "display",
                value: checked ? "flex" : "block",
            },
        });
    };

    const handleJustifyContentChange = (value: string) => {
        const currentValue = currentStyles.justifyContent;
        console.log("JustifyContent Toggle:", {
            clickedValue: value,
            currentValue: currentValue,
            isSame: currentValue === value,
        });

        if (currentValue === value) {
            // Seçili değere tekrar tıklandığında özelliği tamamen kaldır
            console.log("Removing justifyContent property");
            handleOnChanges({
                target: {
                    id: "justifyContent",
                    value: undefined,
                },
            });
        } else {
            // Farklı değere tıklandığında o değeri seç
            console.log("Setting justifyContent to:", value);
            handleOnChanges({
                target: {
                    id: "justifyContent",
                    value: value,
                },
            });
        }
    };

    const handleAlignItemsChange = (value: string) => {
        const currentValue = currentStyles.alignItems;
        console.log("AlignItems Toggle:", {
            clickedValue: value,
            currentValue: currentValue,
            isSame: currentValue === value,
        });

        if (currentValue === value) {
            // Seçili değere tekrar tıklandığında özelliği tamamen kaldır
            console.log("Removing alignItems property");
            handleOnChanges({
                target: {
                    id: "alignItems",
                    value: undefined,
                },
            });
        } else {
            // Farklı değere tıklandığında o değeri seç
            console.log("Setting alignItems to:", value);
            handleOnChanges({
                target: {
                    id: "alignItems",
                    value: value,
                },
            });
        }
    };

    const handleFlexDirectionChange = (direction: string) => {
        // Önce flex'i etkinleştir
        if (!isFlexEnabled) {
            handleFlexToggle(true);
        }

        if (supportsLayout(selectedElement.type)) {
            const layout = direction === "row" ? "horizontal" : "vertical";

            // Layout destekleyen elementler için hem flexDirection hem de layout'u güncelle
            if (activeDevice === "Desktop") {
                updateElement({
                    ...selectedElement,
                    styles: {
                        ...selectedElement.styles,
                        flexDirection: direction as any,
                    },
                    layout: layout,
                });
            } else {
                // Responsive styles için
                const currentResponsiveStyles = selectedElement.responsiveStyles || {};
                updateElement({
                    ...selectedElement,
                    responsiveStyles: {
                        ...currentResponsiveStyles,
                        [activeDevice]: {
                            ...currentResponsiveStyles[activeDevice],
                            flexDirection: direction as any,
                        },
                    },
                    layout: layout,
                });
            }
        } else {
            // Layout desteklemeyen elementler için normal flexbox değişikliği
            handleOnChanges({
                target: {
                    id: "flexDirection",
                    value: direction,
                },
            });
        }
    };

    return (
        <AccordionItem value="Flexbox" className="px-0 py-0">
            <AccordionTrigger className="px-6 !no-underline">Flexbox</AccordionTrigger>
            <AccordionContent className="px-6 gap-2 flex flex-col">
                <div className="flex items-center gap-2">
                    <Input
                        className="h-4 w-4"
                        placeholder="px"
                        type="checkbox"
                        id="display"
                        checked={isFlexEnabled}
                        onChange={(e) => handleFlexToggle(e.target.checked)}
                    />
                    <Label className="text-muted-foreground">Flex</Label>
                </div>

                <Label className="text-muted-foreground">Justify Content</Label>
                <div className="flex items-center flex-row justify-start border-[1px] rounded-md bg-transparent h-fit gap-4 p-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`w-10 h-10 p-0 ${currentStyles.justifyContent === "space-between" ? "bg-muted" : ""}`}
                                    onClick={() => handleJustifyContentChange("space-between")}
                                >
                                    <AlignHorizontalSpaceBetween
                                        size={18}
                                        className={currentStyles.justifyContent === "space-between" ? "" : "text-muted-foreground"}
                                    />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Space Between</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`w-10 h-10 p-0 ${currentStyles.justifyContent === "space-evenly" ? "bg-muted" : ""}`}
                                    onClick={() => handleJustifyContentChange("space-evenly")}
                                >
                                    <AlignHorizontalSpaceAround
                                        size={18}
                                        className={currentStyles.justifyContent === "space-evenly" ? "" : "text-muted-foreground"}
                                    />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Space Evenly</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`w-10 h-10 p-0 ${currentStyles.justifyContent === "center" ? "bg-muted" : ""}`}
                                    onClick={() => handleJustifyContentChange("center")}
                                >
                                    <AlignHorizontalJustifyCenterIcon
                                        size={18}
                                        className={currentStyles.justifyContent === "center" ? "" : "text-muted-foreground"}
                                    />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Center</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`w-10 h-10 p-0 ${currentStyles.justifyContent === "start" ? "bg-muted" : ""}`}
                                    onClick={() => handleJustifyContentChange("start")}
                                >
                                    <AlignHorizontalJustifyStart
                                        size={18}
                                        className={currentStyles.justifyContent === "start" ? "" : "text-muted-foreground"}
                                    />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Start</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`w-10 h-10 p-0 ${currentStyles.justifyContent === "end" ? "bg-muted" : ""}`}
                                    onClick={() => handleJustifyContentChange("end")}
                                >
                                    <AlignHorizontalJustifyEndIcon
                                        size={18}
                                        className={currentStyles.justifyContent === "end" ? "" : "text-muted-foreground"}
                                    />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>End</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <Label className="text-muted-foreground">Align Items</Label>
                <div className="flex items-center flex-row justify-start border-[1px] rounded-md bg-transparent h-fit gap-4 p-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`w-10 h-10 p-0 ${currentStyles.alignItems === "center" ? "bg-muted" : ""}`}
                                    onClick={() => handleAlignItemsChange("center")}
                                >
                                    <AlignVerticalJustifyCenter size={18} className={currentStyles.alignItems === "center" ? "" : "text-muted-foreground"} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Center</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`w-10 h-10 p-0 ${currentStyles.alignItems === "start" ? "bg-muted" : ""}`}
                                    onClick={() => handleAlignItemsChange("start")}
                                >
                                    <AlignVerticalJustifyStart size={18} className={currentStyles.alignItems === "start" ? "" : "text-muted-foreground"} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Start</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`w-10 h-10 p-0 ${currentStyles.alignItems === "end" ? "bg-muted" : ""}`}
                                    onClick={() => handleAlignItemsChange("end")}
                                >
                                    <AlignVerticalJustifyEnd size={18} className={currentStyles.alignItems === "end" ? "" : "text-muted-foreground"} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>End</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`w-10 h-10 p-0 ${currentStyles.alignItems === "stretch" ? "bg-muted" : ""}`}
                                    onClick={() => handleAlignItemsChange("stretch")}
                                >
                                    <AlignVerticalJustifyEnd size={18} className={currentStyles.alignItems === "stretch" ? "" : "text-muted-foreground"} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Stretch</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`w-10 h-10 p-0 ${currentStyles.alignItems === "baseline" ? "bg-muted" : ""}`}
                                    onClick={() => handleAlignItemsChange("baseline")}
                                >
                                    <AlignVerticalJustifyStart size={18} className={currentStyles.alignItems === "baseline" ? "" : "text-muted-foreground"} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Baseline</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <Label className="text-muted-foreground">Direction</Label>
                <Tabs onValueChange={handleFlexDirectionChange} value={currentStyles.flexDirection}>
                    <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                        <TabsTrigger value="row" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                            <ArrowRight size={18} />
                        </TabsTrigger>
                        <TabsTrigger value="column" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                            <ArrowDown size={18} />
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
                {supportsLayout(selectedElement.type) && (
                    <div className="text-xs text-muted-foreground mt-2 p-2 bg-blue-50 rounded dark:bg-blue-950/20">
                        💡 Layout kontrolü: Column = Vertical, Row = Horizontal
                    </div>
                )}
                {!isFlexEnabled && (
                    <div className="text-xs text-muted-foreground mt-2 p-2 bg-yellow-50 rounded dark:bg-yellow-950/20">
                        💡 Flex'i etkinleştirin ki flexbox özellikleri çalışsın
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>
    );
};

export default FlexboxProperties;
