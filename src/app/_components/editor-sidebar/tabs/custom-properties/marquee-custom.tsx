import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider';
import { Plus, Minus } from 'lucide-react';
import React from 'react'

type Props = {}

const MarqueeCustomProperties = (props: Props) => {
    const { handleChangeCustomValues, getCurrentContent } = useEditorSidebar();

    const handleAddMarqueeItem = () => {

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

    // Update marquee item handler
    const handleUpdateMarqueeItem = (index: number, field: string, value: any) => {

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

    // Remove marquee item handler
    const handleRemoveMarqueeItem = (index: number) => {

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

    return (
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
    )
}

export default MarqueeCustomProperties