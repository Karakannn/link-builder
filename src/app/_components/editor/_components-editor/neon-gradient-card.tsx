import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import { getElementContent, getElementStyles } from "@/lib/utils";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { SpacingVisualizer } from "@/components/global/spacing-visualizer";
import DeleteElementButton from "@/components/global/editor-element/delete-element-button";
import BadgeElementName from "@/components/global/editor-element/badge-element-name";
import ElementContextMenu from "@/providers/editor/editor-contex-menu";

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
    if (!state.editor.liveMode && !draggable.isDragging) {
      dispatch({
        type: "CHANGE_CLICKED_ELEMENT",
        payload: {
          elementDetails: element,
        },
      });
    }
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
  const backgroundColor = cardProps.backgroundColor;
  const titleColor = cardProps.titleColor;
  const subtitleColor = cardProps.subtitleColor;

  // Container styles (outer wrapper)
  const containerStyles = {
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

  // Content layout styles (inner content container)
  const contentLayoutStyles = {
    display: 'flex',
    flexDirection: computedStyles.flexDirection || 'column',
    justifyContent: computedStyles.justifyContent || 'center',
    alignItems: computedStyles.alignItems || 'center',
    gap: computedStyles.gap || '8px',
    padding: computedStyles.padding || '12px',
    paddingTop: computedStyles.paddingTop,
    paddingRight: computedStyles.paddingRight,
    paddingBottom: computedStyles.paddingBottom,
    paddingLeft: computedStyles.paddingLeft,
    textAlign: computedStyles.textAlign || 'center',
    width: '100%',
    height: '100%',
  };

  // Typography styles for text elements (without color to let CSS variables work)
  const titleStyles = {
    fontSize: computedStyles.fontSize || '14px',
    fontWeight: computedStyles.fontWeight || 'bold',
    fontFamily: computedStyles.fontFamily,
    lineHeight: computedStyles.lineHeight || '1.2',
    letterSpacing: computedStyles.letterSpacing,
    textAlign: computedStyles.textAlign || 'center',
    margin: 0,
  };

  const subtitleStyles = {
    ...titleStyles,
    fontSize: computedStyles.fontSize ? `calc(${computedStyles.fontSize} * 0.8)` : '12px',
    fontWeight: computedStyles.fontWeight || '600',
  };

  useEffect(() => {
    setShowSpacingGuides(
      state.editor.selectedElement.id === id && !state.editor.liveMode
    );
  }, [state.editor.selectedElement.id, id, state.editor.liveMode]);

  const CardContent = () => (
    <div style={containerStyles}>
      <NeonGradientCard
        borderSize={borderSize}
        borderRadius={borderRadius}
        neonColors={{ firstColor, secondColor }}
        backgroundColor={backgroundColor}
        titleColor={titleColor}
        subtitleColor={subtitleColor}
        className={clsx("w-full h-full transition-all duration-300 ease-in-out", {
          "pointer-events-none": !state.editor.liveMode,
        })}
      >
        <div style={contentLayoutStyles as React.CSSProperties}>
          {/* Logo Section */}
          <div className="flex items-center justify-center">
            {cardLogo ? (
              <img 
                className="max-w-[80%] h-6 object-contain" 
                alt={cardTitle} 
                src={cardLogo}
                style={{ textAlign: 'center' }}
              />
            ) : (
              <div 
                className="max-w-[80%] h-6 bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-xs text-gray-500 dark:text-gray-400"
                style={{ textAlign: 'center' }}
              >
                Logo
              </div>
            )}
          </div>
          
          {/* Text Content */}
          <div className="relative z-20 w-full" style={{ textAlign: computedStyles.textAlign || 'center' }}>
            <h3 
              className="text-xs md:text-sm font-bold text-[var(--title-color)]"
              style={{
                ...titleStyles,
                position: 'relative',
                zIndex: 30,
              } as React.CSSProperties}
            >
              {cardTitle}
            </h3>
            <h3 
              className="text-[10px] md:text-xs font-bold text-[var(--subtitle-color)]"
              style={{
                ...subtitleStyles,
                position: 'relative',
                zIndex: 30,
              } as React.CSSProperties}
            >
              {cardSubtitle}
            </h3>
          </div>
        </div>
      </NeonGradientCard>
    </div>
  );

  return (
    <ElementContextMenu element={element}>
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
          className="flex items-center relative overflow-hidden cursor-pointer rounded-xl w-full h-full"
        >
          <CardContent />
        </a>
      ) : (
        <CardContent />
      )}

        <BadgeElementName element={element} />
        <DeleteElementButton element={element} />
        </div>
    </ElementContextMenu>
  );
};

export default NeonGradientCardComponent; 