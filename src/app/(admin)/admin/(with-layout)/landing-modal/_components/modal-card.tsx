"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

type Props = {
  modal: {
    id: string;
    name: string;
    isEnabled: boolean;
    createdAt: string;
    updatedAt: string;
  };
  onEdit: (modalId: string) => void;
  onDelete: (modalId: string) => void;
  isLoading?: boolean;
};

export const ModalCard = ({ modal, onEdit, onDelete, isLoading }: Props) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
              {modal.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={modal.isEnabled ? "default" : "secondary"}>
                {modal.isEnabled ? "Aktif" : "Pasif"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Modal Preview Placeholder */}
          <div className="bg-muted rounded-lg p-4 border-2 border-dashed border-border">
            <div className="text-center text-muted-foreground">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-sm">Modal Önizlemesi</p>
            </div>
          </div>
          
          {/* Modal Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDistanceToNow(new Date(modal.updatedAt), { 
                  addSuffix: true, 
                  locale: tr 
                })}
              </span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(modal.id)}
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-2" />
              Düzenle
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(modal.id)}
              disabled={isLoading}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 