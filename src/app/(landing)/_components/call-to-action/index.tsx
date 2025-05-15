import GradientText from "@/components/global/gradient-text";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

type Props = {};

const CallToAction = (props: Props) => {
  return (
    <div className="flex flex-col items-start md:items-center gap-y-5 md:gap-y-0">
      <GradientText className="text-[35px] md:text-[40px] lg:text-[55px] xl:text-[70px] 2xl:text-[80px] leading-tight font-semibold" element="H1">
        Lorem Ipsum Dolor <br className="md:hidden" /> Sit Amet
      </GradientText>
      <p className="text-sm md:text-center text-left text-muted-foreground">
        Lorem ipsum dolor sit amet consectetur adipiscing elit
        <br className="md:hidden" />
        sed do eiusmod tempor incididunt <br className="hidden md:block" /> ut labore et dolore magna
        <br className="md:hidden" />
        aliqua enim
      </p>
      <div className="flex md:flex-row flex-col md:justify-center gap-5 md:mt-5 w-full">
        <Button variant="outline" className="rounded-xl bg-transparent text-base">
          Lorem Ipsum
        </Button>
        <Link href="/sign-in">
          <Button className="rounded-xl text-base flex gap-2 w-full">
            <Plus /> Lorem Dolor
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CallToAction;