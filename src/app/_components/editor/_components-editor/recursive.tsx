import React, { Suspense } from "react";
import { EditorElement } from "@/providers/editor/editor-provider";
import { useLayout, Layout } from "@/hooks/use-layout";

const TextComponent = React.lazy(() => import("./text"));
const Container = React.lazy(() => import("./container").then(m => ({ default: m.Container })));
const ClosableContainer = React.lazy(() => import("../elements/closable-container").then(m => ({ default: m.ClosableContainer })));
const VideoComponent = React.lazy(() => import("./video"));
const TwoColumns = React.lazy(() => import("./container").then(m => ({ default: m.Container })));
const Body = React.lazy(() => import("./body").then(m => ({ default: m.BodyContainer })));
const LinkComponent = React.lazy(() => import("./link"));
const NeonCardComponent = React.lazy(() => import("./neon-card"));
const SponsorNeonCardComponent = React.lazy(() => import("./sponsor-neon-card"));

const MarqueeComponent = React.lazy(() => import("./marquee"));
const GridLayout = React.lazy(() => import("./grid-layout").then(m => ({ default: m.GridLayoutComponent })));
const Column = React.lazy(() => import("./column").then(m => ({ default: m.ColumnComponent })));
const GifComponent = React.lazy(() => import("./gif"));
const ImageComponent = React.lazy(() => import("./image"));

type Props = {
  element: EditorElement;
  containerId?: string;
  index?: number;
  layout?: Layout;
};

const Recursive = ({ element, containerId, index = 0, layout }: Props) => {
  const { getElementLayout } = useLayout();
  const elementLayout = layout || getElementLayout(element);

  switch (element.type) {
    case "text":
      return (
        <Suspense fallback={null}>
          <TextComponent element={element} />
        </Suspense>
      );
    case "container":
      return (
        <Suspense fallback={null}>
          <Container 
            element={element} 
            layout={elementLayout}
          />
        </Suspense>
      );
    case "closableContainer":
      return (
        <Suspense fallback={null}>
          <ClosableContainer element={element} layout={elementLayout} />
        </Suspense>
      );
    case "video":
      return (
        <Suspense fallback={null}>
          <VideoComponent element={element} />
        </Suspense>
      );
    case "2Col":
      return (
        <Suspense fallback={null}>
          <TwoColumns element={element} layout={elementLayout} />
        </Suspense>
      );
    case "__body":
      return (
        <Suspense fallback={null}>
          <Body element={element} />
        </Suspense>
      );
    case "link":
      return (
        <Suspense fallback={null}>
          <LinkComponent element={element} />
        </Suspense>
      );
    case "neonCard":
      return (
        <Suspense fallback={null}>
          <NeonCardComponent element={element} layout={elementLayout} />
        </Suspense>
      );
    case "sponsorNeonCard":
      return (
        <Suspense fallback={null}>
          <SponsorNeonCardComponent element={element} layout={elementLayout} />
        </Suspense>
      );
    case "marquee":
      return (
        <Suspense fallback={null}>
          <MarqueeComponent element={element} layout={elementLayout} />
        </Suspense>
      );
    case "gridLayout":
      return (
        <Suspense fallback={null}>
          <GridLayout element={element} />
        </Suspense>
      );
    case "column":
      return (
        <Suspense fallback={null}>
          <Column element={element} />
        </Suspense>
      );
    case "gif":
      return (
        <Suspense fallback={null}>
          <GifComponent element={element} />
        </Suspense>
      );
    case "image":
      return (
        <Suspense fallback={null}>
          <ImageComponent element={element} />
        </Suspense>
      );
    default:
      return null;
  }
};

export default Recursive;