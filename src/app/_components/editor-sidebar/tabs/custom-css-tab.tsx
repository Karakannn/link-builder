"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEditorSidebar } from "@/providers/editor/editor-sidebar-provider";
import { Code } from 'lucide-react';
import { useSelectedElementId } from "@/providers/editor/editor-elements-provider";

export const CustomCSSTab = () => {
    const { getCurrentStyles, handleOnChanges } = useEditorSidebar();
    const selectedElementId = useSelectedElementId();
    const [customCSS, setCustomCSS] = useState('');
    const [debouncedCSS, setDebouncedCSS] = useState('');

    // Custom CSS'i styles'dan al
    useEffect(() => {
        try {
            const currentStyles = getCurrentStyles();
            const currentCustomCSS = currentStyles?.customCSS || '';
            setCustomCSS(currentCustomCSS);
            setDebouncedCSS(currentCustomCSS);
        } catch (error) {
            console.error("🔧 Custom CSS Tab - Error getting styles:", error);
        }
    }, [getCurrentStyles, selectedElementId]);

    // Debounce effect - 1 saniye bekleyip sonra kaydet
    useEffect(() => {
        const timer = setTimeout(() => {
            if (debouncedCSS !== customCSS) {
                setDebouncedCSS(customCSS);
                try {
                    handleOnChanges({
                        target: {
                            id: "customCSS",
                            value: customCSS,
                        },
                    });
                } catch (error) {
                    console.error("🔧 Custom CSS Tab - Error updating CSS:", error);
                }
            }
        }, 1000); // 1 saniye bekle

        return () => clearTimeout(timer);
    }, [customCSS, debouncedCSS, handleOnChanges]);

    // Textarea değişikliği - sadece local state'i güncelle
    const handleTextareaChange = (value: string) => {
        setCustomCSS(value);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 px-6">
                <Code size={20} />
                <div>
                    <h3 className="text-lg font-semibold">Custom CSS</h3>
                    <p className="text-sm text-muted-foreground">
                        Seçili elemente özel CSS kodları yazın
                    </p>
                </div>
            </div>

            <div className="px-6 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="custom-css" className="text-sm font-medium">
                        CSS Kodları
                    </Label>
                    <Textarea
                        id="custom-css"
                        placeholder="/* Custom CSS kodlarınızı buraya yazın */
background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
box-shadow: 0 4px 15px rgba(0,0,0,0.2);
transform: rotate(5deg);
border: 2px solid #ff6b6b;"
                        value={customCSS}
                        onChange={(e) => handleTextareaChange(e.target.value)}
                        className="min-h-[200px] font-mono text-sm"
                        rows={10}
                    />
                    {/* Debounce durumu göster */}
                    <div className="text-xs text-muted-foreground">
                        {customCSS !== debouncedCSS ? (
                            <span className="text-amber-600">⏳ Değişiklikler 1 saniye sonra kaydedilecek...</span>
                        ) : (
                            <span className="text-green-600">✅ Kaydedildi</span>
                        )}
                    </div>
                </div>

                <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="font-medium mb-1">ℹ️ Bilgi:</p>
                    <p>Tüm CSS property'leri kabul edilir. Yazdığınız CSS kodları 1 saniye bekledikten sonra seçili elemente uygulanır.</p>
                </div>
            </div>
        </div>
    );
}; 