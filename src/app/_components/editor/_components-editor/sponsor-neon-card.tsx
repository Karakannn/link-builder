"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useState, useEffect } from "react"
import { EditorElement, useEditor } from "@/providers/editor/editor-provider"
import { getElementStyles } from "@/lib/utils"
import Recursive from "./recursive"
import ElementContextMenu from "@/providers/editor/editor-contex-menu"
import BadgeElementName from "@/components/global/editor-element/badge-element-name"
import DeleteElementButton from "@/components/global/editor-element/delete-element-button"
import { SpacingVisualizer } from "@/components/global/spacing-visualizer"
import { SponsorNeonCard } from "@/components/ui/sponsor-neon-card"
import clsx from "clsx"
import { useElementActions } from "@/hooks/editor-actions/use-element-actions"
import { useElementBorderHighlight } from "@/hooks/editor/use-element-border-highlight"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { cn } from "@/lib/utils"

interface Props {
  element: EditorElement
  layout?: 'vertical' | 'horizontal'
}

const SponsorNeonCardComponent = ({ element, layout = 'vertical' }: Props) => {
  const { state } = useEditor()
  const { id, styles, content, type } = element
  const [showSpacingGuides, setShowSpacingGuides] = useState(false)
  const { selectElement } = useElementActions()
  const { getBorderClasses, handleMouseEnter, handleMouseLeave, isSelected } = useElementBorderHighlight(element)

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

  const computedStyles = {
    ...getElementStyles(element, state.editor.device),
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
  } as any;

  const borderSize = computedStyles.borderSize || 2;
  const borderRadius = computedStyles.borderRadius;
  const neonColor = computedStyles.neonColor || "#ff00aa";
  const animationDelay = computedStyles.animationDelay || 0;
  const animationType = computedStyles.animationType || "blink";
  const href = computedStyles.href || "";

  let parsedBorderRadius = 12;
  if (typeof borderRadius === 'string') {
    parsedBorderRadius = parseInt(borderRadius.replace('px', '')) || 12;
  } else if (typeof borderRadius === 'number') {
    parsedBorderRadius = borderRadius;
  }

  useEffect(() => {
    setShowSpacingGuides(
      state.editor.selectedElement.id === id && !state.editor.liveMode
    )
  }, [state.editor.selectedElement.id, id, state.editor.liveMode])

  if (sortable.isDragging) return null

  const childItems = Array.isArray(content) ? content.map(child => child.id) : [];

  return (
    <ElementContextMenu element={element}>
      <div
        ref={sortable.setNodeRef}
        style={computedStyles}
        className={clsx("relative z-10", getBorderClasses(), {
          "cursor-grabbing": sortable.isDragging,
          "opacity-50": sortable.isDragging,
        })}
        onClick={() => selectElement(element)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-element-id={id}
        {...(!state.editor.liveMode ? sortable.listeners : {})}
        {...(!state.editor.liveMode ? sortable.attributes : {})}
      >
        {showSpacingGuides && (
          <SpacingVisualizer styles={computedStyles} />
        )}

        <SponsorNeonCard
          borderSize={borderSize}
          borderRadius={parsedBorderRadius}
          neonColor={neonColor}
          animationDelay={animationDelay as number}
          animationType={animationType}
          href={href}
          className="w-full min-h-[100px]"
        >
          {/* Sadece child elementler */}
          {Array.isArray(content) && content.length > 0 && (
            <SortableContext items={childItems} strategy={verticalListSortingStrategy}>
              {content.map((childElement, index) => (
                <Recursive
                  key={childElement.id}
                  element={childElement}
                  containerId={id}
                  index={index}
                  layout={layout}
                />
              ))}
            </SortableContext>
          )}
        </SponsorNeonCard>

        <DeleteElementButton element={element} />
      </div>
    </ElementContextMenu>
  )
}

export default SponsorNeonCardComponent