// src/app/_components/editor/_components-editor/recursive.tsx
// ⚡ OPTIMIZED VERSION - Replace existing recursive.tsx with this

import React, { Suspense, memo } from "react";
import { EditorElement } from "@/providers/editor/editor-provider";
import { useLayout, Layout } from "@/hooks/use-layout";
import { isEqual } from "lodash";

// Lazy loaded components - React 19 optimization
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

// 🚀 REACT 19: Ultra-optimized comparison with lodash
const areElementsEqual = (prevProps: Props, nextProps: Props) => {
    const prev = prevProps.element;
    const next = nextProps.element;

    // 1. Quick reference check (99% of cases)
    if (prev === next) return true;

    // 2. Critical properties (fast primitives)
    if (prev.id !== next.id || prev.type !== next.type) return false;
    if (prevProps.layout !== nextProps.layout) return false;

    // 3. Quick property count check (before deep compare)
    const prevKeys = Object.keys(prev);
    const nextKeys = Object.keys(next);
    if (prevKeys.length !== nextKeys.length) return false;

    // 4. Lodash deep equality (only when necessary)
    return isEqual(prev, next);
};

// 🚀 REACT 19: Memoized Recursive Component with custom comparison
const Recursive = memo(({ element, containerId, index = 0, layout }: Props) => {
    console.log(`🔄 Recursive render START: ${element.type} - ${element.id}`);

    try {
        const { getElementLayout } = useLayout();
        console.log(`✅ Hook 1 (useLayout) completed for ${element.type}`);

        const elementLayout = layout || getElementLayout(element);
        console.log(`✅ Layout computed for ${element.type}: ${elementLayout}`);

        // 🚀 REACT 19: Component selection logic (moved outside useMemo)
        const renderElement = () => {
            console.log(`🎨 Rendering element type: ${element.type}`);

            switch (element.type) {
                case "text":
                    console.log(`📝 Rendering TextComponent for ${element.id}`);
                    return <TextComponent element={element} />;
                case "container":
                    console.log(`📦 Rendering Container for ${element.id}`);
                    return <Container element={element} layout={elementLayout} />;
                case "closableContainer":
                    console.log(`📦❌ Rendering ClosableContainer for ${element.id}`);
                    return <ClosableContainer element={element} layout={elementLayout} />;
                case "video":
                    console.log(`🎥 Rendering VideoComponent for ${element.id}`);
                    return <VideoComponent element={element} />;
                case "2Col":
                    console.log(`📊 Rendering TwoColumns for ${element.id}`);
                    return <TwoColumns element={element} layout={elementLayout} />;
                case "__body":
                    console.log(`🏠 Rendering Body for ${element.id}`);
                    return <Body element={element} />;
                case "link":
                    console.log(`🔗 Rendering LinkComponent for ${element.id}`);
                    return <LinkComponent element={element} />;
                case "sponsorNeonCard":
                    console.log(`✨ Rendering SponsorNeonCardComponent for ${element.id}`);
                    return <SponsorNeonCardComponent element={element} layout={elementLayout} />;
                case "marquee":
                    console.log(`🏃 Rendering MarqueeComponent for ${element.id}`);
                    return <MarqueeComponent element={element} layout={elementLayout} />;
                case "gridLayout":
                    console.log(`🗂️ Rendering GridLayout for ${element.id}`);
                    return <GridLayout element={element} />;
                case "column":
                    console.log(`📋 Rendering Column for ${element.id}`);
                    return <Column element={element} />;
                case "gif":
                    console.log(`🎞️ Rendering GifComponent for ${element.id}`);
                    return <GifComponent element={element} />;
                case "image":
                    console.log(`🖼️ Rendering ImageComponent for ${element.id}`);
                    return <ImageComponent element={element} />;
                default:
                    console.warn(`❓ Unknown element type: ${element.type} for ${element.id}`);
                    return null;
            }
        };

        // 🚀 REACT 19: Optimized suspense boundary with element-specific fallback
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

        console.log(`✅ Recursive render SUCCESS: ${element.type} - ${element.id}`);

        return <Suspense fallback={fallbackComponent}>{renderElement()}</Suspense>;
    } catch (error) {
        console.error(`❌ ERROR in Recursive for ${element.type} - ${element.id}:`, error);
        throw error;
    }
}, areElementsEqual);

// 🚀 REACT 19: Set display name for better debugging
Recursive.displayName = "OptimizedRecursive";

export default Recursive;
