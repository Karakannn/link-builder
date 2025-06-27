import React, { Suspense } from "react";
import { EditorElement } from "@/providers/editor/editor-provider";
import { Layout } from "./dropzone-wrapper";
import { useLayout } from "@/hooks/use-layout";

const TextComponent = React.lazy(() => import("./text"));
const Container = React.lazy(() => import("./container").then(m => ({ default: m.Container })));
const ClosableContainer = React.lazy(() => import("../elements/closable-container").then(m => ({ default: m.ClosableContainer })));
const VideoComponent = React.lazy(() => import("./video"));
const TwoColumns = React.lazy(() => import("./container").then(m => ({ default: m.Container })));
const Body = React.lazy(() => import("./body").then(m => ({ default: m.BodyContainer })));
const LinkComponent = React.lazy(() => import("./link"));
const ShimmerButtonComponent = React.lazy(() => import("./shimmer-button"));
const AnimatedShinyButtonComponent = React.lazy(() => import("./animated-shiny-button"));
const NeonGradientButtonComponent = React.lazy(() => import("./neon-gradient-button"));
const AnimatedBorderButtonComponent = React.lazy(() => import("./animated-border-button"));
const AnimatedTextButtonComponent = React.lazy(() => import("./animated-text-button"));
const NeonCardComponent = React.lazy(() => import("./neon-card"));
const SponsorNeonCardComponent = React.lazy(() => import("./sponsor-neon-card"));

const MarqueeComponent = React.lazy(() => import("./marquee"));
const GridLayout = React.lazy(() => import("./grid-layout").then(m => ({ default: m.GridLayoutComponent })));
const Column = React.lazy(() => import("./column").then(m => ({ default: m.ColumnComponent })));
const GifComponent = React.lazy(() => import("./gif"));
const ImageComponent = React.lazy(() => import("./image"));

type Props = {
  element: EditorElement;
};

const Recursive = ({ element }: Props) => {
  const { getElementLayout } = useLayout();
  const layout = getElementLayout(element);

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
            layout={layout}
          />
        </Suspense>
      );
    case "closableContainer":
      return (
        <Suspense fallback={null}>
          <ClosableContainer element={element} layout={layout} />
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
          <TwoColumns element={element} layout={layout} />
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
    case "shimmerButton":
      return (
        <Suspense fallback={null}>
          <ShimmerButtonComponent element={element} />
        </Suspense>
      );
    case "animatedShinyButton":
      return (
        <Suspense fallback={null}>
          <AnimatedShinyButtonComponent element={element} />
        </Suspense>
      );
    case "neonGradientButton":
      return (
        <Suspense fallback={null}>
          <NeonGradientButtonComponent element={element} />
        </Suspense>
      );
    case "animatedBorderButton":
      return (
        <Suspense fallback={null}>
          <AnimatedBorderButtonComponent element={element} />
        </Suspense>
      );
    case "animatedTextButton":
      return (
        <Suspense fallback={null}>
          <AnimatedTextButtonComponent element={element} />
        </Suspense>
      );
    case "neonCard":
      return (
        <Suspense fallback={null}>
          <NeonCardComponent element={element} layout={layout} />
        </Suspense>
      );
    case "sponsorNeonCard":
      return (
        <Suspense fallback={null}>
          <SponsorNeonCardComponent element={element} layout={layout} />
        </Suspense>
      );
    case "marquee":
      return (
        <Suspense fallback={null}>
          <MarqueeComponent element={element} layout={layout} />
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