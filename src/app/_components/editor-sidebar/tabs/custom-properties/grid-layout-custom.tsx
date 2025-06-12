import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider';
import React from 'react'

type Props = {}

const GridLayoutCustomProperties = (props: Props) => {

    const { handleChangeCustomValues, getCurrentContent } = useEditorSidebar();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Number of Columns</p>
                <Input
                    id="columns"
                    type="number"
                    placeholder="3"
                    min="1"
                    max="12"
                    onChange={handleChangeCustomValues}
                    value={getCurrentContent().columns || 3}
                />
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Grid Gap</p>
                <Select
                    onValueChange={(value) => handleChangeCustomValues({
                        target: { id: "gap", value }
                    } as any)}
                    value={getCurrentContent().gap || "1rem"}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select gap size" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0.25rem">0.25rem (4px)</SelectItem>
                        <SelectItem value="0.5rem">0.5rem (8px)</SelectItem>
                        <SelectItem value="1rem">1rem (16px)</SelectItem>
                        <SelectItem value="1.5rem">1.5rem (24px)</SelectItem>
                        <SelectItem value="2rem">2rem (32px)</SelectItem>
                        <SelectItem value="3rem">3rem (48px)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Minimum Column Width</p>
                <Input
                    id="minColumnWidth"
                    placeholder="200px"
                    onChange={handleChangeCustomValues}
                    value={getCurrentContent().minColumnWidth || "200px"}
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="autoFit"
                    checked={getCurrentContent().autoFit || false}
                    onChange={(e) => handleChangeCustomValues({
                        target: { id: "autoFit", value: e.target.checked }
                    } as any)}
                />
                <Label htmlFor="autoFit">Auto-fit columns</Label>
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Grid Template</p>
                <Select
                    onValueChange={(value) => {
                        const templates = {
                            "equal": { columns: getCurrentContent().columns || 3, template: "" },
                            "sidebar": { columns: 2, template: "1fr 300px" },
                            "hero": { columns: 2, template: "2fr 1fr" },
                            "thirds": { columns: 3, template: "1fr 2fr 1fr" },
                            "custom": { columns: getCurrentContent().columns || 3, template: getCurrentContent().template || "" }
                        };

                        const selected = templates[value as keyof typeof templates];
                        handleChangeCustomValues({
                            target: { id: "template", value: selected.template }
                        } as any);

                        if (value !== "custom") {
                            handleChangeCustomValues({
                                target: { id: "columns", value: selected.columns }
                            } as any);
                        }
                    }}
                    value={getCurrentContent().templateType || "equal"}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="equal">Equal Columns</SelectItem>
                        <SelectItem value="sidebar">Sidebar Layout</SelectItem>
                        <SelectItem value="hero">Hero Layout</SelectItem>
                        <SelectItem value="thirds">Hero + Sides</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {getCurrentContent().templateType === "custom" && (
                <div className="flex flex-col gap-2">
                    <p className="text-muted-foreground">Custom Template</p>
                    <Input
                        id="template"
                        placeholder="1fr 2fr 1fr"
                        onChange={handleChangeCustomValues}
                        value={getCurrentContent().template || ""}
                    />
                    <span className="text-xs text-muted-foreground">
                        Example: "1fr 2fr 1fr" or "200px 1fr 200px"
                    </span>
                </div>
            )}
        </div>
    )
}

export default GridLayoutCustomProperties