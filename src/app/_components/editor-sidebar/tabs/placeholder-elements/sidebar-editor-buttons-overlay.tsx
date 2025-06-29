import { EditorBtns } from "@/lib/constants";
import { 
  Contact2Icon, 
  Link2Icon, 
  SparklesIcon, 
  TypeIcon, 
  Youtube,
  Sparkles,
  Zap,
  Square,
  Type,
  Grid3X3,
  MousePointer,
  Layers,
  MoreHorizontal,
  ArrowRight,
  FileImage,
  Play,
  CreditCard
} from "lucide-react";
import React from "react";

type Props = {
  type: EditorBtns;
};

const SidebarEditorButtonOverlay = ({ type }: Props) => {
  const baseClasses = "h-14 w-14 rounded-lg flex items-center justify-center opacity-80 border-2 border-blue-500";
  
  switch (type) {
    case "text":
      return (
        <div className={baseClasses}>
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

    case "gridLayout":
      return (
        <div className="h-14 w-14 bg-muted/70 rounded-lg p-2 flex flex-col gap-[2px] opacity-80 border-2 border-blue-500">
          <div className="flex gap-[2px] h-full">
            <div className="border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full" />
            <div className="border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full" />
            <div className="border-dashed border-[1px] h-full rounded-sm bg-muted border-muted-foreground/50 w-full" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Grid3X3 size={20} className="text-muted-foreground/70" />
          </div>
        </div>
      );

    case "video":
      return (
        <div className={baseClasses}>
          <Youtube size={40} className="text-muted-foreground" />
        </div>
      );

    case "gif":
      return (
        <div className={`${baseClasses} bg-gradient-to-br from-purple-100 to-pink-100 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-purple-400/20" />
          <FileImage size={32} className="text-purple-600 relative z-10" />
          <div className="absolute bottom-1 right-1 bg-purple-600 rounded-full p-1">
            <Play size={10} className="text-white fill-current" />
          </div>
          <div className="absolute top-1 left-1 bg-purple-600 text-white text-[8px] px-1 rounded font-bold">
            GIF
          </div>
        </div>
      );

    case "link":
      return (
        <div className={baseClasses}>
          <Link2Icon size={40} className="text-muted-foreground" />
        </div>
      );

    // Background Types
    case "animatedGridPattern":
      return (
        <div className={`${baseClasses} bg-muted relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-30">
            <div className="grid grid-cols-4 grid-rows-4 h-full w-full gap-[1px]">
              {Array.from({ length: 16 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-muted-foreground/30 animate-pulse" 
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          </div>
          <Grid3X3 size={40} className="text-muted-foreground relative z-10" />
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