// src/app/_components/editor/_components-editor/recursive.tsx
import React, { Profiler, Suspense, memo } from "react";
import { EditorElement } from "@/providers/editor/editor-provider";
import { useLayout, Layout } from "@/hooks/use-layout";
import { onRenderCallback } from "@/lib/utils";

const TextComponent = React.lazy(() => import("./text"));
const Container = React.lazy(() => import("./container").then(m => ({ default: m.Container })));
const ClosableContainer = React.lazy(() => import("../elements/closable-container").then(m => ({ default: m.ClosableContainer })));
const VideoComponent = React.lazy(() => import("./video"));
const TwoColumns = React.lazy(() => import("./container").then(m => ({ default: m.Container })));
const Body = React.lazy(() => import("./body").then(m => ({ default: m.BodyContainer })));
const LinkComponent = React.lazy(() => import("./link"));
const SponsorNeonCardComponent = React.lazy(() => import("./sponsor-neon-card"));
const GridLayout = React.lazy(() => import("./grid-layout").then(m => ({ default: m.GridLayoutComponent })));
const MarqueeComponent = React.lazy(() => import("./marquee"));
const Column = React.lazy(() => import("./column").then(m => ({ default: m.ColumnComponent })));
const GifComponent = React.lazy(() => import("./gif"));
const ImageComponent = React.lazy(() => import("./image"));
const PulsatingButtonComponent = React.lazy(() => import("./pulsating-button"));

type Props = {
  element: EditorElement;
  containerId?: string;
  index?: number;
  layout?: Layout;
};

// Element karşılaştırma fonksiyonu
const areElementsEqual = (prevProps: Props, nextProps: Props) => {
  // Element ID'si değişmişse re-render
  if (prevProps.element.id !== nextProps.element.id) return false;

  // Styles değişmişse re-render
  if (JSON.stringify(prevProps.element.styles) !== JSON.stringify(nextProps.element.styles)) return false;

  // Content değişmişse re-render
  if (JSON.stringify(prevProps.element.content) !== JSON.stringify(nextProps.element.content)) return false;

  // Layout değişmişse re-render
  if (prevProps.layout !== nextProps.layout) return false;

  // Type değişmişse re-render
  if (prevProps.element.type !== nextProps.element.type) return false;

  return true;
};

const Recursive = memo(({ element, containerId, index = 0, layout }: Props) => {
  const { getElementLayout } = useLayout();
  const elementLayout = layout || getElementLayout(element);

  const renderElement = () => {
    switch (element.type) {
      case "text":
        return <TextComponent element={element} />;
      case "container":
        return <Container element={element} layout={elementLayout} />;
      case "closableContainer":
        return <ClosableContainer element={element} layout={elementLayout} />;
      case "video":
        return <VideoComponent element={element} />;
      case "2Col":
        return <TwoColumns element={element} layout={elementLayout} />;
      case "__body":
        return <Body element={element} />;
      case "link":
        return <LinkComponent element={element} />;
      case "sponsorNeonCard":
        return <SponsorNeonCardComponent element={element} layout={elementLayout} />;
      case "marquee":
        return <MarqueeComponent element={element} layout={elementLayout} />;
      case "gridLayout":
        return <GridLayout element={element} />;
      case "column":
        return <Column element={element} />;
      case "gif":
        return <GifComponent element={element} />;
      case "image":
        return <ImageComponent element={element} />;
      case "pulsatingButton":
        return <PulsatingButtonComponent element={element} />;
      default:
        return null;
    }
  };

  return (

    <Suspense fallback={<div className="animate-pulse bg-gray-200 h-8 rounded" />}>
      <Profiler id={`Recursive-${element.type}`} onRender={onRenderCallback}> {renderElement()} </Profiler>
    </Suspense>
  );
}, areElementsEqual);

Recursive.displayName = 'Recursive';

export default Recursive;