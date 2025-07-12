// components/domain-card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar, CheckCircle, Loader2, Trash2 } from "lucide-react";
import { useDomainActions } from "@/hooks/use-admin-domain-actions";

interface DomainCardProps {
  domain: any;
  onDelete: (domainId: string, domainName: string) => void;
  onVerify: (domainId: string, domainName: string) => void;
  isLoading: boolean;
}

export const DomainCard = ({ domain, onDelete, onVerify, isLoading }: DomainCardProps) => {
  const { formatDate } = useDomainActions();

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium truncate">
            {domain.name}
          </CardTitle>
          <div className="flex items-center gap-1">
            {domain.isVerified && (
              <Badge variant="default" className="text-xs">
                Doğrulanmış
              </Badge>
            )}
            <Badge variant={domain.sslStatus === "active" ? "default" : "outline"} className="text-xs">
              SSL {domain.sslStatus === "active" ? "Aktif" : "Bekliyor"}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-xs">
          Site: {domain.site.name}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(domain.createdAt)}
          </div>
        </div>
        
        <div className="flex gap-2">
          {!domain.isVerified && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onVerify(domain.id, domain.name)}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <CheckCircle className="w-3 h-3" />
              )}
              Doğrula
            </Button>
          )}
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Trash2 className="w-3 h-3" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Domaini Sil</AlertDialogTitle>
                <AlertDialogDescription>
                  <strong>"{domain.name}"</strong> domainini silmek istediğinizden emin misiniz? 
                  Bu işlem geri alınamaz ve domain kalıcı olarak silinecektir.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(domain.id, domain.name)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Evet, Sil
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};