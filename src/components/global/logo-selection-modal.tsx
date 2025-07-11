"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";

interface LogoData {
  filename: string;
  title: string;
  defaultColor: string;
  url: string;
}

interface LogoSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (logoData: LogoData) => void;
}

// List of all logos with their default colors and titles
const AVAILABLE_LOGOS: LogoData[] = [
  { filename: "asyabahis.png", title: "Asyabahis", defaultColor: "#3dc6f3", url: "/logos/asyabahis.png" },
  { filename: "bahiscom.png", title: "Bahiscom", defaultColor: "#00c683", url: "/logos/bahiscom.png" },
  { filename: "bahisen.png", title: "Bahisen", defaultColor: "#3173da", url: "/logos/bahisen.png" },
  { filename: "bankobet.png", title: "Bankobet", defaultColor: "#ff1376", url: "/logos/bankobet.png" },
  { filename: "betewin.png", title: "Betewin", defaultColor: "#ff6d10", url: "/logos/betewin.png" },
  { filename: "betist.png", title: "Betist", defaultColor: "#3fb26e", url: "/logos/betist.png" },
  { filename: "betjuve.jpg", title: "Betjuve", defaultColor: "#caba94", url: "/logos/betjuve.jpg" },
  { filename: "betkanyon.png", title: "Betkanyon", defaultColor: "#ec6139", url: "/logos/betkanyon.png" },
  { filename: "betkom.png", title: "Betkom", defaultColor: "#1fe0ff", url: "/logos/betkom.png" },
  { filename: "betplay.png", title: "Betplay", defaultColor: "#fdbd02", url: "/logos/betplay.png" },
  { filename: "betpublic.png", title: "Betpublic", defaultColor: "#9d2448", url: "/logos/betpublic.png" },
  { filename: "betturkey.png", title: "Betturkey", defaultColor: "#ffdd3a", url: "/logos/betturkey.png" },
  { filename: "betzula.png", title: "Betzula", defaultColor: "#dbc590", url: "/logos/betzula.png" },
  { filename: "bycasino.png", title: "Bycasino", defaultColor: "#ff6001", url: "/logos/bycasino.png" },
  { filename: "casibom.jpeg", title: "Casibom", defaultColor: "#ffad0f", url: "/logos/casibom.jpeg" },
  { filename: "casinomilyon.png", title: "Casinomilyon", defaultColor: "#f7f7f7", url: "/logos/casinomilyon.png" },
  { filename: "dahibet-dark.png", title: "Dahibet", defaultColor: "#ff3131", url: "/logos/dahibet-dark.png" },
  { filename: "dahibet.png", title: "Dahibet", defaultColor: "#ff3131", url: "/logos/dahibet.png" },
  { filename: "dumanbet.png", title: "Dumanbet", defaultColor: "#6aa600", url: "/logos/dumanbet.png" },
  { filename: "elcortez.png", title: "Elcortez", defaultColor: "#ff5d2a", url: "/logos/elcortez.png" },
  { filename: "fixbet.png", title: "Fixbet", defaultColor: "#cdfd65", url: "/logos/fixbet.png" },
  { filename: "grandpasha2.png", title: "Grandpasha", defaultColor: "#c28d3e", url: "/logos/grandpasha2.png" },
  { filename: "grandpashabet.png", title: "Grandpashabet", defaultColor: "#ffd95b", url: "/logos/grandpashabet.png" },
  { filename: "ilbet.png", title: "Ilbet", defaultColor: "#e30613", url: "/logos/ilbet.png" },
  { filename: "kralbet.png", title: "Kralbet", defaultColor: "#ffc618", url: "/logos/kralbet.png" },
  { filename: "ligobet.png", title: "Ligobet", defaultColor: "#008947", url: "/logos/ligobet.png" },
  { filename: "lostbahis.webp", title: "Lostbahis", defaultColor: "#f8fafb", url: "/logos/lostbahis.webp" },
  { filename: "maltcasino.png", title: "Maltcasino", defaultColor: "#ffca00", url: "/logos/maltcasino.png" },
  { filename: "mariobet.png", title: "Mariobet", defaultColor: "#f6a117", url: "/logos/mariobet.png" },
  { filename: "matadorbet.png", title: "Matadorbet", defaultColor: "#e52d12", url: "/logos/matadorbet.png" },
  { filename: "maxwin.png", title: "Maxwin", defaultColor: "#9bda04", url: "/logos/maxwin.png" },
  { filename: "mersobahis.gif", title: "Mersobahis", defaultColor: "#e6e6e6", url: "/logos/mersobahis.gif" },
  { filename: "meybet.png", title: "Meybet", defaultColor: "#00e4ff", url: "/logos/meybet.png" },
  { filename: "mistycasino.svg", title: "Mistycasino", defaultColor: "#ffe93f", url: "/logos/mistycasino.svg" },
  { filename: "olabahis.png", title: "Olabahis", defaultColor: "#fffd64", url: "/logos/olabahis.png" },
  { filename: "onwin.svg", title: "Onwin", defaultColor: "#c411aa", url: "/logos/onwin.svg" },
  { filename: "otobet.png", title: "Otobet", defaultColor: "#fba200", url: "/logos/otobet.png" },
  { filename: "paribahis.png", title: "Paribahis", defaultColor: "#f8ff13", url: "/logos/paribahis.png" },
  { filename: "pinbahis.png", title: "Pinbahis", defaultColor: "#00a13a", url: "/logos/pinbahis.png" },
  { filename: "pusulabet.png", title: "Pusulabet", defaultColor: "#e79c28", url: "/logos/pusulabet.png" },
  { filename: "ramadabet.png", title: "Ramadabet", defaultColor: "#dd0732", url: "/logos/ramadabet.png" },
  { filename: "rokubet.svg", title: "Rokubet", defaultColor: "#e5a235", url: "/logos/rokubet.svg" },
  { filename: "sahabet.jpg", title: "Sahabet", defaultColor: "#4eb079", url: "/logos/sahabet.jpg" },
  { filename: "sahabet.png", title: "Sahabet", defaultColor: "#4eb079", url: "/logos/sahabet.png" },
  { filename: "samosbet.png", title: "Samosbet", defaultColor: "#ed9803", url: "/logos/samosbet.png" },
  { filename: "sekabet.png", title: "Sekabet", defaultColor: "#ed8b00", url: "/logos/sekabet.png" },
  { filename: "spinco.png", title: "Spinco", defaultColor: "#1cb322", url: "/logos/spinco.png" },
  { filename: "sportsbet.png", title: "Sportsbet", defaultColor: "#49b356", url: "/logos/sportsbet.png" },
  { filename: "stake.svg", title: "Stake", defaultColor: "#ffffff", url: "/logos/stake.svg" },
  { filename: "starzbet.png", title: "Starzbet", defaultColor: "#ff6d00", url: "/logos/starzbet.png" },
  { filename: "supertoto.png", title: "Supertoto", defaultColor: "#ed3338", url: "/logos/supertoto.png" },
  { filename: "tarafbet.png", title: "Tarafbet", defaultColor: "#178b42", url: "/logos/tarafbet.png" },
  { filename: "tipobet.png", title: "Tipobet", defaultColor: "#0f853d", url: "/logos/tipobet.png" },
  { filename: "vegasslot.png", title: "Vegasslot", defaultColor: "#d10e1e", url: "/logos/vegasslot.png" },
  { filename: "vipslot.png", title: "Vipslot", defaultColor: "#ea1917", url: "/logos/vipslot.png" },
  { filename: "xslot.png", title: "Xslot", defaultColor: "#2dbcb4", url: "/logos/xslot.png" },
  { filename: "zbahis.png", title: "Zbahis", defaultColor: "#03ffff", url: "/logos/zbahis.png" }
];

export const LogoSelectionModal = ({ isOpen, onClose, onSelect }: LogoSelectionModalProps) => {
  const [selectedLogo, setSelectedLogo] = useState<string>("");

  const handleLogoClick = (logoData: LogoData) => {
    setSelectedLogo(logoData.url);
    onSelect(logoData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-full max-h-[80vh] sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Logo Seçin
          </DialogTitle>
        </DialogHeader>

        <div className="h-[60vh] w-full overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {AVAILABLE_LOGOS.map((logoData) => (
              <div
                key={logoData.filename}
                className="relative group cursor-pointer border-1 border-white/5 hover:bg-white/5 rounded-lg p-4 transition-colors"
                onClick={() => handleLogoClick(logoData)}
              >
                <div className="aspect-square relative">
                  <Image
                    src={logoData.url}
                    alt={logoData.title}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium text-white/70 truncate">
                    {logoData.title}
                  </p>
                  <div
                    className="w-4 h-4 mx-auto mt-1 rounded-full border border-white/30"
                    style={{ backgroundColor: logoData.defaultColor }}
                    title={`Default Color: ${logoData.defaultColor}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 