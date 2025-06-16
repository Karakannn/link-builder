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
    const styles = getCurrentStyles();
    const spans = (styles as any).columnSpans || [];
    const gap = (styles as any).gridGap || styles.gap || "1rem";

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
        if (content.length >= 12) return;
        const newColumn = { id: v4(), name: `Sütun ${content.length + 1}`, content: [], styles: { ...defaultStyles, minHeight: "120px" }, type: "column" as const };
        updateElement([...content, newColumn], [...spans, 4]);
    };

    const removeColumn = () => {
        if (content.length <= 1) return;
        updateElement(content.slice(0, -1), spans.slice(0, -1));
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">Sütun Sayısı</Label>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={removeColumn} disabled={content.length <= 1}><Minus size={16} /></Button>
                    <span className="flex-1 text-center font-medium">{content.length} Sütun</span>
                    <Button size="sm" variant="outline" onClick={addColumn} disabled={content.length >= 12}><Plus size={16} /></Button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Label className="text-muted-foreground">Boşluk</Label>
                <Input value={gap} onChange={(e) => {
                    handleOnChanges({ target: { id: "gridGap", value: e.target.value } } as any);
                    handleOnChanges({ target: { id: "gap", value: e.target.value } } as any);
                }} placeholder="1rem" />
            </div>

            {content.length > 1 && (
                <div className="flex flex-col gap-2">
                    <Label className="text-muted-foreground">Sütun Genişlikleri</Label>
                    <div className="space-y-3">
                        {content.map((_, i) => {
                            const span = spans[i] || 4;
                            const percent = Math.round((span / 12) * 100);
                            
                            return (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Sütun {i + 1}</span>
                                        <span className="text-sm text-muted-foreground">{span}/12 ({percent}%)</span>
                                    </div>
                                    <Slider value={[span]} onValueChange={(v) => {
                                        const newSpans = [...spans];
                                        newSpans[i] = v[0];
                                        updateElement(content, newSpans);
                                    }} max={12} min={1} step={1} className="w-full" />
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