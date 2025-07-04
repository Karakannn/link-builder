import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider';
import { useEditor } from '@/providers/editor/editor-provider';
import { Plus, Minus } from 'lucide-react';
import { v4 } from "uuid";
import { defaultStyles } from "@/lib/constants";

const GridLayoutCustomProperties = () => {
    const { handleOnChanges, getCurrentStyles } = useEditorSidebar();
    const { state, dispatch } = useEditor();

    const element = state.editor.selectedElement;
    const content = Array.isArray(element.content) ? element.content : [];
    const styles = getCurrentStyles(); // Bu artık responsive styles'ı da içeriyor
    const spans = (styles as any).columnSpans || [];
    const gap = (styles as any).gridGap || styles.gap || "1rem";
    const currentDevice = state.editor.device;

    // Device'a göre maksimum sütun sayısı
    const getMaxColumns = () => {
        switch (currentDevice) {
            case "Mobile":
                return 1;
            case "Tablet":
                return 2;
            case "Desktop":
                return 12;
            default:
                return 12;
        }
    };

    // Varsayılan span değeri
    const getDefaultSpan = () => {
        return Math.floor(12 / Math.max(content.length, 1));
    };

    const maxColumns = getMaxColumns();
    const defaultSpan = getDefaultSpan();

    const updateElement = (newContent: any[], newSpans: number[]) => {
        dispatch({
            type: "UPDATE_ELEMENT",
            payload: {
                elementDetails: {
                    ...element,
                    content: newContent,
                    styles: { ...element.styles, columnSpans: newSpans } as any
                }
            }
        });
    };

    const addColumn = () => {
        if (content.length >= maxColumns) return;
        const newColumn = { 
            id: v4(), 
            name: `Sütun ${content.length + 1}`, 
            content: [], 
            styles: { ...defaultStyles }, 
            type: "column" as const 
        };
        updateElement([...content, newColumn], [...spans, defaultSpan]);
    };

    const removeColumn = () => {
        if (content.length <= 1) return;
        updateElement(content.slice(0, -1), spans.slice(0, -1));
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">Cihaz: {currentDevice}</Label>
                <Label className="text-muted-foreground">Sütun Sayısı</Label>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={removeColumn} disabled={content.length <= 1}>
                        <Minus size={16} />
                    </Button>
                    <span className="flex-1 text-center font-medium">
                        {content.length} Sütun
                    </span>
                    <Button size="sm" variant="outline" onClick={addColumn} disabled={content.length >= maxColumns}>
                        <Plus size={16} />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">Boşluk</Label>
                <Input 
                    value={gap} 
                    onChange={(e) => {
                        const gapValue = e.target.value;
                        
                        // Responsive styles sistemini kullan
                        if (currentDevice === "Desktop") {
                            dispatch({
                                type: "UPDATE_ELEMENT",
                                payload: {
                                    elementDetails: {
                                        ...element,
                                        styles: {
                                            ...element.styles,
                                            gridGap: gapValue,
                                            gap: gapValue,
                                        },
                                    },
                                },
                            });
                        } else {
                            // Tablet/Mobile için responsive styles güncelle
                            const currentResponsiveStyles = element.responsiveStyles || {};
                            dispatch({
                                type: "UPDATE_ELEMENT",
                                payload: {
                                    elementDetails: {
                                        ...element,
                                        responsiveStyles: {
                                            ...currentResponsiveStyles,
                                            [currentDevice]: {
                                                ...currentResponsiveStyles[currentDevice],
                                                gridGap: gapValue,
                                                gap: gapValue,
                                            },
                                        },
                                    },
                                },
                            });
                        }
                    }} 
                    placeholder="1rem" 
                />
            </div>

            {content.length > 1 && (
                <div className="flex flex-col gap-2">
                    <Label className="text-muted-foreground">
                        Sütun Genişlikleri ({currentDevice})
                    </Label>
                    <div className="space-y-3">
                        {content.map((_, i) => {
                            const span = spans[i] || defaultSpan;
                            const percent = Math.round((span / 12) * 100);
                            
                            return (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Sütun {i + 1}</span>
                                        <span className="text-sm text-muted-foreground">{span}/12 ({percent}%)</span>
                                    </div>
                                    <Slider 
                                        value={[span]} 
                                        onValueChange={(v) => {
                                            const newSpans = [...spans];
                                            newSpans[i] = v[0];
                                            
                                            // Responsive styles sistemini kullan
                                            if (currentDevice === "Desktop") {
                                                updateElement(content, newSpans);
                                            } else {
                                                // Tablet/Mobile için responsive styles güncelle
                                                const currentResponsiveStyles = element.responsiveStyles || {};
                                                dispatch({
                                                    type: "UPDATE_ELEMENT",
                                                    payload: {
                                                        elementDetails: {
                                                            ...element,
                                                            responsiveStyles: {
                                                                ...currentResponsiveStyles,
                                                                [currentDevice]: {
                                                                    ...currentResponsiveStyles[currentDevice],
                                                                    columnSpans: newSpans,
                                                                },
                                                            },
                                                        },
                                                    },
                                                });
                                            }
                                        }} 
                                        max={12} 
                                        min={1} 
                                        step={1} 
                                        className="w-full" 
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>1 (8%)</span><span>12 (100%)</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default GridLayoutCustomProperties