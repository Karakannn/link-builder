"use client";

import React from "react";
import { useEditor } from "@/providers/editor/editor-provider";

import LinkCustomProperties from "./custom-properties/link-custom";
import AnimatedButtonsCustomProperties from "./custom-properties/animated-button-custom";
import NeonGradientCardCustomProperties from "./custom-properties/neon-gradient-card-custom";
import GridLayoutCustomProperties from "./custom-properties/grid-layout-custom";
import GifCustomProperties from "./custom-properties/gif-custom";
import MarqueeCustomProperties from "./custom-properties/marquee-custom";
import AnimatedGridBackgroundCustomProperties from "./custom-properties/animated-grid-background-custom";
import RetroGridBackgroundCustomProperties from "./custom-properties/retro-grid-background-custom";
import DotPatternBackgroundCustomProperties from "./custom-properties/dot-pattern-background-custom";
import InteractiveGridBackgroundCustomProperties from "./custom-properties/interactive-grid-background-custom";
import ShimmerButtonCustomProperties from "./custom-properties/shimmer-button-custom";

type CustomElementType =
  | "link"
  | "shimmerButton"
  | "animatedShinyButton"
  | "animatedBorderButton"
  | "animatedTextButton"
  | "neonGradientButton"
  | "neonGradientCard"
  | "marquee"
  | "animatedGridPattern"
  | "retroGrid"
  | "dotPattern"
  | "interactiveGridPattern"
  | "gridLayout"
  | "column"
  | "gif";

const customElementComponentMap: Record<CustomElementType, React.FC> = {
  link: LinkCustomProperties,
  shimmerButton: ShimmerButtonCustomProperties,
  animatedShinyButton: AnimatedButtonsCustomProperties,
  animatedBorderButton: AnimatedButtonsCustomProperties,
  animatedTextButton: AnimatedButtonsCustomProperties,
  neonGradientButton: NeonGradientCardCustomProperties,
  neonGradientCard: NeonGradientCardCustomProperties,
  marquee: MarqueeCustomProperties,
  animatedGridPattern: AnimatedGridBackgroundCustomProperties,
  retroGrid: RetroGridBackgroundCustomProperties,
  dotPattern: DotPatternBackgroundCustomProperties,
  interactiveGridPattern: InteractiveGridBackgroundCustomProperties,
  gridLayout: GridLayoutCustomProperties,
  gif: GifCustomProperties,
  column: () => <div className="px-6 text-muted-foreground">Column properties managed by Grid Layout</div>,
};

export const CustomTab = () => {
  const { state } = useEditor();

  const selectedElement = state.editor.selectedElement;
  const elementType = selectedElement?.type as CustomElementType;

  if (!elementType || !customElementComponentMap[elementType]) {
    return <div className="px-6 text-red-500">Element type not found or not supported.</div>;
  }

  const ElementComponent = customElementComponentMap[elementType];

  return (
    <div className="px-6">
      <ElementComponent />
    </div>
  );
};
