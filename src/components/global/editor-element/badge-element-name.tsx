import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import React from 'react'

type Props = {
    element: EditorElement
}

const BadgeElementName = ({ element }: Props) => {

    const { state } = useEditor();

    return (
        <Badge
            className={cn("absolute bg-blue-700 text-white -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden z-10", {
                block: state.editor.selectedElement.id === element.id && !state.editor.liveMode,
            })}
        >
            {element.name}
        </Badge>
    )
}

export default BadgeElementName