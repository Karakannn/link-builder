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
  Play
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

    case "contactForm":
      return (
        <div className={baseClasses}>
          <Contact2Icon size={40} className="text-muted-foreground" />
        </div>
      );

    case "shimmerButton":
      return (
        <div className={baseClasses}>
          <SparklesIcon size={40} className="text-muted-foreground" />
        </div>
      );

    case "link":
      return (
        <div className={baseClasses}>
          <Link2Icon size={40} className="text-muted-foreground" />
        </div>
      );

    // New Button Types
    case "animatedShinyButton":
      return (
        <div className={`${baseClasses} bg-gradient-to-r from-gray-800 to-gray-600 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] animate-pulse" />
          <Sparkles size={40} className="text-white relative z-10" />
        </div>
      );

    case "neonGradientButton":
      return (
        <div 
          className={baseClasses}
          style={{
            background: "linear-gradient(45deg, #ff00aa, #00FFF1)",
            boxShadow: "0 0 20px rgba(255, 0, 170, 0.5)",
          }}
        >
          <div className="absolute inset-[2px] bg-gray-900 rounded-lg" />
          <Zap size={40} className="text-cyan-400 relative z-10" />
        </div>
      );

    case "animatedBorderButton":
      return (
        <div className={`${baseClasses} p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500`}>
          <div className="bg-gray-900 rounded-lg w-full h-full flex items-center justify-center">
            <Square size={40} className="text-purple-400" />
          </div>
        </div>
      );

    case "animatedTextButton":
      return (
        <div className={`${baseClasses} bg-gray-800 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-20 -translate-x-full animate-pulse" />
          <Type size={40} className="text-gray-300 relative z-10" />
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

    case "interactiveGridPattern":
      return (
        <div className={`${baseClasses} bg-muted relative overflow-hidden`}>
          <div className="absolute inset-0 p-1">
            <div className="grid grid-cols-4 grid-rows-4 h-full w-full gap-[1px]">
              {Array.from({ length: 16 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-muted-foreground/20 hover:bg-muted-foreground/60 transition-all duration-200"
                />
              ))}
            </div>
          </div>
          <MousePointer size={40} className="text-muted-foreground relative z-10" />
        </div>
      );

    case "retroGrid":
      return (
        <div 
          className={`${baseClasses} bg-gradient-to-b from-purple-900 to-pink-900 relative overflow-hidden`}
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(139, 69, 19, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(139, 69, 19, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '8px 8px',
            transform: 'perspective(100px) rotateX(20deg)',
          }}
        >
          <Layers size={32} className="text-orange-300 relative z-10" />
        </div>
      );

    case "dotPattern":
      return (
        <div 
          className={`${baseClasses} bg-muted relative overflow-hidden`}
          style={{
            backgroundImage: `radial-gradient(circle, rgba(156, 163, 175, 0.4) 1px, transparent 1px)`,
            backgroundSize: '6px 6px',
            backgroundPosition: '0 0, 3px 3px',
          }}
        >
          <MoreHorizontal size={40} className="text-muted-foreground relative z-10" />
        </div>
      );

    case "marquee":
      return (
        <div className={`${baseClasses} bg-muted relative overflow-hidden`}>
          <div className="absolute inset-0 flex items-center">
            <div className="flex space-x-2">
              <ArrowRight size={16} className="text-muted-foreground opacity-60" />
              <ArrowRight size={16} className="text-muted-foreground opacity-80" />
              <ArrowRight size={16} className="text-muted-foreground" />
            </div>
          </div>
          <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
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