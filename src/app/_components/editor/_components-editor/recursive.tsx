import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import React from "react";
import TextComponent from "./text";
import VideoComponent from "./video";
import LinkComponent from "./link";
import ShimmerButtonComponent from "./shimmer-button";

// Import new button components
import AnimatedShinyButtonComponent from "./animated-shiny-button";
import NeonGradientButtonComponent from "./neon-gradient-button";
import AnimatedBorderButtonComponent from "./animated-border-button";
import AnimatedTextButtonComponent from "./animated-text-button";

// Import card components
import NeonGradientCardComponent from "./neon-gradient-card";

// Import new background components
import AnimatedGridPatternComponent from "./animated-grid-pattern";
import InteractiveGridPatternComponent from "./interactive-grid-pattern";
import RetroGridComponent from "./retro-grid";
import DotPatternComponent from "./dot-pattern";

// Import marquee component
import MarqueeComponent from "./marquee";

// Import new layout and media components
import GifComponent from "./gif";
import { GridLayoutComponent } from "./grid-layout";
import { ColumnComponent } from "./column";
import { BodyContainer } from "./body";
import { Container } from "./container";
import { Layout, Position } from "./dropzone-wrapper";
import { ClosableContainer } from "../elements/closable-container";

// Import closable container component

type Props = {
  element: EditorElement;
  layout?: Layout;
  insertPosition?: Position;
  active?: boolean;
};

const Recursive = ({ element, layout = Layout.Vertical, insertPosition, active }: Props) => {
  const { state, dispatch } = useEditor();
  
  const handleElementClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!state.editor.liveMode) {
      dispatch({
        type: "CHANGE_CLICKED_ELEMENT",
        payload: {
          elementDetails: element,
        },
      });
    }
  };

  switch (element.type) {
    case "text":
      return <TextComponent element={element} />;
    case "container":
      return <Container element={element} layout={layout} insertPosition={insertPosition} active={active} />;
    case "closableContainer":
      return <ClosableContainer element={element} />;
    case "video":
      return <VideoComponent element={element} />;
    case "2Col":
      return <Container element={element} layout={Layout.Horizontal} insertPosition={insertPosition} active={active} />;
    case "__body":
      return <Container element={element} layout={layout} insertPosition={insertPosition} active={active} />;
    case "link":
      return <LinkComponent element={element} />;

    // Original button
    case "shimmerButton":
      return <ShimmerButtonComponent element={element} />;

    // New button components
    case "animatedShinyButton":
      return <AnimatedShinyButtonComponent element={element} />;
    case "neonGradientButton":
      return <NeonGradientButtonComponent element={element} />;
    case "animatedBorderButton":
      return <AnimatedBorderButtonComponent element={element} />;
    case "animatedTextButton":
      return <AnimatedTextButtonComponent element={element} />;

    // Card components
    case "neonGradientCard":
      return <NeonGradientCardComponent element={element} />;

    // Background components
    case "animatedGridPattern":
      return <AnimatedGridPatternComponent element={element} />;
    case "interactiveGridPattern":
      return <InteractiveGridPatternComponent element={element} />;
    case "retroGrid":
      return <RetroGridComponent element={element} />;
    case "dotPattern":
      return <DotPatternComponent element={element} />;

    // Marquee component
    case "marquee":
      return <MarqueeComponent element={element} />;

    // New layout and media components
    case "gridLayout":
      return <GridLayoutComponent element={element} />;
    case "column":
      return <ColumnComponent element={element} />;
    case "gif":
      return <GifComponent element={element} />;

    default:
      return null;
  }
};

export default Recursive;