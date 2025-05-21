import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Globe, Home, Pencil, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface PageCardProps {
  page: any;
  onEdit?: (pageId: string) => void;
}

export const PageCard = ({ page, onEdit = () => {} }: PageCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const formattedDate = page.createdAt
    ? formatDistanceToNow(new Date(page.createdAt), {
        addSuffix: true,
        locale: tr,
      })
    : "Tarih bilgisi yok";

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <CardHeader className="relative pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-lg">{page.title}</h3>
          </div>
          {page.isHome && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Home className="h-3 w-3" />
              <span>Ana Sayfa</span>
            </Badge>
          )}
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span>Oluşturuldu: {formattedDate}</span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative overflow-hidden rounded-md bg-gray-50 h-32 flex items-center justify-center p-4 border">
          <div className={`transition-opacity duration-300 text-center ${isHovered ? "opacity-30" : "opacity-100"}`}>
            <p className="font-medium text-gray-800">{page.title}</p>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {page.slug} - {page.isHome ? "Ana Sayfa" : "Alt Sayfa"}
            </p>
          </div>

          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 transition-opacity duration-300">
              <Button variant="secondary" className="gap-2" onClick={() => onEdit(page.id)}>
                <Pencil className="h-4 w-4" />
                Sayfayı Düzenle
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" className="gap-1" onClick={() => onEdit(page.id)}>
          <Pencil className="h-3.5 w-3.5" />
          Düzenle
        </Button>
      </CardFooter>
    </Card>
  );
};
