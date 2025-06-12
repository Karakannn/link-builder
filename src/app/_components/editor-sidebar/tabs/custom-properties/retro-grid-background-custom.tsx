import { Input } from '@/components/ui/input'
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider';
import React from 'react'

type Props = {}

const RetroGridBackgorundCustomProperties = (props: Props) => {

    const { handleChangeCustomValues, getCurrentContent } = useEditorSidebar();

    return (
        <>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Angle</p>
                <Input id="angle" type="number" placeholder="65" onChange={handleChangeCustomValues} value={getCurrentContent().angle} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Cell Size</p>
                <Input id="cellSize" type="number" placeholder="60" onChange={handleChangeCustomValues} value={getCurrentContent().cellSize} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Light Line Color</p>
                <Input id="lightLineColor" placeholder="gray" onChange={handleChangeCustomValues} value={getCurrentContent().lightLineColor} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Dark Line Color</p>
                <Input id="darkLineColor" placeholder="gray" onChange={handleChangeCustomValues} value={getCurrentContent().darkLineColor} />
            </div>
        </>
    )
}

export default RetroGridBackgorundCustomProperties