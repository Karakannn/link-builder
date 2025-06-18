import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import { Trash } from "lucide-react";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { getElementContent, getElementStyles } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";

type Props = {
  element: EditorElement;
};

const NeonGradientCardComponent = ({ element }: Props) => {
  const { state, dispatch } = useEditor();
  const { id, styles, content, type } = element;
  const [showSpacingGuides, setShowSpacingGuides] = useState(false);

  // dnd-kit draggable
  const draggable = useDraggable({
    id: `draggable-${id}`,
    data: {
      type: "neonGradientCard",
      elementId: id,
      name: "Neon Gradient Card",
      isSidebarElement: false,
      isEditorElement: true,
    },
    disabled: state.editor.liveMode,
  });

  // Get computed styles based on current device
  const computedStyles = getElementStyles(element, state.editor.device);

  // Get computed content based on current device
  const computedContent = getElementContent(element, state.editor.device);

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("NeonGradientCard clicked:", id, "isDragging:", draggable.isDragging, "liveMode:", state.editor.liveMode);
    if (!state.editor.liveMode && !draggable.isDragging) {
      console.log("Selecting neon gradient card:", id);
      dispatch({
        type: "CHANGE_CLICKED_ELEMENT",
        payload: {
          elementDetails: element,
        },
      });
    }
  };

  const handleDeleteElement = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };

  // Extract card specific props from content with defaults
  const cardProps = !Array.isArray(computedContent) ? computedContent : {};
  const cardTitle = cardProps.title || "LinkBet";
  const cardSubtitle = cardProps.subtitle || "999₺ Deneme Bonusu";
  const cardLogo = cardProps.logo || "";
  const cardHref = cardProps.href || "#";
  const firstColor = cardProps.firstColor || "#ff00aa";
  const secondColor = cardProps.secondColor || "#00FFF1";
  const borderSize = cardProps.borderSize || 2;
  const borderRadius = cardProps.borderRadius || 20;

  // Separate layout/dimension styles from typography styles
  const layoutStyles = {
    width: computedStyles.width,
    height: computedStyles.height,
    minWidth: computedStyles.minWidth,
    minHeight: computedStyles.minHeight,
    maxWidth: computedStyles.maxWidth,
    maxHeight: computedStyles.maxHeight,
    margin: computedStyles.margin,
    marginTop: computedStyles.marginTop,
    marginRight: computedStyles.marginRight,
    marginBottom: computedStyles.marginBottom,
    marginLeft: computedStyles.marginLeft,
  };

  const typographyStyles = {
    fontSize: computedStyles.fontSize,
    fontWeight: computedStyles.fontWeight,
    color: computedStyles.color,
    fontFamily: computedStyles.fontFamily,
    textAlign: computedStyles.textAlign,
    lineHeight: computedStyles.lineHeight,
    letterSpacing: computedStyles.letterSpacing,
  };

  useEffect(() => {
    setShowSpacingGuides(
      state.editor.selectedElement.id === id && !state.editor.liveMode
    );
  }, [state.editor.selectedElement.id, id, state.editor.liveMode]);

  const CardContent = () => (
    <div style={layoutStyles}>
      <NeonGradientCard
        borderSize={borderSize}
        borderRadius={borderRadius}
        neonColors={{ firstColor, secondColor }}
        className={clsx("w-full transition-all duration-300 ease-in-out", {
          "pointer-events-none": !state.editor.liveMode,
        })}
      >
        <div 
          className="flex flex-col items-center justify-center p-1 md:p-3 gap-2"
          style={{
            justifyContent: computedStyles.justifyContent,
            alignItems: computedStyles.alignItems,
            flexDirection: computedStyles.flexDirection as any,
            gap: computedStyles.gap,
            padding: computedStyles.padding,
            paddingTop: computedStyles.paddingTop,
            paddingRight: computedStyles.paddingRight,
            paddingBottom: computedStyles.paddingBottom,
            paddingLeft: computedStyles.paddingLeft,
          }}
        >
          {/* Logo Section */}
          <div className="flex items-center justify-center w-full">
            {cardLogo ? (
              <img 
                className="max-w-[80%] h-6 object-contain" 
                alt={cardTitle} 
                src={cardLogo}
              />
            ) : (
              <div className="max-w-[80%] h-6 bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                Logo
              </div>
            )}
          </div>
          
          {/* Text Content */}
          <div className="relative z-20">
            <h3 
              className="text-xs md:text-sm text-center font-bold text-gray-900 dark:text-gray-100"
              style={typographyStyles}
            >
              {cardTitle}
            </h3>
            <h3 
              className="text-[10px] md:text-xs text-center font-bold text-gray-600 dark:text-gray-400"
              style={{
                ...typographyStyles,
                fontSize: typographyStyles.fontSize ? `calc(${typographyStyles.fontSize} * 0.8)` : undefined,
                color: typographyStyles.color ? `${typographyStyles.color}80` : undefined,
              }}
            >
              {cardSubtitle}
            </h3>
          </div>
        </div>
      </NeonGradientCard>
    </div>
  );

  return (
    <div
      ref={draggable.setNodeRef}
      style={computedStyles}
      className={clsx("relative transition-all", {
        "!border-blue-500": state.editor.selectedElement.id === id,
        "!border-solid": state.editor.selectedElement.id === id,
        "!border-dashed border border-slate-300": !state.editor.liveMode,
        "cursor-grab": !state.editor.liveMode,
        "cursor-grabbing": draggable.isDragging,
        "opacity-50": draggable.isDragging,
      })}
      onClick={handleOnClickBody}
      {...(!state.editor.liveMode ? draggable.listeners : {})}
      {...(!state.editor.liveMode ? draggable.attributes : {})}
    >
      {showSpacingGuides && (
        <SpacingVisualizer styles={computedStyles} />
      )}

      {state.editor.liveMode && cardHref && cardHref !== "#" ? (
        <a 
          href={cardHref} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center relative overflow-hidden cursor-pointer rounded-xl"
        >
          <CardContent />
        </a>
      ) : (
        <CardContent />
      )}

      {state.editor.selectedElement.id === id && !state.editor.liveMode && (
        <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
          <Trash className="cursor-pointer z-50" size={16} onClick={handleDeleteElement} />
        </div>
      )}
    </div>
  );
};

export default NeonGradientCardComponent; 