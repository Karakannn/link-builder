import { Input } from '@/components/ui/input'
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider';
import React from 'react'

type Props = {}

const DotPatternBackgroundCustomProperties = (props: Props) => {

    const { handleChangeCustomValues, getCurrentContent } = useEditorSidebar();

    return (
        <>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Pattern Width</p>
                <Input id="width" type="number" placeholder="16" onChange={handleChangeCustomValues} value={getCurrentContent().width} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Pattern Height</p>
                <Input id="height" type="number" placeholder="16" onChange={handleChangeCustomValues} value={getCurrentContent().height} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Circle Radius</p>
                <Input id="cr" type="number" placeholder="1" onChange={handleChangeCustomValues} value={getCurrentContent().cr} />
            </div>
        </>
    )
}

export default DotPatternBackgroundCustomProperties