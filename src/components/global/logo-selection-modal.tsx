"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface LogoSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (logoPath: string) => void;
}

// List of all logos in the public/logos folder
const AVAILABLE_LOGOS = [
  "asyabahis.png",
  "bahiscom.png", 
  "bahisen.png",
  "bankobet.png",
  "betewin.png",
  "betjuve.jpg",
  "betkom.png",
  "betturkey.png",
  "casibom.jpeg",
  "dahibet-dark.png",
  "dahibet.png",
  "dumanbet.png",
  "elcortez.png",
  "fixbet.png",
  "grandpashabet.png",
  "ilbet.png",
  "kralbet.png",
  "maltcasino.png",
  "mariobet.png",
  "matadorbet.png",
  "olabahis.png",
  "onwin.svg",
  "otobet.png",
  "pinbahis.png",
  "pusulabet.png",
  "rokubet.svg",
  "sahabet.jpg",
  "samosbet.png",
  "sekabet.png",
  "spinco.png",
  "stake.svg",
  "starzbet.png",
  "tarafbet.png",
  "vegasslot.png",
  "zbahis.png"
];

export const LogoSelectionModal = ({ isOpen, onClose, onSelect }: LogoSelectionModalProps) => {
  const [selectedLogo, setSelectedLogo] = useState<string>("");

  const handleLogoClick = (logoName: string) => {
    const logoPath = `/logos/${logoName}`;
    setSelectedLogo(logoPath);
    onSelect(logoPath);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Logo Seçin
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="h-[60vh] w-full overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {AVAILABLE_LOGOS.map((logoName) => (
              <div
                key={logoName}
                className="relative group cursor-pointer border-1 border-white/5 hover:bg-white/5 rounded-lg p-4 transition-colors"
                onClick={() => handleLogoClick(logoName)}
              >
                <div className="aspect-square relative">
                  <Image
                    src={`/logos/${logoName}`}
                    alt={logoName.split('.')[0]}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium text-gray-700 truncate capitalize">
                    {logoName.split('.')[0]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 