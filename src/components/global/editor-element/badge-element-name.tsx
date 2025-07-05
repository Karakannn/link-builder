import { Badge } from "@/components/ui/badge";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { useElementBorderHighlight } from "@/hooks/editor/use-element-selection";
import React from "react";
import { Type, Square, Grid3X3, Image, Link, Video, FileImage, CreditCard, ArrowRight } from "lucide-react";

type Props = {
    element: EditorElement;
    gridSpan?: number;
    totalGridColumns?: number;
};

const BadgeElementName = ({ element, gridSpan, totalGridColumns }: Props) => {
    const { state } = useEditor();
    const { shouldShowBadge, isSelected } = useElementBorderHighlight(element);

    // Eğer badge gösterilmeyecekse null döndür
    if (!shouldShowBadge) {
        return null;
    }

    // Element tipine göre icon ve kısa isim al
    const getElementInfo = () => {
        switch (element.type) {
            case "text":
                return { icon: Type, shortName: "T", fullName: "Text" };
            case "container":
                return { icon: Square, shortName: "C", fullName: "Container" };
            case "gridLayout":
                return { icon: Grid3X3, shortName: "G", fullName: "Grid" };
            case "column":
                const sizeInfo = gridSpan && totalGridColumns && isSelected 
                    ? ` ${gridSpan}/${totalGridColumns}`
                    : "";
                return { icon: Square, shortName: "Col", fullName: `Column${sizeInfo}` };
            case "image":
                return { icon: Image, shortName: "I", fullName: "Image" };
            case "link":
                return { icon: Link, shortName: "L", fullName: "Link" };
            case "video":
                return { icon: Video, shortName: "V", fullName: "Video" };
            case "gif":
                return { icon: FileImage, shortName: "GIF", fullName: "GIF" };
            case "sponsorNeonCard":
                return { icon: CreditCard, shortName: "Card", fullName: "Neon Card" };
            case "marquee":
                return { icon: ArrowRight, shortName: "M", fullName: "Marquee" };
            default:
                return { icon: Square, shortName: "?", fullName: element.name };
        }
    };

    const { icon: Icon, shortName, fullName } = getElementInfo();

    // Element boyutuna göre badge tipini belirle
    const getElementSize = () => {
        if (typeof window === 'undefined') return 'medium';
        
        const elementDom = document.querySelector(`[data-element-id="${element.id}"]`);
        if (!elementDom) return 'medium';
        
        const rect = elementDom.getBoundingClientRect();
        const area = rect.width * rect.height;
        
        if (area < 2000) return 'tiny';    // Çok küçük elementler
        if (area < 8000) return 'small';   // Küçük elementler  
        return 'medium';                   // Normal elementler
    };

    const elementSize = getElementSize();

    // Boyuta göre badge render et
    if (elementSize === 'tiny') {
        // Çok küçük elementler: Sadece icon
        return (
            <div className="absolute -top-4 -left-1 w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center z-[999] pointer-events-none">
                <Icon size={10} className="text-white" />
            </div>
        );
    }

    if (elementSize === 'small') {
        // Küçük elementler: Icon + kısa isim
        return (
            <Badge className="absolute -top-5 -left-[1px] rounded-sm px-1 py-0 text-[9px] bg-blue-500 text-white z-[999] pointer-events-none select-none flex items-center gap-1 h-4">
                <Icon size={8} />
                <span>{shortName}</span>
            </Badge>
        );
    }

    // Normal elementler: Icon + tam isim
    return (
        <Badge className="absolute -top-6 -left-[1px] rounded-none rounded-t-lg px-2 py-1 text-xs bg-blue-500 text-white z-[999] pointer-events-none select-none flex items-center gap-1.5 max-w-[120px] truncate">
            <Icon size={12} />
            <span>{fullName}</span>
        </Badge>
    );
};

export default BadgeElementName;