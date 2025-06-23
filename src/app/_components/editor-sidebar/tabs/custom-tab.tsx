"use client";

import React from "react";
import { useEditor } from "@/providers/editor/editor-provider";

import LinkCustomProperties from "./custom-properties/link-custom";
import AnimatedButtonsCustomProperties from "./custom-properties/animated-button-custom";

import GridLayoutCustomProperties from "./custom-properties/grid-layout-custom";
import GifCustomProperties from "./custom-properties/gif-custom";
import MarqueeCustomProperties from "./custom-properties/marquee-custom";
import ShimmerButtonCustomProperties from "./custom-properties/shimmer-button-custom";
import BodyCustomProperties from "./custom-properties/body-custom";
import NeonCardCustomProperties from "./custom-properties/neon-card-custom";

type CustomElementType =
  | "link"
  | "shimmerButton"
  | "animatedShinyButton"
  | "animatedBorderButton"
  | "animatedTextButton"
  | "neonGradientButton"
  | "neonCard"
  | "marquee"
  | "gridLayout"
  | "column"
  | "gif"
  | "__body";

const customElementComponentMap: Record<CustomElementType, React.FC> = {
  link: LinkCustomProperties,
  shimmerButton: ShimmerButtonCustomProperties,
  animatedShinyButton: AnimatedButtonsCustomProperties,
  animatedBorderButton: AnimatedButtonsCustomProperties,
  animatedTextButton: AnimatedButtonsCustomProperties,
  neonGradientButton: AnimatedButtonsCustomProperties,
  neonCard: NeonCardCustomProperties,
  marquee: MarqueeCustomProperties,
  gridLayout: GridLayoutCustomProperties,
  gif: GifCustomProperties,
  column: () => <div className="px-6 text-muted-foreground">Column properties managed by Grid Layout</div>,
  __body: BodyCustomProperties,
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
