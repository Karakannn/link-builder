"use client";
import { useEditorSidebar } from "@/providers/editor/editor-sidebar-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

const ImageCustom = () => {
    const { handleChangeCustomValues, getCurrentContent } = useEditorSidebar();

    return (
        <div className="space-y-4">
            {/* Image Source */}
            <div className="space-y-2">
                <Label htmlFor="src">Resim URL'si</Label>
                <Input
                    id="src"
                    placeholder="https://example.com/image.jpg"
                    onChange={handleChangeCustomValues}
                    value={getCurrentContent().src || ""}
                />
            </div>

            {/* Alt Text */}
            <div className="space-y-2">
                <Label htmlFor="alt">Alt Metni</Label>
                <Input
                    id="alt"
                    placeholder="Resim açıklaması"
                    onChange={handleChangeCustomValues}
                    value={getCurrentContent().alt || ""}
                />
            </div>

            {/* Object Fit */}
            <div className="space-y-2">
                <Label htmlFor="objectFit">Resim Sığdırma</Label>
                <Select
                    onValueChange={(value) => handleChangeCustomValues({
                        target: { id: "objectFit", value }
                    } as any)}
                    value={getCurrentContent().objectFit || "cover"}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Resim sığdırma seçin" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="cover">Kapsa</SelectItem>
                        <SelectItem value="contain">İçer</SelectItem>
                        <SelectItem value="fill">Doldur</SelectItem>
                        <SelectItem value="none">Yok</SelectItem>
                        <SelectItem value="scale-down">Küçült</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Filter */}
            <div className="space-y-2">
                <Label htmlFor="filter">Filtre</Label>
                <Select
                    onValueChange={(value) => handleChangeCustomValues({
                        target: { id: "filter", value }
                    } as any)}
                    value={getCurrentContent().filter || "none"}
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
        </div>
    );
};

export default ImageCustom;
