import { EditorBtns } from "@/lib/constants";
import { Contact2Icon, Link2Icon, SparklesIcon, TypeIcon, Youtube } from "lucide-react";
import React from "react";

type Props = {
  type: EditorBtns;
};

const SidebarEditorButtonOverlay = ({ type }: Props) => {
  switch (type) {
    case "text":
      return (
        <div className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center opacity-80 border-2 border-blue-500">
          <TypeIcon size={40} className="text-muted-foreground" />
        </div>
      );

    case "container":
      return (
        <div className="h-14 w-14 bg-muted/70 rounded-lg p-2 flex flex-row gap-[4px] opacity-80 border-2 border-blue-500">
          <div className="border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full" />
        </div>
      );

    case "2Col":
      return (
        <div className="h-14 w-14 bg-muted/70 rounded-lg p-2 flex flex-row gap-[4px] opacity-80 border-2 border-blue-500">
          <div className="border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full" />
          <div className="border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full" />
        </div>
      );

    case "video":
      return (
        <div className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center opacity-80 border-2 border-blue-500">
          <Youtube size={40} className="text-muted-foreground" />
        </div>
      );

    case "contactForm":
      return (
        <div className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center opacity-80 border-2 border-blue-500">
          <Contact2Icon size={40} className="text-muted-foreground" />
        </div>
      );

    case "shimmerButton":
      return (
        <div className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center opacity-80 border-2 border-blue-500">
          <SparklesIcon size={40} className="text-muted-foreground" />
        </div>
      );

    case "link":
      return (
        <div className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center opacity-80 border-2 border-blue-500">
          <Link2Icon size={40} className="text-muted-foreground" />
        </div>
      );

    default:
      return (
        <div className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center opacity-80 border-2 border-gray-500">
          <div className="text-xs text-muted-foreground">?</div>
        </div>
      );
  }
};

export default SidebarEditorButtonOverlay;
