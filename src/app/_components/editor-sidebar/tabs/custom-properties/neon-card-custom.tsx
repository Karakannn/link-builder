"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ColorPicker, ColorPickerSelection, ColorPickerHue, ColorPickerAlpha, ColorPickerOutput, ColorPickerFormat } from "@/components/ui/color-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette, Settings, Clock, Type, Link2, ImageIcon } from "lucide-react";
import { useEditorSidebar } from "@/providers/editor/editor-sidebar-provider";  
import { LogoSelectionModal } from "@/components/global/logo-selection-modal";
import Color from "color";
import { useElementActions } from "@/hooks/editor-actions/use-element-actions";
import { useSelectedElement } from "@/providers/editor/editor-elements-provider";

const presetColors = ["#eb0a82", "#00FFF1", "#bcc388", "#fb7c28", "#45B7D1", "#0d92bf", "#0aa947", "#f1db4b", "#db0000", "#960aa9"];

const SponsorNeonCardCustomProperties = () => {
    const { handleOnChanges, getCurrentStyles } = useEditorSidebar();
    const { updateElement } = useElementActions();
    const selectedElement = useSelectedElement();
    const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

    // Parent element (neon card) styles
    const currentStyles = getCurrentStyles();
    const borderSize = currentStyles.borderSize || 2;
    const borderRadius = parseInt(currentStyles.borderRadius?.toString().replace("px", "")) || 12;
    const neonColor = currentStyles.neonColor || "#ff00aa";
    const animationDelay = currentStyles.animationDelay || 0;
    
    // Gradient settings - using nested structure like container custom
    const gradientSettings = currentStyles.gradientSettings || {
        color1: "#ff00aa",
        color2: "#00aaff", 
        angle: 135
    };

    // Child elementleri bul
    const element = selectedElement;
    const childElements = Array.isArray(element.content) ? element.content : [];

    const findInContent = (content: any[], type: string, nameContains?: string): any => {
        for (const child of content) {
            if (child.type === type && (nameContains ? child.name.toLowerCase().includes(nameContains.toLowerCase()) : true)) {
                return child;
            }
            if (Array.isArray(child.content)) {
                const found = findInContent(child.content, type, nameContains);
                if (found) return found;
            }
        }
        return null;
    };

    const logoElement = findInContent(childElements, "image");
    const titleElement = findInContent(childElements, "text", "title") || findInContent(childElements, "text", "sponsor");
    const descriptionElement = findInContent(childElements, "text", "text") || findInContent(childElements, "text", "text");

    // Title'ın current color'ını al
    const titleCurrentColor = titleElement?.styles?.color || neonColor;

    // Child element güncelleme fonksiyonu
    const updateChildElement = (elementId: string, updates: any) => {
        const updatedContent = updateChildInContent(element.content as any[], elementId, updates);

        updateElement({
            ...element,
            content: updatedContent,
        });
    };

    const updateChildInContent = (content: any[], elementId: string, updates: any): any[] => {
        return content.map((child) => {
            if (child.id === elementId) {
                return { ...child, ...updates };
            }
            if (Array.isArray(child.content)) {
                return {
                    ...child,
                    content: updateChildInContent(child.content, elementId, updates),
                };
            }
            return child;
        });
    };

    // Parent element (neon card) ayarları için
    const handleSliderChange = (property: string, value: number[]) => {
        console.log("🔧 Neon Card Property Update:", property, "=", value[0]);

        handleOnChanges({
            target: {
                id: property,
                value: property === "borderRadius" ? `${value[0]}px` : value[0],
            },
        } as any);
    };

    const handleColorPickerChange = (color: any) => {
        let hexColor = "#ff00aa";

        try {
            if (Array.isArray(color) && color.length >= 3) {
                const colorObj = Color.rgb(color[0], color[1], color[2]);
                hexColor = colorObj.hex();
            } else if (typeof color === "string") {
                const colorObj = Color(color);
                hexColor = colorObj.hex();
            }
        } catch (error) {
            console.warn("Invalid color value:", color);
            hexColor = "#ff00aa";
        }

        // Neon card color'ını güncelle
        handleOnChanges({
            target: {
                id: "neonColor",
                value: hexColor,
            },
        } as any);
    };

    // Title color için ayrı fonksiyon
    const handleTitleColorChange = (color: any) => {
        let hexColor = "#ff00aa";

        try {
            if (Array.isArray(color) && color.length >= 3) {
                const colorObj = Color.rgb(color[0], color[1], color[2]);
                hexColor = colorObj.hex();
            } else if (typeof color === "string") {
                const colorObj = Color(color);
                hexColor = colorObj.hex();
            }
        } catch (error) {
            console.warn("Invalid color value:", color);
            hexColor = "#ff00aa";
        }

        // Title elementinin rengini güncelle
        if (titleElement) {
            updateChildElement(titleElement.id, {
                styles: {
                    ...titleElement.styles,
                    color: hexColor,
                },
            });
        }
    };

    const handleSync = () => {
        // Title color'ı neon color ile senkronize et
        if (titleElement) {
            updateChildElement(titleElement.id, {
                styles: {
                    ...titleElement.styles,
                    color: neonColor,
                },
            });
        }
    };

    // Gradient settings handler - using nested structure like container custom
    const handleGradientSettingChange = (key: string, value: any) => {
        let processedValue = value;
        
        // Process color values
        if (key === 'color1' || key === 'color2') {
            try {
                if (Array.isArray(value) && value.length >= 3) {
                    const colorObj = Color.rgb(value[0], value[1], value[2]);
                    processedValue = colorObj.hex();
                } else if (typeof value === "string") {
                    const colorObj = Color(value);
                    processedValue = colorObj.hex();
                }
            } catch (error) {
                console.warn("Invalid color value:", value);
                processedValue = key === 'color1' ? "#ff00aa" : "#00aaff";
            }
        }

        const updatedSettings = {
            ...gradientSettings,
            [key]: processedValue,
        };
        
        handleOnChanges({
            target: {
                id: "gradientSettings",
                value: updatedSettings,
            },
        } as any);
    };

    return (
        <div className="space-y-6">
            {/* Card Type Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Settings size={16} />
                    <span className="font-medium">Card Type</span>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cardType">Card Style</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { value: "neon", label: "Neon (Default)" },
                            { value: "glassmorphism", label: "Glass" },
                            { value: "gradient", label: "Gradient" },
                            { value: "pulse", label: "Pulse" },
                        ].map((cardType) => (
                            <Button
                                key={cardType.value}
                                variant={currentStyles.cardType === cardType.value || (!currentStyles.cardType && cardType.value === "neon") ? "default" : "outline"}
                                size="sm"
                                onClick={() =>
                                    handleOnChanges({
                                        target: {
                                            id: "cardType",
                                            value: cardType.value,
                                        },
                                    } as any)
                                }
                                className="text-xs"
                            >
                                {cardType.label}
                            </Button>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Choose a card style that fits your design</p>
                </div>
            </div>


            {/* Gradient Settings Section - Only show for gradient card type */}
            {currentStyles.cardType === "gradient" && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                        <Palette size={16} />
                        <span className="font-medium">Gradient Settings</span>
                    </div>

                    {/* Gradient Color 1 */}
                    <div className="space-y-2">
                        <Label htmlFor="gradientColor1">Gradient Color 1</Label>
                        <div className="flex items-center gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                        <div className="w-4 h-4 rounded" style={{ backgroundColor: gradientSettings.color1 }} />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <ColorPicker 
                                        value={gradientSettings.color1} 
                                        onChange={(value) => handleGradientSettingChange('color1', value)} 
                                        onChangeComplete={(value) => handleGradientSettingChange('color1', value)}
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
                                placeholder="#ff00aa" 
                                className="flex-1" 
                                onChange={(e) => handleGradientSettingChange('color1', e.target.value)} 
                                value={gradientSettings.color1} 
                            />
                        </div>
                    </div>

                    {/* Gradient Color 2 */}
                    <div className="space-y-2">
                        <Label htmlFor="gradientColor2">Gradient Color 2</Label>
                        <div className="flex items-center gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                        <div className="w-4 h-4 rounded" style={{ backgroundColor: gradientSettings.color2 }} />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <ColorPicker 
                                        value={gradientSettings.color2} 
                                        onChange={(value) => handleGradientSettingChange('color2', value)} 
                                        onChangeComplete={(value) => handleGradientSettingChange('color2', value)}
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
                                placeholder="#00aaff" 
                                className="flex-1" 
                                onChange={(e) => handleGradientSettingChange('color2', e.target.value)} 
                                value={gradientSettings.color2} 
                            />
                        </div>
                    </div>

                    {/* Gradient Angle */}
                    <div className="space-y-2">
                        <Label className="text-muted-foreground">Gradient Angle: {gradientSettings.angle}°</Label>
                        <Slider
                            value={[gradientSettings.angle]}
                            onValueChange={(value) => handleGradientSettingChange('angle', value[0])}
                            max={360}
                            min={0}
                            step={15}
                            className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">Controls the direction of the gradient (0° = horizontal, 90° = vertical)</p>
                    </div>
                </div>
            )}
            {/* Neon Color Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Palette size={16} />
                    <span className="font-medium">Neon Color</span>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="neonColor">Neon Border Color</Label>
                    <div className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                    <div className="w-4 h-4 rounded" style={{ backgroundColor: neonColor }} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <ColorPicker value={neonColor} onChange={handleColorPickerChange} onChangeComplete={handleColorPickerChange}>
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
                        <Input placeholder="#ff00aa" className="flex-1" onChange={(e) => handleColorPickerChange(e.target.value)} value={neonColor} />
                    </div>

                    {/* Preset Color Options */}
                    <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Preset Colors</Label>
                        <div className="grid grid-cols-5 gap-2">
                            {presetColors.map((color, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className={`h-8 w-8 p-0 rounded-full border-2 ${neonColor === color ? "border-primary border-2" : "border-gray-300"}`}
                                    onClick={() => handleColorPickerChange(color)}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                >
                                    {neonColor === color && <div className="w-2 h-2 bg-white rounded-full" />}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Settings Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Type size={16} />
                    <span className="font-medium">Content Settings</span>
                </div>

                {/* Link URL */}
                <div className="space-y-2">
                    <Label htmlFor="href">Link URL</Label>
                    <Input
                        id="href"
                        placeholder="https://example.com"
                        value={currentStyles.href || ""}
                        onChange={(e) =>
                            handleOnChanges({
                                target: {
                                    id: "href",
                                    value: e.target.value,
                                },
                            } as any)
                        }
                    />
                    <p className="text-xs text-muted-foreground">Optional: Add a link to make the card clickable</p>
                </div>

                {/* Title Text & Color */}
                {titleElement && (
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title Text</Label>
                            <Input
                                id="title"
                                placeholder="Sponsor Title"
                                value={(titleElement.content as any)?.innerText || ""}
                                onChange={(e) =>
                                    updateChildElement(titleElement.id, {
                                        content: { ...(titleElement.content as any), innerText: e.target.value },
                                    })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Title Color</Label>
                                <Button variant="outline" size="sm" onClick={handleSync} className="flex items-center gap-1 text-xs">
                                    <Link2 size={12} />
                                    Sync with Neon
                                </Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                            <div className="w-4 h-4 rounded" style={{ backgroundColor: titleCurrentColor }} />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                        <ColorPicker value={titleCurrentColor} onChange={handleTitleColorChange} onChangeComplete={handleTitleColorChange}>
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
                                    placeholder="#ff00aa"
                                    className="flex-1"
                                    onChange={(e) => handleTitleColorChange(e.target.value)}
                                    value={titleCurrentColor}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Image URL */}
                {logoElement && (
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="imageUrl"
                                placeholder="https://example.com/logo.png"
                                value={(logoElement.content as any)?.src || ""}
                                onChange={(e) =>
                                    updateChildElement(logoElement.id, {
                                        content: { ...(logoElement.content as any), src: e.target.value },
                                    })
                                }
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsLogoModalOpen(true)}
                                className="px-3"
                                title="Select from available logos"
                            >
                                <ImageIcon size={16} />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Click the icon to select from available logos</p>
                    </div>
                )}

                {/* Description */}
                {descriptionElement && (
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            placeholder="Sponsored content"
                            value={(descriptionElement.content as any)?.innerText || ""}
                            onChange={(e) =>
                                updateChildElement(descriptionElement.id, {
                                    content: { ...(descriptionElement.content as any), innerText: e.target.value },
                                })
                            }
                        />
                    </div>
                )}
            </div>

            {/* Border Settings Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Settings size={16} />
                    <span className="font-medium">Border Settings</span>
                </div>

                {/* Border Size with Slider */}
                <div className="space-y-2">
                    <Label className="text-muted-foreground">Border Size: {borderSize}px</Label>
                    <Slider
                        value={[borderSize]}
                        onValueChange={(value) => handleSliderChange("borderSize", value)}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                    />
                </div>

                {/* Border Radius with Slider */}
                <div className="space-y-2">
                    <Label className="text-muted-foreground">Border Radius: {borderRadius}px</Label>
                    <Slider
                        value={[borderRadius]}
                        onValueChange={(value) => handleSliderChange("borderRadius", value)}
                        max={50}
                        min={0}
                        step={1}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Animation Settings Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Clock size={16} />
                    <span className="font-medium">Animation Settings</span>
                </div>

                {/* Animation Type Selection */}
                <div className="space-y-2">
                    <Label htmlFor="animationType">Animation Type</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { value: "none", label: "None" },
                            { value: "blink", label: "Blink" },
                            { value: "pulse-glow", label: "Pulse Glow" },
                            { value: "shake", label: "Shake" },
                            { value: "bounce-subtle", label: "Bounce" },
                            { value: "scale-pulse", label: "Scale Pulse" },
                            { value: "slide-in-left", label: "Slide Left" },
                            { value: "slide-in-right", label: "Slide Right" },
                            { value: "fade-in", label: "Fade In" },
                            { value: "zoom-in", label: "Zoom In" },
                            { value: "flip-in-y", label: "Flip In Y" },
                        ].map((animation) => (
                            <Button
                                key={animation.value}
                                variant={currentStyles.animationType === animation.value ? "default" : "outline"}
                                size="sm"
                                onClick={() =>
                                    handleOnChanges({
                                        target: {
                                            id: "animationType",
                                            value: animation.value,
                                        },
                                    } as any)
                                }
                                className="text-xs"
                            >
                                {animation.label}
                            </Button>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Select an animation effect for the neon card</p>
                </div>

                <div className="space-y-2">
                    <Label className="text-muted-foreground">Animation Delay: {animationDelay}s</Label>
                    <Slider
                        value={[animationDelay]}
                        onValueChange={(value) => handleSliderChange("animationDelay", value)}
                        max={5}
                        min={0}
                        step={0.1}
                        className="w-full"
                    />
                </div>
            </div>


            <div className="text-sm text-muted-foreground p-3 bg-gray-50 rounded-lg dark:bg-gray-800">
                💡 <strong>Tip:</strong> Title color varsayılan olarak neon color ile aynıdır. "Sync with Neon" butonu ile tekrar senkronize edebilirsiniz.
            </div>

            <LogoSelectionModal
                isOpen={isLogoModalOpen}
                onClose={() => setIsLogoModalOpen(false)}
                onSelect={(logoData) => {
                    let updatedContent = element.content as any[];

                    // Update logo image URL
                    if (logoElement) {
                        updatedContent = updateChildInContent(updatedContent, logoElement.id, {
                            content: {
                                ...(logoElement.content as any),
                                src: logoData.url,
                            },
                        });
                    }

                    // Update title text and color
                    if (titleElement) {
                        updatedContent = updateChildInContent(updatedContent, titleElement.id, {
                            content: {
                                ...(titleElement.content as any),
                                innerText: logoData.title,
                            },
                            styles: {
                                ...titleElement.styles,
                                color: logoData.defaultColor,
                            },
                        });
                    }
                    updateElement({
                        ...element,
                        content: updatedContent,
                        styles: {
                            ...element.styles,
                            neonColor: logoData.defaultColor,
                        } as any,
                    });
                }}
            />
        </div>
    );
};

export default SponsorNeonCardCustomProperties;
