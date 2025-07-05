import GradientText from "@/components/global/gradient-text";
import { Button } from "@/components/ui/button";
import { Zap, Eye } from "lucide-react";
import Link from "next/link";

type Props = {};

const CallToAction = (props: Props) => {
  return (
    <div className="flex flex-col items-start md:items-center gap-y-5 md:gap-y-0">
      <GradientText className="text-[35px] md:text-[40px] lg:text-[55px] xl:text-[70px] 2xl-[80px] leading-tight font-semibold text-center" element="H1">
        Göz Alıcı <br className="md:hidden" /> Sayfanızı Oluşturun
      </GradientText>
      <p className="text-sm md:text-center text-left text-muted-foreground">
        Güçlü sürükle-bırak editörümüzle profesyonel açılış sayfaları oluşturun.
        <br className="md:hidden" />
        Kodlama gerekmez - sadece sürükleyin, bırakın ve sayfalarınızı <br className="hidden md:block" /> anında yayınlayın.
        <br className="md:hidden" />
      </p>
      <div className="flex md:flex-row flex-col md:justify-center gap-5 md:mt-5 w-full">
        <Button variant="outline" className="rounded-xl bg-transparent text-base flex gap-2">
          <Eye size={18} />
          Demo İzle
        </Button>
        <Link href="/sign-in">
          <Button className="rounded-xl text-base flex gap-2 w-full">
            <Zap size={18} /> 
            Hemen Başla
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CallToAction;