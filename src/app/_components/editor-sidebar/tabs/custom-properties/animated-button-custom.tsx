import { Input } from '@/components/ui/input';
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider';
import React from 'react'

type Props = {}

const AnimatedButtonsCustomProperties = (props: Props) => {

    const { handleChangeCustomValues, getCurrentContent } = useEditorSidebar();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Button Text</p>
                <Input id="innerText" placeholder="Button Text" onChange={handleChangeCustomValues} value={getCurrentContent().innerText} />
            </div>
        </div>
    )
}

export default AnimatedButtonsCustomProperties