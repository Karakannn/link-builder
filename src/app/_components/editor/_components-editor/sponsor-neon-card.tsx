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

  // Extract sponsor neon card properties from customProperties (using defaults if not defined)
  const customProps = element.customProperties || {};
  const borderSize = customProps.borderSize || 2;
  const borderRadius = customProps.borderRadius || 12;
  const neonColor = customProps.neonColor || "#ff00aa";
  const animationDelay = customProps.animationDelay || 0;
  
  // Content properties from custom properties
  const imageUrl = customProps.imageUrl || "/file.svg";
  const title = customProps.title || "Sponsor Title";
  const description = customProps.description || "Sponsored content";

  useEffect(() => {
    setShowSpacingGuides(
      state.editor.selectedElement.id === id && !state.editor.liveMode
    )
  }, [state.editor.selectedElement.id, id, state.editor.liveMode])

  // Force re-render when custom properties change
  useEffect(() => {
    // This effect will trigger re-render when customProperties change
  }, [element.customProperties])

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
          {/* Custom content from custom properties - always show */}
          <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
            {/* Image */}
            {imageUrl && (
              <div className="relative w-16 h-16 mb-2">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/file.svg";
                  }}
                />
              </div>
            )}
            
            {/* Title */}
            {title && (
              <h3 
                className="text-lg font-bold"
                style={{ color: neonColor }}
              >
                {title}
              </h3>
            )}
            
            {/* Description */}
            {description && (
              <p className="text-sm text-white opacity-90">
                {description}
              </p>
            )}
          </div>

          {/* Render child elements with layout styles - overlay on top */}
          {Array.isArray(content) && content.length > 0 && (
            <div 
              style={getLayoutStyles(layout)}
              className="absolute inset-0 pointer-events-none"
            >
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
        </SponsorNeonCard>
        
        <BadgeElementName element={element} />
        <DeleteElementButton element={element} />
      </div>
    </ElementContextMenu>
  )
}

export default SponsorNeonCardComponent 