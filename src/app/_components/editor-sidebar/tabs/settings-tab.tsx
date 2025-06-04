"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    ColorPicker,
    ColorPickerSelection,
    ColorPickerHue,
    ColorPickerAlpha,
    ColorPickerOutput,
    ColorPickerFormat
} from "@/components/ui/color-picker";
import { DeviceTypes, useEditor } from "@/providers/editor/editor-provider";
import { AlignHorizontalJustifyCenterIcon, AlignHorizontalJustifyEndIcon, AlignHorizontalJustifyStart, AlignHorizontalSpaceAround, AlignHorizontalSpaceBetween, AlignJustify, AlignLeft, AlignRight, AlignVerticalJustifyCenter, AlignVerticalJustifyStart, ChevronsLeftRightIcon, Laptop, LucideImageDown, Smartphone, Tablet, Plus, Minus, Palette } from "lucide-react";
import React, { ChangeEventHandler, useState, useEffect } from "react";
import { getElementContent } from "@/lib/utils";

const SettingsTab = () => {
    const { state, dispatch } = useEditor();
    // Device selector for responsive styles
    const [activeDevice, setActiveDevice] = useState<DeviceTypes>(state.editor.device);

    // Function to get the current styles based on the active device
    const getCurrentStyles = () => {
        const element = state.editor.selectedElement;
        if (activeDevice === "Desktop" || !element.responsiveStyles) {
            return element.styles;
        }
        return {
            ...element.styles,
            ...element.responsiveStyles[activeDevice]
        };
    };

    // Function to get the current content based on active device
    const getCurrentContent = () => {
        return getElementContent(state.editor.selectedElement, activeDevice);
    };

    const handleColorChange = (property: string, value: any) => {
        let colorValue: string;

        if (Array.isArray(value) && value.length >= 3) {
            // Ensure we have valid numbers and handle potential floating point issues
            const r = Math.round(Number(value[0]) || 0);
            const g = Math.round(Number(value[1]) || 0);
            const b = Math.round(Number(value[2]) || 0);
            const a = Number(value[3]) !== undefined ? Number(value[3]) : 1;
            colorValue = `rgba(${r}, ${g}, ${b}, ${a})`;
        } else if (typeof value === 'string' && value.length > 0) {
            colorValue = value;
        } else {
            colorValue = "#000000"; // fallback
        }

        handleChangeCustomValues({
            target: {
                id: property,
                value: colorValue
            }
        } as any);
    };

    // Handle color changes for styles (onChangeComplete version)
    const handleStyleColorChangeComplete = (property: string, value: any) => {
        let colorValue: string;

        if (Array.isArray(value) && value.length >= 3) {
            const r = Math.round(Number(value[0]) || 0);
            const g = Math.round(Number(value[1]) || 0);
            const b = Math.round(Number(value[2]) || 0);
            const a = Number(value[3]) !== undefined ? Number(value[3]) : 1;
            colorValue = `rgba(${r}, ${g}, ${b}, ${a})`;
        } else if (typeof value === 'string' && value.length > 0) {
            colorValue = value;
        } else {
            colorValue = "#000000";
        }

        handleOnChanges({
            target: {
                id: property,
                value: colorValue
            }
        } as any);
    };

    // Reset responsive styles to desktop values
    const handleResetToDesktop = () => {
        if (activeDevice === "Desktop") return;

        dispatch({
            type: "UPDATE_ELEMENT",
            payload: {
                elementDetails: {
                    ...state.editor.selectedElement,
                    responsiveStyles: {
                        ...state.editor.selectedElement.responsiveStyles,
                        [activeDevice]: {}
                    }
                }
            }
        });
    };

    // Handle changes to styles - now considers active device
    const handleOnChanges = (e: any) => {
        const styleSettings = e.target.id;
        let value = e.target.value;
        const styleObject = {
            [styleSettings]: value,
        };

        if (activeDevice === "Desktop") {
            // Update desktop (base) styles
            dispatch({
                type: "UPDATE_ELEMENT",
                payload: {
                    elementDetails: {
                        ...state.editor.selectedElement,
                        styles: {
                            ...state.editor.selectedElement.styles,
                            ...styleObject,
                        },
                    },
                },
            });
        } else {
            // Update responsive styles for the current device
            const currentResponsiveStyles = state.editor.selectedElement.responsiveStyles || {};
            const deviceStyles = currentResponsiveStyles[activeDevice] || {};

            dispatch({
                type: "UPDATE_ELEMENT",
                payload: {
                    elementDetails: {
                        ...state.editor.selectedElement,
                        responsiveStyles: {
                            ...currentResponsiveStyles,
                            [activeDevice]: {
                                ...deviceStyles,
                                ...styleObject
                            }
                        }
                    },
                },
            });
        }
    };

    const handleChangeCustomValues: ChangeEventHandler<HTMLInputElement> = (e) => {
        const settingProperty = e.target.id;
        let value = e.target.value;
        const styleObject = {
            [settingProperty]: value,
        };

        if (activeDevice === "Desktop") {
            // Update base content values
            dispatch({
                type: "UPDATE_ELEMENT",
                payload: {
                    elementDetails: {
                        ...state.editor.selectedElement,
                        content: {
                            ...state.editor.selectedElement.content,
                            ...styleObject,
                        },
                    },
                },
            });
        } else {
            // For responsive devices, update responsiveContent
            const elementContent = state.editor.selectedElement.content;

            // Only proceed if we have object content (not array)
            if (typeof elementContent === 'object' && !Array.isArray(elementContent)) {
                const baseContent = elementContent;
                const responsiveContent = baseContent.responsiveContent || {};
                const deviceContent = responsiveContent[activeDevice] || {};

                dispatch({
                    type: "UPDATE_ELEMENT",
                    payload: {
                        elementDetails: {
                            ...state.editor.selectedElement,
                            content: {
                                ...baseContent,
                                responsiveContent: {
                                    ...responsiveContent,
                                    [activeDevice]: {
                                        ...deviceContent,
                                        ...styleObject
                                    }
                                }
                            },
                        },
                    },
                });
            }
        }
    };


    // Update active device when editor device changes
    useEffect(() => {
        setActiveDevice(state.editor.device);
    }, [state.editor.device]);

    // Function to get device icon
    const getDeviceIcon = (device: DeviceTypes) => {
        switch (device) {
            case "Desktop":
                return <Laptop className="h-4 w-4" />;
            case "Tablet":
                return <Tablet className="h-4 w-4" />;
            case "Mobile":
                return <Smartphone className="h-4 w-4" />;
        }
    };

    // Add marquee item handler
    const handleAddMarqueeItem = () => {
        if (state.editor.selectedElement.type !== "marquee") return;

        const currentContent = getCurrentContent();
        const items = currentContent.items || [];
        const newItems = [...items, { type: "text", content: "New Item" }];

        handleChangeCustomValues({
            target: {
                id: "items",
                value: newItems
            }
        } as any);
    };

    // Remove marquee item handler
    const handleRemoveMarqueeItem = (index: number) => {
        if (state.editor.selectedElement.type !== "marquee") return;

        const currentContent = getCurrentContent();
        const items = currentContent.items || [];
        const newItems = items.filter((_: any, i: number) => i !== index);

        handleChangeCustomValues({
            target: {
                id: "items",
                value: newItems
            }
        } as any);
    };

    // Update marquee item handler
    const handleUpdateMarqueeItem = (index: number, field: string, value: any) => {
        if (state.editor.selectedElement.type !== "marquee") return;

        const currentContent = getCurrentContent();
        const items = currentContent.items || [];
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };

        handleChangeCustomValues({
            target: {
                id: "items",
                value: newItems
            }
        } as any);
    };

    return (
        <Accordion type="multiple" className="w-full" defaultValue={["Typography", "Dimensions", "Decorations", "Flexbox"]}>
            {/* Device selector for responsive styles */}
            <div className="px-6 py-4 border-b flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Device</Label>
                    {activeDevice !== "Desktop" && (
                        <Button
                            onClick={handleResetToDesktop}
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                        >
                            Reset to Desktop
                        </Button>
                    )}
                </div>

                <Tabs
                    value={activeDevice}
                    onValueChange={(value) => setActiveDevice(value as DeviceTypes)}
                    className="w-full"
                >
                    <TabsList className="w-full grid grid-cols-3">
                        <TabsTrigger value="Desktop" className="flex items-center gap-1.5">
                            <Laptop className="h-4 w-4" />
                            <span>Desktop</span>
                        </TabsTrigger>
                        <TabsTrigger value="Tablet" className="flex items-center gap-1.5">
                            <Tablet className="h-4 w-4" />
                            <span>Tablet</span>
                        </TabsTrigger>
                        <TabsTrigger value="Mobile" className="flex items-center gap-1.5">
                            <Smartphone className="h-4 w-4" />
                            <span>Mobile</span>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {activeDevice !== "Desktop" && (
                    <div className="bg-amber-50 text-amber-800 text-xs p-2 rounded mt-2">
                        Editing styles for {activeDevice} device
                    </div>
                )}
            </div>

            <AccordionItem value="custom" className="px-0 py-0">
                <AccordionTrigger className="px-6 !no-underline">Custom</AccordionTrigger>
                <AccordionContent className="px-6">
                    {/* Link Settings */}
                    {state.editor.selectedElement.type === "link" && !Array.isArray(state.editor.selectedElement.content) && (
                        <div className="flex flex-col gap-2">
                            <p className="text-muted-foreground">Link Path</p>
                            <Input id="href" placeholder="https://domain.example.com/pathname" onChange={handleChangeCustomValues} value={getCurrentContent().href} />
                        </div>
                    )}

                    {/* Shimmer Button Settings */}
                    {state.editor.selectedElement.type === "shimmerButton" && !Array.isArray(state.editor.selectedElement.content) && (
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
                    )}

                    {/* New Button Settings */}
                    {(state.editor.selectedElement.type === "animatedShinyButton" ||
                        state.editor.selectedElement.type === "animatedBorderButton" ||
                        state.editor.selectedElement.type === "animatedTextButton") &&
                        !Array.isArray(state.editor.selectedElement.content) && (
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <p className="text-muted-foreground">Button Text</p>
                                    <Input id="innerText" placeholder="Button Text" onChange={handleChangeCustomValues} value={getCurrentContent().innerText} />
                                </div>
                            </div>
                        )}

                    {/* Neon Gradient Button Settings */}
                    {state.editor.selectedElement.type === "neonGradientButton" && !Array.isArray(state.editor.selectedElement.content) && (
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
                    )}

                    {/* Marquee Settings */}
                    {state.editor.selectedElement.type === "marquee" && !Array.isArray(state.editor.selectedElement.content) && (
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <p className="text-muted-foreground">Direction</p>
                                <Select
                                    onValueChange={(value) => handleChangeCustomValues({
                                        target: { id: "direction", value }
                                    } as any)}
                                    value={getCurrentContent().direction}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select direction" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="left">Left</SelectItem>
                                        <SelectItem value="right">Right</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-muted-foreground">Speed</p>
                                <Input id="speed" type="number" placeholder="50" onChange={handleChangeCustomValues} value={getCurrentContent().speed} />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="pauseOnHover"
                                    checked={getCurrentContent().pauseOnHover}
                                    onChange={(e) => handleChangeCustomValues({
                                        target: { id: "pauseOnHover", value: e.target.checked }
                                    } as any)}
                                />
                                <Label htmlFor="pauseOnHover">Pause on Hover</Label>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-muted-foreground">Marquee Items</p>
                                    <Button size="sm" onClick={handleAddMarqueeItem}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {(getCurrentContent().items || []).map((item: any, index: number) => (
                                        <div key={index} className="border p-2 rounded space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Select
                                                    value={item.type}
                                                    onValueChange={(value) => handleUpdateMarqueeItem(index, "type", value)}
                                                >
                                                    <SelectTrigger className="w-24">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="text">Text</SelectItem>
                                                        <SelectItem value="image">Image</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button size="sm" variant="destructive" onClick={() => handleRemoveMarqueeItem(index)}>
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <Input
                                                placeholder={item.type === "image" ? "Image URL" : "Text content"}
                                                value={item.content}
                                                onChange={(e) => handleUpdateMarqueeItem(index, "content", e.target.value)}
                                            />
                                            {item.type === "image" && (
                                                <>
                                                    <Input
                                                        placeholder="Alt text"
                                                        value={item.alt || ""}
                                                        onChange={(e) => handleUpdateMarqueeItem(index, "alt", e.target.value)}
                                                    />
                                                    <div className="flex gap-2">
                                                        <Input
                                                            type="number"
                                                            placeholder="Width"
                                                            value={item.width || 100}
                                                            onChange={(e) => handleUpdateMarqueeItem(index, "width", parseInt(e.target.value))}
                                                        />
                                                        <Input
                                                            type="number"
                                                            placeholder="Height"
                                                            value={item.height || 100}
                                                            onChange={(e) => handleUpdateMarqueeItem(index, "height", parseInt(e.target.value))}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Background Pattern Settings */}
                    {(state.editor.selectedElement.type === "animatedGridPattern" ||
                        state.editor.selectedElement.type === "interactiveGridPattern" ||
                        state.editor.selectedElement.type === "retroGrid" ||
                        state.editor.selectedElement.type === "dotPattern") &&
                        !Array.isArray(state.editor.selectedElement.content) && (
                            <div className="flex flex-col gap-4">
                                {state.editor.selectedElement.type === "animatedGridPattern" && (
                                    <>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-muted-foreground">Grid Width</p>
                                            <Input id="width" type="number" placeholder="40" onChange={handleChangeCustomValues} value={getCurrentContent().width} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-muted-foreground">Grid Height</p>
                                            <Input id="height" type="number" placeholder="40" onChange={handleChangeCustomValues} value={getCurrentContent().height} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-muted-foreground">Number of Squares</p>
                                            <Input id="numSquares" type="number" placeholder="50" onChange={handleChangeCustomValues} value={getCurrentContent().numSquares} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-muted-foreground">Max Opacity</p>
                                            <Slider
                                                value={[getCurrentContent().maxOpacity * 100 || 50]}
                                                onValueChange={(value) => handleChangeCustomValues({
                                                    target: { id: "maxOpacity", value: value[0] / 100 }
                                                } as any)}
                                                max={100}
                                                step={1}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-muted-foreground">Duration (seconds)</p>
                                            <Input id="duration" type="number" placeholder="4" onChange={handleChangeCustomValues} value={getCurrentContent().duration} />
                                        </div>
                                    </>
                                )}

                                {state.editor.selectedElement.type === "retroGrid" && (
                                    <>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-muted-foreground">Angle</p>
                                            <Input id="angle" type="number" placeholder="65" onChange={handleChangeCustomValues} value={getCurrentContent().angle} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-muted-foreground">Cell Size</p>
                                            <Input id="cellSize" type="number" placeholder="60" onChange={handleChangeCustomValues} value={getCurrentContent().cellSize} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-muted-foreground">Light Line Color</p>
                                            <Input id="lightLineColor" placeholder="gray" onChange={handleChangeCustomValues} value={getCurrentContent().lightLineColor} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-muted-foreground">Dark Line Color</p>
                                            <Input id="darkLineColor" placeholder="gray" onChange={handleChangeCustomValues} value={getCurrentContent().darkLineColor} />
                                        </div>
                                    </>
                                )}

                                {state.editor.selectedElement.type === "dotPattern" && (
                                    <>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-muted-foreground">Pattern Width</p>
                                            <Input id="width" type="number" placeholder="16" onChange={handleChangeCustomValues} value={getCurrentContent().width} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-muted-foreground">Pattern Height</p>
                                            <Input id="height" type="number" placeholder="16" onChange={handleChangeCustomValues} value={getCurrentContent().height} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-muted-foreground">Circle Radius</p>
                                            <Input id="cr" type="number" placeholder="1" onChange={handleChangeCustomValues} value={getCurrentContent().cr} />
                                        </div>
                                    </>
                                )}

                                {state.editor.selectedElement.type === "interactiveGridPattern" && (
                                    <>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-muted-foreground">Cell Width</p>
                                            <Input id="width" type="number" placeholder="40" onChange={handleChangeCustomValues} value={getCurrentContent().width} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-muted-foreground">Cell Height</p>
                                            <Input id="height" type="number" placeholder="40" onChange={handleChangeCustomValues} value={getCurrentContent().height} />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                </AccordionContent>
            </AccordionItem>

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

            <AccordionItem value="Dimensions" className="px-0 py-0 border-y">
                <AccordionTrigger className="px-6 !no-underline">Dimensions</AccordionTrigger>
                <AccordionContent className="px-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Height</Label>
                                        <Input id="height" placeholder="px" onChange={handleOnChanges} value={getCurrentStyles().height} />
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Width</Label>
                                        <Input placeholder="px" id="width" onChange={handleOnChanges} value={getCurrentStyles().width} />
                                    </div>
                                </div>
                                <p>Margin px</p>
                                <div className="flex gap-4 flex-col">
                                    <div className="flex gap-4">
                                        <div>
                                            <Label className="text-muted-foreground">Top</Label>
                                            <Input id="marginTop" placeholder="px" onChange={handleOnChanges} value={getCurrentStyles().marginTop} />
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Bottom</Label>
                                            <Input placeholder="px" id="marginBottom" onChange={handleOnChanges} value={getCurrentStyles().marginBottom} />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div>
                                            <Label className="text-muted-foreground">Left</Label>
                                            <Input placeholder="px" id="marginLeft" onChange={handleOnChanges} value={getCurrentStyles().marginLeft} />
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Right</Label>
                                            <Input placeholder="px" id="marginRight" onChange={handleOnChanges} value={getCurrentStyles().marginRight} />
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
                                            <Input placeholder="px" id="paddingTop" onChange={handleOnChanges} value={getCurrentStyles().paddingTop} />
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Bottom</Label>
                                            <Input placeholder="px" id="paddingBottom" onChange={handleOnChanges} value={getCurrentStyles().paddingBottom} />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div>
                                            <Label className="text-muted-foreground">Left</Label>
                                            <Input placeholder="px" id="paddingLeft" onChange={handleOnChanges} value={getCurrentStyles().paddingLeft} />
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Right</Label>
                                            <Input placeholder="px" id="paddingRight" onChange={handleOnChanges} value={getCurrentStyles().paddingRight} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="Decorations" className="px-0 py-0 ">
                <AccordionTrigger className="px-6 !no-underline">Decorations</AccordionTrigger>
                <AccordionContent className="px-6 flex flex-col gap-4">
                    <div>
                        <Label className="text-muted-foreground">Opacity</Label>
                        <div className="flex items-center justify-end">
                            <small className="p-2">
                                {(() => {
                                    const opacity = getCurrentStyles().opacity;
                                    if (typeof opacity === "number") return opacity;
                                    if (typeof opacity === "string") {
                                        return parseFloat(opacity.replace("%", "")) || 0;
                                    }
                                    return 0;
                                })()}%
                            </small>
                        </div>
                        <Slider
                            onValueChange={(e) => {
                                handleOnChanges({
                                    target: {
                                        id: "opacity",
                                        value: `${e[0]}%`,
                                    },
                                });
                            }}
                            defaultValue={[(() => {
                                const opacity = getCurrentStyles().opacity;
                                if (typeof opacity === "number") return opacity;
                                if (typeof opacity === "string") {
                                    return parseFloat(opacity.replace("%", "")) || 0;
                                }
                                return 0;
                            })()]}
                            max={100}
                            step={1}
                        />
                    </div>
                    <div>
                        <Label className="text-muted-foreground">Border Radius</Label>
                        <div className="flex items-center justify-end">
                            <small className="p-2">
                                {(() => {
                                    const borderRadius = getCurrentStyles().borderRadius;
                                    if (typeof borderRadius === "number") return borderRadius;
                                    if (typeof borderRadius === "string") {
                                        return parseFloat(borderRadius.replace("px", "")) || 0;
                                    }
                                    return 0;
                                })()}
                                px
                            </small>
                        </div>
                        <Slider
                            onValueChange={(e) => {
                                handleOnChanges({
                                    target: {
                                        id: "borderRadius",
                                        value: `${e[0]}px`,
                                    },
                                });
                            }}
                            defaultValue={[(() => {
                                const borderRadius = getCurrentStyles().borderRadius;
                                if (typeof borderRadius === "number") return borderRadius;
                                if (typeof borderRadius === "string") {
                                    return parseFloat(borderRadius.replace("px", "")) || 0;
                                }
                                return 0;
                            })()]}
                            max={100}
                            step={1}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground">Background Color</Label>
                        <div className="flex items-center gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                        <div
                                            className="w-4 h-4 rounded"
                                            style={{ backgroundColor: getCurrentStyles().backgroundColor as string }}
                                        />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <ColorPicker
                                        value={getCurrentStyles().backgroundColor}
                                        onChangeComplete={(value) => handleStyleColorChangeComplete("backgroundColor", value)}
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
                            <Input placeholder="#HFI245" className="flex-1" id="backgroundColor" onChange={handleOnChanges} value={getCurrentStyles().backgroundColor} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground">Background Image</Label>
                        <div className="flex border-[1px] rounded-md overflow-clip">
                            <div
                                className="w-12"
                                style={{
                                    backgroundImage: getCurrentStyles().backgroundImage,
                                }}
                            />
                            <Input placeholder="url()" className="!border-y-0 rounded-none !border-r-0 mr-2" id="backgroundImage" onChange={handleOnChanges} value={getCurrentStyles().backgroundImage} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground">Image Position</Label>
                        <Tabs
                            onValueChange={(e) =>
                                handleOnChanges({
                                    target: {
                                        id: "backgroundSize",
                                        value: e,
                                    },
                                })
                            }
                            value={getCurrentStyles().backgroundSize?.toString()}
                        >
                            <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                                <TabsTrigger value="cover" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                                    <ChevronsLeftRightIcon size={18} />
                                </TabsTrigger>
                                <TabsTrigger value="contain" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                                    <AlignVerticalJustifyCenter size={22} />
                                </TabsTrigger>
                                <TabsTrigger value="auto" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                                    <LucideImageDown size={18} />
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </AccordionContent>
            </AccordionItem>

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
                    <div>
                        <Label className="text-muted-foreground"> Direction</Label>
                        <Input placeholder="px" id="flexDirection" onChange={handleOnChanges} value={getCurrentStyles().flexDirection} />
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default SettingsTab;