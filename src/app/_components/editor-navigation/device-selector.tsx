"use client";

import React, { memo, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DeviceTypes } from "@/providers/editor/editor-provider";
import { useUIActions } from "@/hooks/editor-actions/use-ui-actions";
import { Laptop, Tablet, Smartphone } from "lucide-react";
import { useDevice } from "@/providers/editor/editor-ui-context";

export const DeviceSelector = memo(() => {
    const { changeDevice } = useUIActions();
    const device = useDevice();

    const handleDeviceChange = useCallback(
        (value: string) => {
            changeDevice(value as DeviceTypes);
        },
        [changeDevice]
    );

    return (
        <Tabs defaultValue="Desktop" className="w-fit" value={device} onValueChange={handleDeviceChange}>
            <TabsList className="grid w-full grid-cols-3 bg-transparent h-fit">
                <Tooltip>
                    <TooltipTrigger>
                        <TabsTrigger value="Desktop" className="data-[state=active]:bg-muted w-10 h-10 p-0">
                            <Laptop />
                        </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Desktop</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger>
                        <TabsTrigger value="Tablet" className="data-[state=active]:bg-muted w-10 h-10 p-0">
                            <Tablet />
                        </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Tablet</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger>
                        <TabsTrigger value="Mobile" className="data-[state=active]:bg-muted w-10 h-10 p-0">
                            <Smartphone />
                        </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Mobile</p>
                    </TooltipContent>
                </Tooltip>
            </TabsList>
        </Tabs>
    );
});
