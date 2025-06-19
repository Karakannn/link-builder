"use client";
import { Button } from "@/components/ui/button";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { EyeOff } from "lucide-react";
import React, { useEffect } from "react";
import Recursive from "./_components-editor/recursive";
import { Pages } from "./dndexamples/Pages";
import { Layout } from "./dndexamples/Page";

type Props = {
  pageDetails: EditorElement[];
  liveMode?: boolean;
  layout?: "vertical" | "horizontal";
};

const FunnelEditor = ({ pageDetails, liveMode, layout = "vertical" }: Props) => {
  const { dispatch, state } = useEditor();
  console.log("pageContent", state.editor.elements);

  useEffect(() => {
    if (liveMode) {
      dispatch({
        type: "TOGGLE_LIVE_MODE",
        payload: { value: true },
      });
    }
  }, [liveMode]);

  //CHALLENGE: make this more performant
  useEffect(() => {
    dispatch({
      type: "LOAD_DATA",
      payload: {
        elements: pageDetails,
        withLive: !!liveMode,
      },
    });
  }, [pageDetails]);

  const handleClick = () => {
    dispatch({
      type: "CHANGE_CLICKED_ELEMENT",
      payload: {},
    });
  };

  const handleUnPreview = () => {
    dispatch({
      type: "TOGGLE_PREVIEW_MODE",
    });
    dispatch({
      type: "TOGGLE_LIVE_MODE",
    });
  };

  return (
    /*   <><Pages layout={Layout.Horizontal} /></> */
    <div
      data-editor-container="true"
      className={clsx("use-automation-zoom-in h-[calc(100vh_-_97px)] overflow-hidden mr-[385px] bg-background transition-all rounded-md", {
        "!p-0 !mr-0": state.editor.previewMode === true || state.editor.liveMode === true,
        "!w-[850px]": state.editor.device === "Tablet",
        "!w-[420px]": state.editor.device === "Mobile",
        "w-full": state.editor.device === "Desktop",
      })}
      onClick={handleClick}
    >
      {state.editor.previewMode && state.editor.liveMode && (
        <Button variant={"ghost"} size={"icon"} className="w-6 h-6 bg-slate-600 p-[2px] fixed top-0 left-0 z-[100]" onClick={handleUnPreview}>
          <EyeOff />
        </Button>
      )}
      {Array.isArray(state.editor.elements) &&
        state.editor.elements.map((childElement) => (
          <Recursive
            key={childElement.id}
            element={childElement}
          />
        ))
      }
    </div>
  );
};

export default FunnelEditor;