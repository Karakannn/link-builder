"use client";

import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Undo2, Redo2 } from "lucide-react";
import { useCanUndo, useCanRedo, useHistoryNavigation } from "@/providers/editor/editor-history-context";
import { useHistoryActions } from "@/hooks/editor-actions/use-history-actions";

export const HistoryControls = memo(() => {

    const canUndo = useCanUndo();
    const canRedo = useCanRedo();
    const { getUndoTooltip, getRedoTooltip } = useHistoryNavigation();
    const { undo, redo } = useHistoryActions();

    return (
        <>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button disabled={!canUndo} onClick={undo} variant={"ghost"} size={"icon"} className="hover:bg-slate-800">
                        <Undo2 />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{getUndoTooltip()}</p>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button disabled={!canRedo} onClick={redo} variant={"ghost"} size={"icon"} className="hover:bg-slate-800 mr-4">
                        <Redo2 />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{getRedoTooltip()}</p>
                </TooltipContent>
            </Tooltip>
        </>
    );
});
