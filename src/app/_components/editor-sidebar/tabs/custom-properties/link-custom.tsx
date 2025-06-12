import { Input } from '@/components/ui/input'
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider';
import React from 'react'

type Props = {}

const LinkCustomProperties = (props: Props) => {

    const { handleChangeCustomValues, getCurrentContent } = useEditorSidebar();

    return (
        <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Link Path</p>
            <Input id="href" placeholder="https://domain.example.com/pathname" onChange={handleChangeCustomValues} value={getCurrentContent().href} />
        </div>
    )
}

export default LinkCustomProperties