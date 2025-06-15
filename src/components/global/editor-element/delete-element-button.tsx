import { useElementDeletion } from '@/hooks/editor/use-element-deletion';
import { EditorElement, useEditor } from '@/providers/editor/editor-provider';
import { Trash } from 'lucide-react';
import React from 'react'

type Props = {
  element: EditorElement
}

const DeleteElementButton = ({ element }: Props) => {

  const { handleDelete } = useElementDeletion(element, true);
  const { state } = useEditor();

  return (

    state.editor.selectedElement.id === element.id && !state.editor.liveMode && state.editor.selectedElement.type !== "__body" && (
      <div className="absolute bg-red-700 px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg z-10">
        <Trash size={16} onClick={handleDelete} className="cursor-pointer" />
      </div>
    )
  )
}

export default DeleteElementButton