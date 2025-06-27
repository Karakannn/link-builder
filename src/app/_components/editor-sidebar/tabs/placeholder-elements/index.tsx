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

// New layout and media components
import GridLayoutPlaceholder from "./grid-layout-placeholder";
import GifPlaceholder from "./gif-placeholder";
import ImagePlaceholder from "./image-placeholder";

// Closable container component
import ClosableContainerPlaceholder from "./closable-container-placeholder";

// Marquee component
import MarqueePlaceholder from "./marquee-placeholder";

// Neon Card component
import NeonCardPlaceholder from "./neon-card-placeholder";
import SponsorNeonCardPlaceholder from "./sponsor-neon-card-placeholder";

const ComponentsTab = () => {
    const elements: {
        Component: React.ReactNode;
        label: string;
        id: EditorBtns;
        category: "layout" | "buttons" | "marquee" | "text" | "media" | "cards";
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
            Component: <ImagePlaceholder />,
            label: "Image",
            id: "image",
            category: "media",
        },
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
            Component: <NeonCardPlaceholder />,
            label: "Neon Card",
            id: "neonCard",
            category: "cards",
        },
        {
            Component: <SponsorNeonCardPlaceholder />,
            label: "Sponsor Neon Card",
            id: "sponsorNeonCard",
            category: "cards",
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