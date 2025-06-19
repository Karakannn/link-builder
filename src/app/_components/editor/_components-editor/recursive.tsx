import { EditorElement } from "@/providers/editor/editor-provider";
import TextComponent from "./text";
import { Container } from "./container";
import { ClosableContainer } from "../elements/closable-container";
import VideoComponent from "./video";
import { Container as TwoColumns } from "./container";
import { BodyContainer as Body } from "./body";
import LinkComponent from "./link";
import ShimmerButtonComponent from "./shimmer-button";
import AnimatedShinyButtonComponent from "./animated-shiny-button";
import NeonGradientButtonComponent from "./neon-gradient-button";
import AnimatedBorderButtonComponent from "./animated-border-button";
import AnimatedTextButtonComponent from "./animated-text-button";
import NeonGradientCardComponent from "./neon-gradient-card";
import AnimatedGridPatternComponent from "./animated-grid-pattern";
import RetroGridComponent from "./retro-grid";
import DotPatternComponent from "./dot-pattern";
import MarqueeComponent from "./marquee";
import { GridLayoutComponent as GridLayout } from "./grid-layout";
import { ColumnComponent as Column } from "./column";
import GifComponent from "./gif";

type Props = {
  element: EditorElement;
};

const Recursive = ({ element }: Props) => {
  switch (element.type) {
    case "text":
      return <TextComponent element={element} />;
    case "container":
      return <Container element={element} />;
    case "closableContainer":
      return <ClosableContainer element={element} />;
    case "video":
      return <VideoComponent element={element} />;
    case "2Col":
      return <TwoColumns element={element} />;
    case "__body":
      return <Body element={element} />;
    case "link":
      return <LinkComponent element={element} />;
    case "shimmerButton":
      return <ShimmerButtonComponent element={element} />;
    case "animatedShinyButton":
      return <AnimatedShinyButtonComponent element={element} />;
    case "neonGradientButton":
      return <NeonGradientButtonComponent element={element} />;
    case "animatedBorderButton":
      return <AnimatedBorderButtonComponent element={element} />;
    case "animatedTextButton":
      return <AnimatedTextButtonComponent element={element} />;
    case "neonGradientCard":
      return <NeonGradientCardComponent element={element} />;
    case "animatedGridPattern":
      return <AnimatedGridPatternComponent element={element} />;
    case "interactiveGridPattern":
      return <AnimatedGridPatternComponent element={element} />;
    case "retroGrid":
      return <RetroGridComponent element={element} />;
    case "dotPattern":
      return <DotPatternComponent element={element} />;
    case "marquee":
      return <MarqueeComponent element={element} />;
    case "gridLayout":
      return <GridLayout element={element} />;
    case "column":
      return <Column element={element} />;
    case "gif":
      return <GifComponent element={element} />;
    default:
      return null;
  }
};

export default Recursive;