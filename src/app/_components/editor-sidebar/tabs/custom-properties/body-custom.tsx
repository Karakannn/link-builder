import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider';
import { BACKGROUND_ANIMATIONS } from '@/constants/background-animations';
import React from 'react'

type Props = {}

const BodyCustomProperties = (props: Props) => {
    const { handleChangeCustomValues, getCurrentContent } = useEditorSidebar();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Background Animation</p>
                <Select 
                    value={getCurrentContent().backgroundAnimation || "none"} 
                    onValueChange={(value) => handleChangeCustomValues({
                        target: { id: "backgroundAnimation", value }
                    } as any)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select background animation" />
                    </SelectTrigger>
                    <SelectContent>
                        {BACKGROUND_ANIMATIONS.map((animation) => (
                            <SelectItem key={animation.id} value={animation.id}>
                                {animation.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

export default BodyCustomProperties 