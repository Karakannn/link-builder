"use client";

import {
  CSSProperties,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface NeonColorsProps {
  firstColor: string;
  secondColor: string;
}

interface NeonGradientCardCoverProps {
  /**
   * @default <div />
   * @type ReactElement
   * @description
   * The component to be rendered as the card
   */
  as?: ReactElement;
  
  /**
   * @default ""
   * @type string
   * @description
   * The className of the card
   */
  className?: string;

  /**
   * @default ""
   * @type ReactNode
   * @description
   * The children of the card
   */
  children?: ReactNode;

  /**
   * @default 5
   * @type number
   * @description
   * The size of the border in pixels
   */
  borderSize?: number;

  /**
   * @default 20
   * @type number
   * @description
   * The size of the radius in pixels
   */
  borderRadius?: number;

  /**
   * @default "{ firstColor: '#ff00aa', secondColor: '#00FFF1' }"
   * @type string
   * @description
   * The colors of the neon gradient
   */
  neonColors?: NeonColorsProps;

  /**
   * @type string
   * @description
   * The logo image source
   */
  logo: string;

  /**
   * @type string
   * @description
   * The title of the card
   */
  title: string;

  /**
   * @type string
   * @description
   * The description of the card
   */
  description: string;

  /**
   * @default 48
   * @type number
   * @description
   * The size of the logo in pixels
   */
  logoSize?: number;

  [key: string]: any;
}

export const NeonGradientCardCover: React.FC<NeonGradientCardCoverProps> = ({
  className,
  children,
  borderSize = 2,
  borderRadius = 20,
  neonColors = {
    firstColor: "#ff00aa",
    secondColor: "#00FFF1",
  },
  logo,
  title,
  description,
  logoSize = 48,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [children]);

  return (
    <div
      ref={containerRef}
      style={
        {
          "--border-size": `${borderSize}px`,
          "--border-radius": `${borderRadius}px`,
          "--neon-first-color": neonColors.firstColor,
          "--neon-second-color": neonColors.secondColor,
          "--card-width": `${dimensions.width}px`,
          "--card-height": `${dimensions.height}px`,
          "--card-content-radius": `${borderRadius - borderSize}px`,
          "--pseudo-element-background-image": `linear-gradient(0deg, ${neonColors.firstColor}, ${neonColors.secondColor})`,
          "--pseudo-element-width": `${dimensions.width + borderSize * 2}px`,
          "--pseudo-element-height": `${dimensions.height + borderSize * 2}px`,
          "--after-blur": `${dimensions.width / 3}px`,
        } as CSSProperties
      }
      className={cn(
        "relative z-10 size-full rounded-[var(--border-radius)]",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "relative size-full min-h-[inherit] rounded-[var(--card-content-radius)] bg-gray-100 p-6",
          "before:absolute before:-left-[var(--border-size)] before:-top-[var(--border-size)] before:-z-10 before:block",
          "before:h-[var(--pseudo-element-height)] before:w-[var(--pseudo-element-width)] before:rounded-[var(--border-radius)] before:content-['']",
          "before:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))] before:bg-[length:100%_200%]",
          "before:animate-background-position-spin",
          "after:absolute after:-left-[var(--border-size)] after:-top-[var(--border-size)] after:-z-10 after:block",
          "after:h-[var(--pseudo-element-height)] after:w-[var(--pseudo-element-width)] after:rounded-[var(--border-radius)] after:blur-[var(--after-blur)] after:content-['']",
          "after:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))] after:bg-[length:100%_200%] after:opacity-80",
          "after:animate-background-position-spin",
          "dark:bg-neutral-900",
        )}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative" style={{ width: logoSize, height: logoSize }}>
            <Image
              src={logo}
              alt={title}
              fill
              className="object-contain"
              sizes={`${logoSize}px`}
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
};
