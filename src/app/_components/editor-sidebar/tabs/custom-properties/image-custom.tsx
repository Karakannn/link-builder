"use client";
import { useEditorSidebar } from "@/providers/editor/editor-sidebar-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { LogoSelectionModal } from "@/components/global/logo-selection-modal";
import { Images } from "lucide-react";
import React, { useState } from "react";

const ImageCustom = () => {
    const { handleChangeCustomValues, getCurrentContent } = useEditorSidebar();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const currentContent = getCurrentContent();
    const maxWidth = currentContent.maxWidth || "80%";
    const height = currentContent.height || "24px";

    const handleSliderChange = (property: string, value: number[]) => {
        handleChangeCustomValues({
            target: {
                id: property,
                value: value[0],
            },
        } as any);
    };

    const handleLogoSelect = (logoPath: string) => {
        handleChangeCustomValues({
            target: {
                id: "src",
                value: logoPath,
            },
        } as any);
    };

    return (
        <div className="space-y-4">
            {/* Image Source */}
            <div className="space-y-2">
                <Label htmlFor="src">Resim URL'si</Label>
                <div className="flex gap-2">
                    <Input
                        id="src"
                        placeholder="https://example.com/image.jpg"
                        onChange={handleChangeCustomValues}
                        value={currentContent.src || ""}
                        className="flex-1"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsModalOpen(true)}
                        className="flex-shrink-0"
                    >
                        <Images className="h-4 w-4" />
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Logo seçmek için resim butonuna tıklayın veya URL girin
                </p>
            </div>

            {/* Alt Text */}
            <div className="space-y-2">
                <Label htmlFor="alt">Alt Metni</Label>
                <Input
                    id="alt"
                    placeholder="Sponsor Logo"
                    onChange={handleChangeCustomValues}
                    value={currentContent.alt || ""}
                />
            </div>

            {/* Max Width */}
            <div className="space-y-2">
                <Label htmlFor="maxWidth">Maksimum Genişlik</Label>
                <Input
                    id="maxWidth"
                    placeholder="80%"
                    onChange={handleChangeCustomValues}
                    value={maxWidth}
                />
            </div>

            {/* Height */}
            <div className="space-y-2">
                <Label htmlFor="height">Yükseklik</Label>
                <Input
                    id="height"
                    placeholder="24px"
                    onChange={handleChangeCustomValues}
                    value={height}
                />
            </div>

            {/* Object Fit */}
            <div className="space-y-2">
                <Label htmlFor="objectFit">Resim Sığdırma</Label>
                <Select
                    onValueChange={(value) => handleChangeCustomValues({
                        target: { id: "objectFit", value }
                    } as any)}
                    value={currentContent.objectFit || "contain"}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Resim sığdırma seçin" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="contain">İçer (Önerilen)</SelectItem>
                        <SelectItem value="cover">Kapsa</SelectItem>
                        <SelectItem value="fill">Doldur</SelectItem>
                        <SelectItem value="none">Yok</SelectItem>
                        <SelectItem value="scale-down">Küçült</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Border Radius */}
            <div className="space-y-2">
                <Label className="text-muted-foreground">
                    Border Radius: {currentContent.borderRadius || 0}px
                </Label>
                <Slider
                    value={[currentContent.borderRadius || 0]}
                    onValueChange={(value) => handleSliderChange("borderRadius", value)}
                    max={50}
                    min={0}
                    step={1}
                    className="w-full"
                />
                <Input
                    id="borderRadius"
                    type="number"
                    min="0"
                    max="50"
                    value={currentContent.borderRadius || 0}
                    onChange={handleChangeCustomValues}
                    placeholder="0"
                    className="text-xs"
                />
            </div>

            {/* Filter */}
            <div className="space-y-2">
                <Label htmlFor="filter">Filtre</Label>
                <Select
                    onValueChange={(value) => handleChangeCustomValues({
                        target: { id: "filter", value }
                    } as any)}
                    value={currentContent.filter || "none"}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filtre seçin" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">Yok</SelectItem>
                        <SelectItem value="grayscale">Gri Ton</SelectItem>
                        <SelectItem value="sepia">Sepia</SelectItem>
                        <SelectItem value="blur">Bulanık</SelectItem>
                        <SelectItem value="brightness">Parlaklık</SelectItem>
                        <SelectItem value="contrast">Kontrast</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Logo Selection Modal */}
            <LogoSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleLogoSelect}
            />
        </div>
    );
};

export default ImageCustom;
