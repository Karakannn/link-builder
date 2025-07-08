import React, { Suspense, memo } from "react";
import { EditorElement } from "@/providers/editor/editor-provider";
import { useLayout, Layout } from "@/hooks/use-layout";
import { isEqual } from "lodash";

const TextComponent = React.lazy(() => import("./text"));
const Container = React.lazy(() => import("./container").then((m) => ({ default: m.Container })));
const ClosableContainer = React.lazy(() => import("../elements/closable-container").then((m) => ({ default: m.ClosableContainer })));
const VideoComponent = React.lazy(() => import("./video"));
const TwoColumns = React.lazy(() => import("./container").then((m) => ({ default: m.Container })));
const Body = React.lazy(() => import("./body").then((m) => ({ default: m.BodyContainer })));
const LinkComponent = React.lazy(() => import("./link"));
const SponsorNeonCardComponent = React.lazy(() => import("./sponsor-neon-card"));
const GridLayout = React.lazy(() => import("./grid-layout").then((m) => ({ default: m.GridLayoutComponent })));
const MarqueeComponent = React.lazy(() => import("./marquee"));
const Column = React.lazy(() => import("./column").then((m) => ({ default: m.ColumnComponent })));
const GifComponent = React.lazy(() => import("./gif"));
const ImageComponent = React.lazy(() => import("./image"));

type Props = {
    element: EditorElement;
    containerId?: string;
    index?: number;
    layout?: Layout;
};

const areElementsEqual = (prevProps: Props, nextProps: Props) => {
    const prev = prevProps.element;
    const next = nextProps.element;

    if (prev === next) return true;

    if (prev.id !== next.id || prev.type !== next.type) return false;
    if (prevProps.layout !== nextProps.layout) return false;

    const prevKeys = Object.keys(prev);
    const nextKeys = Object.keys(next);
    if (prevKeys.length !== nextKeys.length) return false;

    return isEqual(prev, next);
};

const Recursive = memo(({ element, containerId, index = 0, layout }: Props) => {

    try {
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
                default:
                    console.warn(`❓ Unknown element type: ${element.type} for ${element.id}`);
                    return null;
            }
        };

        const fallbackComponent = (
            <div
                className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded min-h-[32px] flex items-center justify-center text-xs text-gray-500"
                style={{
                    width: element.styles?.width || "100%",
                    height: element.styles?.height || "32px",
                }}
            >
                Loading {element.type}...
            </div>
        );


        return <Suspense fallback={fallbackComponent}>{renderElement()}</Suspense>;
    } catch (error) {
        console.error(`❌ ERROR in Recursive for ${element.type} - ${element.id}:`, error);
        throw error;
    }
}, areElementsEqual);


export default Recursive;
