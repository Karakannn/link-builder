"use client";
import { Accordion } from "@/components/ui/accordion";
import React from "react";
import FlexboxProperties from "./general-properties/flexbox";
import DimensionsProperties from "./general-properties/dimensions";
import DecorationsProperties from "./general-properties/decorations";
import TypographyProperties from "./general-properties/typography";
import DeviceProperties from "./general-properties/device";
import PositionProperties from "./general-properties/position";


export const SettingsTab = () => {

    return (
        <Accordion type="multiple" className="w-full" defaultValue={["Typography", "Dimensions", "Decorations", "Flexbox", "Position"]}>
            <DeviceProperties />
            <TypographyProperties />
            <DimensionsProperties />
            <PositionProperties />
            <DecorationsProperties />
            <FlexboxProperties />
        </Accordion>
    );
};
