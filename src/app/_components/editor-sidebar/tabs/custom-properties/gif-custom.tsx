import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider';
import React from 'react'

type Props = {}

const GifCustomProperties = (props: Props) => {

    const { handleChangeCustomValues, getCurrentContent, handleOnChanges, getCurrentStyles } = useEditorSidebar();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">GIF URL</p>
                <Input
                    id="src"
                    placeholder="https://example.com/animation.gif"
                    onChange={handleChangeCustomValues}
                    value={getCurrentContent().src || ""}
                />
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Alt Text</p>
                <Input
                    id="alt"
                    placeholder="Describe the GIF"
                    onChange={handleChangeCustomValues}
                    value={getCurrentContent().alt || ""}
                />
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Click URL</p>
                <Input
                    id="href"
                    placeholder="https://example.com"
                    onChange={handleChangeCustomValues}
                    value={getCurrentContent().href || ""}
                />
                <p className="text-xs text-muted-foreground">Optional: Add a link to make the GIF clickable</p>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="autoplay"
                    checked={getCurrentContent().autoplay !== false}
                    onChange={(e) => handleChangeCustomValues({
                        target: { id: "autoplay", value: e.target.checked }
                    } as any)}
                />
                <Label htmlFor="autoplay">Autoplay</Label>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="loop"
                    checked={getCurrentContent().loop !== false}
                    onChange={(e) => handleChangeCustomValues({
                        target: { id: "loop", value: e.target.checked }
                    } as any)}
                />
                <Label htmlFor="loop">Loop</Label>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="controls"
                    checked={getCurrentContent().controls || false}
                    onChange={(e) => handleChangeCustomValues({
                        target: { id: "controls", value: e.target.checked }
                    } as any)}
                />
                <Label htmlFor="controls">Show play/pause controls</Label>
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Loading Behavior</p>
                <Select
                    onValueChange={(value) => handleChangeCustomValues({
                        target: { id: "loading", value }
                    } as any)}
                    value={getCurrentContent().loading || "lazy"}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select loading behavior" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="lazy">Lazy (Load when visible)</SelectItem>
                        <SelectItem value="eager">Eager (Load immediately)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Object Fit</p>
                <Select
                    onValueChange={(value) => {
                        handleOnChanges({
                            target: { id: "objectFit", value }
                        } as any);
                    }}
                    value={getCurrentStyles().objectFit as string || "cover"}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select fit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="cover">Cover</SelectItem>
                        <SelectItem value="contain">Contain</SelectItem>
                        <SelectItem value="fill">Fill</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="scale-down">Scale Down</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex gap-4">
                <div className="flex flex-col gap-2">
                    <p className="text-muted-foreground">Max Width</p>
                    <Input
                        id="maxWidth"
                        placeholder="500px"
                        onChange={handleOnChanges}
                        value={getCurrentStyles().maxWidth || ""}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-muted-foreground">Max Height</p>
                    <Input
                        id="maxHeight"
                        placeholder="300px"
                        onChange={handleOnChanges}
                        value={getCurrentStyles().maxHeight || ""}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="rounded"
                    checked={(getCurrentStyles().borderRadius as string)?.includes('px') || false}
                    onChange={(e) => {
                        handleOnChanges({
                            target: {
                                id: "borderRadius",
                                value: e.target.checked ? "8px" : "0px"
                            }
                        } as any);
                    }}
                />
                <Label htmlFor="rounded">Rounded corners</Label>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="shadow"
                    checked={(getCurrentStyles().boxShadow as string)?.length > 0 || false}
                    onChange={(e) => {
                        handleOnChanges({
                            target: {
                                id: "boxShadow",
                                value: e.target.checked ? "0 4px 6px -1px rgb(0 0 0 / 0.1)" : "none"
                            }
                        } as any);
                    }}
                />
                <Label htmlFor="shadow">Drop shadow</Label>
            </div>
        </div>
    )
}

export default GifCustomProperties