import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider';
import React from 'react'

type Props = {}

const TextCustomProperties = (props: Props) => {
    const { handleChangeCustomValues, getCurrentContent } = useEditorSidebar();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label htmlFor="innerText">Text Content</Label>
                <Input 
                    id="innerText" 
                    placeholder="Enter text content..." 
                    onChange={handleChangeCustomValues} 
                    value={getCurrentContent().innerText || ""} 
                />
            </div>
        </div>
    )
}

export default TextCustomProperties 