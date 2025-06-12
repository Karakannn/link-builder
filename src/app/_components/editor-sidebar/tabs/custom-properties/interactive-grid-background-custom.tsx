import { Input } from '@/components/ui/input'
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider';
import React from 'react'

type Props = {}

const InteractiveGridBackgroundCustomProperties = (props: Props) => {

    const { handleChangeCustomValues, getCurrentContent } = useEditorSidebar();

    return (
        <>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Cell Width</p>
                <Input id="width" type="number" placeholder="40" onChange={handleChangeCustomValues} value={getCurrentContent().width} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Cell Height</p>
                <Input id="height" type="number" placeholder="40" onChange={handleChangeCustomValues} value={getCurrentContent().height} />
            </div>
        </>
    )
}

export default InteractiveGridBackgroundCustomProperties