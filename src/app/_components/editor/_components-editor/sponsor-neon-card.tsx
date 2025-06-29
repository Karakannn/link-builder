"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useState, useEffect } from "react"
import { EditorElement, useEditor } from "@/providers/editor/editor-provider"
import { getElementStyles, getElementContent } from "@/lib/utils"
import Recursive from "./recursive"
import ElementContextMenu from "@/providers/editor/editor-contex-menu"
import BadgeElementName from "@/components/global/editor-element/badge-element-name"
import DeleteElementButton from "@/components/global/editor-element/delete-element-button"
import { SpacingVisualizer } from "@/components/global/spacing-visualizer"
import { SponsorNeonCard } from "@/components/ui/sponsor-neon-card"
import clsx from "clsx"
import { useLayout } from "@/hooks/use-layout"
import { useElementSelection } from "@/hooks/editor/use-element-selection"

interface Props {
  element: EditorElement
  layout?: 'vertical' | 'horizontal'
}

const SponsorNeonCardComponent = ({ element, layout = 'vertical' }: Props) => {
  const { state, dispatch } = useEditor()
  const { id, styles, content, type } = element
  const [showSpacingGuides, setShowSpacingGuides] = useState(false)
  const { getLayoutStyles } = useLayout()
  const { handleSelectElement } = useElementSelection(element)

  const sortable = useSortable({
    id: id,
    data: {
      type,
      name: "Sponsor Neon Card",
      element,
      elementId: id,
      isSidebarElement: false,
      isEditorElement: true,
    },
    disabled: state.editor.liveMode,
  })

  // Get computed styles based on current device
  const computedStyles = {
    ...getElementStyles(element, state.editor.device),
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  }

  // Get computed content based on current device
  const computedContent = getElementContent(element, state.editor.device)

  // Extract sponsor neon card properties from content (using defaults if not defined)
  const borderSize = computedContent.borderSize || 2;
  const borderRadius = computedContent.borderRadius || 12;
  const neonColor = computedContent.neonColor || "#ff00aa";
  const animationDelay = computedContent.animationDelay || 0;

  useEffect(() => {
    setShowSpacingGuides(
      state.editor.selectedElement.id === id && !state.editor.liveMode
    )
  }, [state.editor.selectedElement.id, id, state.editor.liveMode])

  if (sortable.isDragging) return null

  const setNodeRef = (node: HTMLDivElement | null) => {
    sortable.setNodeRef(node)
  }

  return (
    <ElementContextMenu element={element}>
      <div
        ref={setNodeRef}
        style={computedStyles}
        className={clsx("relative transition-all", {
          "!border-blue-500": state.editor.selectedElement.id === id,
          "!border-solid": state.editor.selectedElement.id === id,
          "!border-dashed border border-slate-300": !state.editor.liveMode,
          "cursor-grab": !state.editor.liveMode,
          "cursor-grabbing": sortable.isDragging,
          "opacity-50": sortable.isDragging,
        })}
        onClick={handleSelectElement}
        data-element-id={id}
        {...(!state.editor.liveMode ? sortable.listeners : {})}
        {...(!state.editor.liveMode ? sortable.attributes : {})}
      >
        {showSpacingGuides && (
          <SpacingVisualizer styles={computedStyles} />
        )}

        <SponsorNeonCard
          borderSize={borderSize}
          borderRadius={borderRadius}
          neonColor={neonColor}
          animationDelay={animationDelay}
          className="w-full min-h-[100px]"
        >
          {/* Render child elements with layout styles */}
          {Array.isArray(content) && content.length > 0 && (
            <div style={getLayoutStyles(layout)}>
              {content.map((childElement, index) => (
                <Recursive 
                  key={childElement.id} 
                  element={childElement} 
                  containerId={id}
                  index={index}
                  layout={layout}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {Array.isArray(content) && content.length === 0 && (
            <div className="min-h-[80px] text-gray-400 text-center py-4 flex items-center justify-center">
              Drop logo and text elements here
            </div>
          )}
        </SponsorNeonCard>
        
        <BadgeElementName element={element} />
        <DeleteElementButton element={element} />
      </div>
    </ElementContextMenu>
  )
}

export default SponsorNeonCardComponent 