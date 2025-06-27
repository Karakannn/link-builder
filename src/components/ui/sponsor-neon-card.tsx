"use client"

import { cn } from "@/lib/utils"
import type { CSSProperties, ReactElement, ReactNode } from "react"
import { useEffect, useRef, useState } from "react"

interface SponsorNeonCardProps {
  /**
   * @default <div />
   * @type ReactElement
   * @description
   * The component to be rendered as the card
   */
  as?: ReactElement
  
  /**
   * @default ""
   * @type string
   * @description
   * The className of the card
   */
  className?: string

  /**
   * @default ""
   * @type ReactNode
   * @description
   * The children of the card
   */
  children?: ReactNode

  /**
   * @default 2
   * @type number
   * @description
   * The size of the border in pixels
   */
  borderSize?: number

  /**
   * @default 12
   * @type number
   * @description
   * The size of the radius in pixels
   */
  borderRadius?: number

  /**
   * @default "#ff00aa"
   * @type string
   * @description
   * The color of the neon effect
   */
  neonColor?: string

  /**
   * @default 0
   * @type number
   * @description
   * Animation delay in seconds
   */
  animationDelay?: number

  [key: string]: any
}

const hexToRgb = (hex: string) => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};

const SponsorNeonCard: React.FC<SponsorNeonCardProps> = ({
  className,
  children,
  borderSize = 2,
  borderRadius = 12,
  neonColor = "#ff00aa",
  animationDelay = 0,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current
        setDimensions({ width: offsetWidth, height: offsetHeight })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current
      setDimensions({ width: offsetWidth, height: offsetHeight })
    }
  }, [children])

  const cardColorRgb = hexToRgb(neonColor)

  return (
    <div
      ref={containerRef}
      style={
        {
          "--card-color": neonColor,
          "--card-color-rgb": cardColorRgb,
          "--border-size": `${borderSize}px`,
          "--border-radius": `${borderRadius}px`,
          "--animation-delay": `${animationDelay}s`,
          "--card-width": `${dimensions.width}px`,
          "--card-height": `${dimensions.height}px`,
        } as CSSProperties
      }
      className={cn(
        "sponsor-neon-card relative overflow-hidden cursor-pointer transition-all duration-300 ease-in-out",
        "flex items-center justify-center text-white border-2",
        "rounded-xl h-full w-full",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { SponsorNeonCard } 