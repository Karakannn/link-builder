"use client";

import React from "react";
import { useSelectedElement } from "@/providers/editor/editor-elements-provider";

import LinkCustomProperties from "./custom-properties/link-custom";
import GridLayoutCustomProperties from "./custom-properties/grid-layout-custom";
import GifCustomProperties from "./custom-properties/gif-custom";
import MarqueeCustomProperties from "./custom-properties/marquee-custom";
import BodyCustomProperties from "./custom-properties/body-custom";
import NeonCardCustomProperties from "./custom-properties/neon-card-custom";
import ImageCustom from "./custom-properties/image-custom";
import PulsatingButtonCustomProperties from "./custom-properties/pulsating-button-custom";
import TextCustomProperties from "./custom-properties/text-custom";
import AnimatedTextCustomProperties from "./custom-properties/animated-text-custom";

type CustomElementType =
  | "link"
  | "sponsorNeonCard"
  | "marquee"
  | "gridLayout"
  | "column"
  | "gif"
  | "image"
  | "pulsatingButton"
  | "text"
  | "animatedText"
  | "__body";

const customElementComponentMap: Record<CustomElementType, React.FC> = {
  link: LinkCustomProperties,
  sponsorNeonCard: NeonCardCustomProperties,
  marquee: MarqueeCustomProperties,
  gridLayout: GridLayoutCustomProperties,
  gif: GifCustomProperties,
  image: ImageCustom,
  pulsatingButton: PulsatingButtonCustomProperties,
  text: TextCustomProperties,
  animatedText: AnimatedTextCustomProperties,
  column: () => <div className="px-6 text-muted-foreground">Column properties managed by Grid Layout</div>,
  __body: BodyCustomProperties,
};

export const CustomTab = () => {

  const selectedElement = useSelectedElement();
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
