import { MousePointer, Palette, Smartphone, Zap, Code, Globe } from "lucide-react";
import GradientText from "@/components/global/gradient-text";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";

type Props = {};

const FeaturesSection = (props: Props) => {
  const features = [
    {
      Icon: ({ className, ...props }: any) => <MousePointer className={`${className} text-blue-500`} {...props} />,
      name: "Sürükle & Bırak Editörü",
      description: "Bileşenleri sürükleyip bırakarak sayfa oluşturmanızı sağlayan sezgisel görsel editör. Kodlama gerekmez.",
      href: "/sign-in",
      cta: "Editörü Dene",
      background: (
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 opacity-30">
          <div className="w-full h-full bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="absolute left-0 top-0 w-8 h-full bg-gray-700 border-r border-gray-600 flex flex-col items-center py-2 gap-1">
              <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
              <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
              <div className="w-4 h-4 bg-pink-500 rounded-sm"></div>
            </div>
            <div className="ml-8 p-2 h-full">
              <div className="w-full h-4 bg-gradient-to-r from-pink-500 to-cyan-500 rounded mb-2"></div>
              <div className="grid grid-cols-2 gap-1 h-16">
                <div className="bg-gradient-to-br from-pink-500/40 to-cyan-500/40 rounded border border-pink-500/50"></div>
                <div className="bg-gradient-to-br from-purple-500/40 to-blue-500/40 rounded border border-purple-500/50"></div>
              </div>
            </div>
          </div>
        </div>
      ),
      className: "col-span-1 md:col-span-2 lg:col-span-2",
    },
    {
      Icon: ({ className, ...props }: any) => <Palette className={`${className} text-pink-500`} {...props} />,
      name: "Hazır Elementler",
      description: "Açılış sayfalarınızı öne çıkaran elementler.",
      href: "/sign-in",
      cta: "Elementleri Gör",
      background: (
        <div className="absolute bottom-0 right-0 w-3/4 h-2/3 opacity-30 flex flex-col gap-1 justify-end p-2">
          <div className="h-8 bg-gradient-to-r from-pink-500 to-cyan-500 rounded shadow-lg shadow-pink-500/25"></div>
          <div className="h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded shadow-lg shadow-purple-500/25"></div>
          <div className="h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded shadow-lg shadow-green-500/25"></div>
        </div>
      ),
      className: "col-span-1 md:col-span-1 lg:col-span-1",
    },
    {
      Icon: ({ className, ...props }: any) => <Smartphone className={`${className} text-green-500`} {...props} />,
      name: "Mobil Uyumlu",
      description: "Tüm sayfalar otomatik olarak her ekran boyutuna uyum sağlar. Tüm cihazlar için önizleme yapın ve düzenleyin.",
      href: "/sign-in",
      cta: "Uyumluluğu Test Et",
      background: (
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 opacity-30 flex justify-center items-end gap-2 p-2">
          <div className="w-12 h-20 bg-gray-800 rounded-lg border border-gray-600 flex flex-col">
            <div className="flex-1 bg-gradient-to-br from-green-500/60 to-teal-500/60 rounded m-0.5"></div>
          </div>
          <div className="w-16 h-12 bg-gray-800 rounded border border-gray-600 flex flex-col">
            <div className="flex-1 bg-gradient-to-br from-green-500/60 to-teal-500/60 rounded m-0.5"></div>
          </div>
        </div>
      ),
      className: "col-span-1 md:col-span-1 lg:col-span-1",
    },
    {
      Icon: ({ className, ...props }: any) => <Zap className={`${className} text-yellow-500`} {...props} />,
      name: "Anında Yayınlama",
      description: "Sayfalarınızı tek tıkla anında yayınlayın. Değişiklikler dağıtım sorunları olmadan hemen yayına geçer.",
      href: "/sign-in",
      cta: "Yayınlamaya Başla",
      background: (
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 opacity-30 flex flex-col items-center justify-end p-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-2">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      ),
      className: "col-span-1 md:col-span-1 lg:col-span-1",
    },
    {
      Icon: ({ className, ...props }: any) => <Globe className={`${className} text-cyan-500`} {...props} />,
      name: "Özel Alan Adları & Kod",
      description: "Kendi alan adınızı kullanın ve gerektiğinde özel CSS/JavaScript ekleyin. Görsel düzenleme ve esnekliğin mükemmel dengesi.",
      href: "/sign-in",
      cta: "Daha Fazla Bilgi",
      background: (
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 opacity-30 flex flex-col gap-1 p-2">
          <div className="h-6 bg-gray-800 rounded flex items-center px-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            <div className="text-xs text-gray-400 font-mono">domain.com</div>
          </div>
          <div className="flex-1 bg-gray-800 rounded p-1 font-mono text-xs text-gray-500">
            <div className="text-cyan-400">{'<style>'}</div>
            <div className="ml-1 text-purple-400">{'.card {'}</div>
            <div className="ml-2 text-yellow-400">{'gradient...'}</div>
            <div className="ml-1 text-purple-400">{'}'}</div>
            <div className="text-cyan-400">{'</style>'}</div>
          </div>
        </div>
      ),
      className: "col-span-1 md:col-span-2 lg:col-span-1",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 md:px-10">
      <div className="text-center mb-16">
        <GradientText
          className="text-4xl font-semibold mb-4"
          element="H2"
        >
          Muhteşem Sayfalar Oluşturmak İçin İhtiyacınız Olan Her Şey
        </GradientText>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Sayfa oluşturmayı hızlı, eğlenceli ve profesyonel hale getiren güçlü özellikler
        </p>
      </div>

      <BentoGrid className="max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <BentoCard
            key={index}
            {...feature}
          />
        ))}
      </BentoGrid>
    </section>
  );
};

export default FeaturesSection; 