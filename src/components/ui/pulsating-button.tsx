"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface PulsatingButtonProps
   extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   pulseColor?: string
   duration?: string
   contentEditable?: boolean
}

export const PulsatingButton = React.forwardRef<
   HTMLButtonElement,
   PulsatingButtonProps
>(
   (
      {
         className,
         children,
         pulseColor = "#808080",
         duration = "1.5s",
         contentEditable,
         ...props
      },
      ref,
   ) => {
      console.log("🔧 PulsatingButton UI - Props:", { pulseColor, duration });
      
      return (
         <button
            ref={ref}
            className={cn(
               "relative flex cursor-pointer items-center justify-center rounded-lg bg-primary px-4 py-2 text-center text-primary-foreground",
               className,
            )}
            contentEditable={contentEditable}
            {...props}
         >
            <div className="relative z-10">{children}</div>
            <div 
               className="absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 rounded-lg animate-pulse-custom pointer-events-none"
               style={{
                  '--pulse-color': pulseColor,
                  animationDuration: duration,
               } as React.CSSProperties}
            />
         </button>
      )
   },
)

PulsatingButton.displayName = "PulsatingButton"