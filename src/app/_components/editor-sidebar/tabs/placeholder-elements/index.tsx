import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { EditorBtns } from "@/lib/constants";

// Existing components
import ContainerPlaceholder from "./container-placeholder";
import TextPlaceholder from "./text-placeholder";
import VideoPlaceholder from "./video-placeholder";
import TwoColumnsPlaceholder from "./two-columns-placeholder";
import LinkPlaceholder from "./link-placeholder";
import ContactFormComponentPlaceholder from "./contact-form-component-placeholder";
import ShimmerButtonPlaceholder from "./shimmer-button-placeholder";

// New button components
import AnimatedShinyButtonPlaceholder from "./animated-shiny-button-placeholder";
import NeonGradientButtonPlaceholder from "./neon-gradient-button-placeholder";
import AnimatedBorderButtonPlaceholder from "./animated-border-button-placeholder";
import AnimatedTextButtonPlaceholder from "./animated-text-button-placeholder";

// New card components
import NeonGradientCardPlaceholder from "./neon-gradient-card-placeholder";

// New background components
import AnimatedGridPatternPlaceholder from "./animated-grid-pattern-placeholder";
import InteractiveGridPatternPlaceholder from "./interactive-grid-pattern-placeholder";
import RetroGridPlaceholder from "./retro-grid-placeholder";
import DotPatternPlaceholder from "./dot-pattern-placeholder";
import MarqueePlaceholder from "./marquee-placeholder";

// New layout and media components
import GridLayoutPlaceholder from "./grid-layout-placeholder";
import GifPlaceholder from "./gif-placeholder";

// Closable container component
import ClosableContainerPlaceholder from "./closable-container-placeholder";

const ComponentsTab = () => {
    const elements: {
        Component: React.ReactNode;
        label: string;
        id: EditorBtns;
        category: "layout" | "buttons" | "backgrounds" | "marquee" | "text" | "media" | "cards";
    }[] = [
        // Layout Elements
        {
            Component: <ContainerPlaceholder />,
            label: "Container",
            id: "container",
            category: "layout",
        },
        {
            Component: <ClosableContainerPlaceholder />,
            label: "Closable Container",
            id: "closableContainer",
            category: "layout",
        },
        {
            Component: <TwoColumnsPlaceholder />,
            label: "2 Columns",
            id: "2Col",
            category: "layout",
        },
        {
            Component: <GridLayoutPlaceholder />,
            label: "Grid Layout",
            id: "gridLayout",
            category: "layout",
        },
        
        // Text Elements
        {
            Component: <TextPlaceholder />,
            label: "Text",
            id: "text",
            category: "text",
        },
        {
            Component: <LinkPlaceholder />,
            label: "Link",
            id: "link",
            category: "text",
        },
        
        // Media Elements
        {
            Component: <VideoPlaceholder />,
            label: "Video",
            id: "video",
            category: "media",
        },
        {
            Component: <GifPlaceholder />,
            label: "GIF",
            id: "gif",
            category: "media",
        },
        
        // Button Elements
        {
            Component: <ShimmerButtonPlaceholder />,
            label: "Shimmer Button",
            id: "shimmerButton",
            category: "buttons",
        },
        {
            Component: <AnimatedShinyButtonPlaceholder />,
            label: "Shiny Button",
            id: "animatedShinyButton",
            category: "buttons",
        },
        {
            Component: <NeonGradientButtonPlaceholder />,
            label: "Neon Button",
            id: "neonGradientButton",
            category: "buttons",
        },
        {
            Component: <AnimatedBorderButtonPlaceholder />,
            label: "Border Button",
            id: "animatedBorderButton",
            category: "buttons",
        },
        {
            Component: <AnimatedTextButtonPlaceholder />,
            label: "Text Shiny Button",
            id: "animatedTextButton",
            category: "buttons",
        },

        
         // Card Elements
         {
            Component: <NeonGradientCardPlaceholder />,
            label: "Neon Card",
            id: "neonGradientCard",
            category: "cards",
        },

        // Background Elements
        {
            Component: <AnimatedGridPatternPlaceholder />,
            label: "Animated Grid",
            id: "animatedGridPattern",
            category: "backgrounds",
        },
        {
            Component: <InteractiveGridPatternPlaceholder />,
            label: "Interactive Grid",
            id: "interactiveGridPattern",
            category: "backgrounds",
        },
        {
            Component: <RetroGridPlaceholder />,
            label: "Retro Grid",
            id: "retroGrid",
            category: "backgrounds",
        },
        {
            Component: <DotPatternPlaceholder />,
            label: "Dot Pattern",
            id: "dotPattern",
            category: "backgrounds",
        },
        
        // Marquee Elements
        {
            Component: <MarqueePlaceholder />,
            label: "Marquee",
            id: "marquee",
            category: "marquee",
        },
        
        // Other Elements
        {
            Component: <ContactFormComponentPlaceholder />,
            label: "Contact",
            id: "contactForm",
            category: "layout",
        },
    ];

    const categories = [
        { id: "layout", name: "Layout", defaultOpen: true },
        { id: "text", name: "Text", defaultOpen: true },
        { id: "media", name: "Media", defaultOpen: true },
        { id: "cards", name: "Cards", defaultOpen: true },
        { id: "buttons", name: "Buttons", defaultOpen: false },
        { id: "backgrounds", name: "Backgrounds", defaultOpen: false },
        { id: "marquee", name: "Marquee", defaultOpen: false },
    ];

    const defaultOpenCategories = categories
        .filter(cat => cat.defaultOpen)
        .map(cat => cat.name);

    return (
        <Accordion type="multiple" className="w-full" defaultValue={defaultOpenCategories}>
            {categories.map((category) => (
                <AccordionItem key={category.id} value={category.name} className="px-6 py-0 border-y-[1px]">
                    <AccordionTrigger className="!no-underline">{category.name}</AccordionTrigger>
                    <AccordionContent className="flex flex-wrap gap-2">
                        {elements
                            .filter((element) => element.category === category.id)
                            .map((element) => (
                                <div key={element.id} className="flex-col items-center justify-center flex">
                                    {element.Component}
                                    <span className="text-muted-foreground text-xs text-center">
                                        {element.label}
                                    </span>
                                </div>
                            ))}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

export default ComponentsTab;