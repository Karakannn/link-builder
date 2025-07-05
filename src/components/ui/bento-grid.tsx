import { ReactNode } from "react";
import { ArrowRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className: string;
  background: ReactNode;
  Icon: any;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative flex flex-col justify-between overflow-hidden rounded-xl",
      // Use same styling as pricing card
      "bg-themeBlack border-themeGray hover:border-gray-600 transition-all duration-300",
      className,
    )}
  >
    {/* Subtle gradient overlay like pricing card */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
    
    {/* Background visuals */}
    {background}
    
    <div className="relative z-10 flex transform-gpu flex-col gap-3 p-6 transition-all duration-300 group-hover:-translate-y-1">
      <Icon className="h-12 w-12 origin-left transform-gpu transition-all duration-300 ease-in-out group-hover:scale-110" />
      <h3 className="text-xl font-semibold text-white">
        {name}
      </h3>
      <p className="text-white/90 text-sm leading-relaxed">
        {description}
      </p>
    </div>

    <div
      className={cn(
        "relative z-10 flex w-full translate-y-2 transform-gpu flex-row items-center p-6 pt-0 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
      )}
    >
      <Button variant="outline" asChild size="sm" className="pointer-events-auto">
        <a href={href}>
          {cta}
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
  </div>
);

export { BentoGrid, BentoCard }; 