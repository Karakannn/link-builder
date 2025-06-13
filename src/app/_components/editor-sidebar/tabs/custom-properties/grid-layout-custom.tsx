import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider';
import { useEditor } from '@/providers/editor/editor-provider';
import { Plus, Minus } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { v4 } from "uuid";
import { defaultStyles } from "@/lib/constants";

type Props = {}

const GridLayoutCustomProperties = (props: Props) => {
    const { handleOnChanges, getCurrentStyles } = useEditorSidebar(); // Content yerine styles kullan
    const { state, dispatch } = useEditor();

    const gridColumns = Array.isArray(state.editor.selectedElement.content) 
        ? state.editor.selectedElement.content 
        : [];
    
    // Grid ayarlarını styles'tan al
    const currentStyles = getCurrentStyles();
    const totalGridColumns = (currentStyles as any).gridColumns || 12;
    const columnSpans = (currentStyles as any).columnSpans || [];
    const gap = (currentStyles as any).gridGap || currentStyles.gap || "1rem";

    // Local state for real-time UI updates
    const [localColumnCount, setLocalColumnCount] = useState(gridColumns.length);
    const [localTotalColumns, setLocalTotalColumns] = useState(totalGridColumns);
    const [localGap, setLocalGap] = useState(gap);

    // Sync local state with actual state changes
    useEffect(() => {
        setLocalColumnCount(gridColumns.length);
    }, [gridColumns.length]);

    useEffect(() => {
        setLocalTotalColumns(totalGridColumns);
    }, [totalGridColumns]);

    useEffect(() => {
        setLocalGap(gap);
    }, [gap]);

    // Column sayısını arttır/azalt
    const handleColumnCountChange = (direction: 'increase' | 'decrease') => {
        const currentCount = gridColumns.length;
        
        if (direction === 'increase' && currentCount < 12) {
            const newCount = currentCount + 1;
            setLocalColumnCount(newCount);
            
            // Yeni column ekle
            const newColumn = {
                id: v4(),
                name: `Sütun ${newCount}`,
                content: [],
                styles: { ...defaultStyles, minHeight: "120px" } as React.CSSProperties,
                type: "column" as const,
            };

            dispatch({
                type: "ADD_ELEMENT",
                payload: {
                    containerId: state.editor.selectedElement.id,
                    elementDetails: newColumn,
                },
            });
        } else if (direction === 'decrease' && currentCount > 1) {
            const newCount = currentCount - 1;
            setLocalColumnCount(newCount);
            
            // Son column'u sil
            const lastColumn = gridColumns[gridColumns.length - 1];
            if (lastColumn) {
                dispatch({
                    type: "DELETE_ELEMENT",
                    payload: {
                        elementDetails: lastColumn,
                    },
                });
            }
        }
    };

    // Grid sütun sayısını arttır/azalt
    const handleGridColumnsChange = (direction: 'increase' | 'decrease') => {
        const current = localTotalColumns;
        let newValue = current;
        
        if (direction === 'increase' && current < 24) {
            newValue = current + 2;
        } else if (direction === 'decrease' && current > 6) {
            newValue = current - 2;
        }
        
        if (newValue !== current) {
            setLocalTotalColumns(newValue);
            
            // Styles'a yaz (content'e değil!)
            handleOnChanges({
                target: { id: "gridColumns", value: newValue }
            } as any);

            // Column span'leri yeniden hesapla
            const defaultSpan = Math.floor(newValue / gridColumns.length);
            const newColumnSpans = gridColumns.map(() => defaultSpan);
            
            handleOnChanges({
                target: { id: "columnSpans", value: newColumnSpans }
            } as any);
        }
    };

    // Column span'i güncelle
    const handleColumnSpanChange = (columnIndex: number, span: number) => {
        console.log("🔄 handleColumnSpanChange başladı:", { columnIndex, span });
        console.log("📊 Mevcut durum:", { 
            gridColumnsLength: gridColumns.length, 
            currentColumnSpans: columnSpans,
            localTotalColumns 
        });

        // Mevcut column spans'i al, yoksa default'ları oluştur
        const currentSpans = columnSpans.length > 0 
            ? [...columnSpans] 
            : gridColumns.map(() => Math.floor(localTotalColumns / gridColumns.length));
        
        console.log("📋 Current spans hesaplandı:", currentSpans);
        
        // Yetersiz uzunluktaysa doldur
        while (currentSpans.length < gridColumns.length) {
            currentSpans.push(Math.floor(localTotalColumns / gridColumns.length));
        }
        
        console.log("📋 Current spans dolduruldu:", currentSpans);
        
        // Sadece ilgili index'i güncelle
        currentSpans[columnIndex] = span;
        
        console.log("📋 Final spans:", currentSpans);
        console.log("🚀 handleOnChanges çağrılıyor (styles'a yazılacak)...");
        
        // Styles'a yaz (content'e değil!)
        handleOnChanges({
            target: { id: "columnSpans", value: currentSpans }
        } as any);

        console.log("✅ handleColumnSpanChange tamamlandı");
    };

    // Gap'i güncelle
    const handleGapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        console.log("🔄 handleGapChange başladı:", { value });
        console.log("📊 Mevcut durum:", { 
            currentGap: gap,
            localGap,
            gridColumnsLength: gridColumns.length 
        });
        
        setLocalGap(value);
        console.log("📋 Local gap güncellendi:", value);
        console.log("🚀 handleOnChanges çağrılıyor (styles'a yazılacak)...");
        
        // Styles'a yaz (content'e değil!)
        handleOnChanges({
            target: { id: "gridGap", value }
        } as any);

        // gap property'sini de güncelle
        handleOnChanges({
            target: { id: "gap", value }
        } as any);

        console.log("✅ handleGapChange tamamlandı");
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Column Count Control */}
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">Sütun Sayısı</Label>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleColumnCountChange('decrease')}
                        disabled={localColumnCount <= 1}
                    >
                        <Minus size={16} />
                    </Button>
                    <span className="flex-1 text-center font-medium">
                        {localColumnCount} Sütun
                    </span>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleColumnCountChange('increase')}
                        disabled={localColumnCount >= 12}
                    >
                        <Plus size={16} />
                    </Button>
                </div>
            </div>

            {/* Grid System */}
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">Grid Sistemi (Toplam Sütun)</Label>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGridColumnsChange('decrease')}
                        disabled={localTotalColumns <= 6}
                    >
                        <Minus size={16} />
                    </Button>
                    <span className="flex-1 text-center font-medium">
                        {localTotalColumns} Grid
                    </span>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGridColumnsChange('increase')}
                        disabled={localTotalColumns >= 24}
                    >
                        <Plus size={16} />
                    </Button>
                </div>
                <div className="text-xs text-muted-foreground">
                    Grid sistemi {localTotalColumns} eşit bölüme ayrılır
                </div>
            </div>

            {/* Column Widths */}
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">Sütun Genişlikleri</Label>
                <div className="space-y-3">
                    {gridColumns.map((column, index) => {
                        // Default span hesaplama: eşit dağıtım
                        const defaultSpan = Math.floor(localTotalColumns / gridColumns.length);
                        const currentSpan = (columnSpans.length > index && columnSpans[index]) ? columnSpans[index] : defaultSpan;
                        const percentage = Math.round((currentSpan / localTotalColumns) * 100);
                        
                        return (
                            <div key={column.id} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Sütun {index + 1}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {currentSpan}/{localTotalColumns} ({percentage}%)
                                    </span>
                                </div>
                                <Slider
                                    value={[currentSpan]}
                                    onValueChange={(value) => handleColumnSpanChange(index, value[0])}
                                    max={localTotalColumns}
                                    min={1}
                                    step={1}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>1 ({Math.round(100/localTotalColumns)}%)</span>
                                    <span>{localTotalColumns} (100%)</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Grid Gap */}
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">Sütunlar Arası Boşluk</Label>
                <Input
                    value={localGap}
                    onChange={handleGapChange}
                    placeholder="1rem"
                />
                <div className="text-xs text-muted-foreground">
                    Örnekler: 1rem, 16px, 1em, 2%
                </div>
            </div>

            {/* Responsive Info */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-800 mb-1">
                    📱 Responsive Davranış
                </div>
                <div className="text-xs text-blue-600 space-y-1">
                    <div>• <strong>Masaüstü:</strong> {localColumnCount} sütun ({localTotalColumns} grid)</div>
                    <div>• <strong>Tablet:</strong> Maksimum 2 sütun</div>
                    <div>• <strong>Mobil:</strong> Tek sütun (alt alta)</div>
                </div>
            </div>

            {/* Current Grid Summary */}
            <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-800 mb-1">
                    📊 Mevcut Düzen
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                    <div>Grid Sistemi: <span className="font-medium">{localTotalColumns} sütun</span></div>
                    <div>Aktif Sütun: <span className="font-medium">{localColumnCount}</span></div>
                    <div>Ortalama Genişlik: <span className="font-medium">{Math.floor(localTotalColumns / localColumnCount)} birim</span></div>
                    <div>Boşluk: <span className="font-medium">{localGap}</span></div>
                </div>
            </div>
        </div>
    )
}

export default GridLayoutCustomProperties