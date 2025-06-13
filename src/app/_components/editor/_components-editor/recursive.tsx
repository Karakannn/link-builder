import { EditorElement } from "@/providers/editor/editor-provider";
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
import { Container } from "./container";
import { ColumnComponent } from "./column";

type Props = {
  element: EditorElement;
};

const Recursive = ({ element }: Props) => {
  switch (element.type) {
    case "text":
      return <TextComponent element={element} />;
    case "container":
      return <Container element={element} />;
    case "video":
      return <VideoComponent element={element} />;
    case "2Col":
      return <Container element={element} />;
    case "__body":
      return <Container element={element} />;
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
