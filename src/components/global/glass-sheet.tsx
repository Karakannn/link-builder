import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type GlassSheetProps = {
  children: React.ReactNode;
  trigger: React.ReactNode;
  className?: string;
  triggerClass?: string;
};

const GlassSheet = ({ children, trigger, className, triggerClass }: GlassSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger className={cn(triggerClass)} asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent
        className={cn("bg-clip-padding backdrop-filter backdrop--blur__safari backdrop-blur-3xl", className)}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
};

export default GlassSheet;
