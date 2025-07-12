// components/user-domain-card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Plus } from "lucide-react";
import { DomainCard } from "./admin-domain-card";

interface UserDomainCardProps {
  user: any;
  domains: any[];
  onAddDomain: () => void;
  onDeleteDomain: (domainId: string, domainName: string) => void;
  onVerifyDomain: (domainId: string, domainName: string) => void;
  loadingStates: Record<string, boolean>;
}

export const UserDomainCard = ({
  user,
  domains,
  onAddDomain,
  onDeleteDomain,
  onVerifyDomain,
  loadingStates
}: UserDomainCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {user?.firstname} {user?.lastname}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {user?.email}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {domains.length} domain
            </Badge>
            <Button size="sm" variant="outline" onClick={onAddDomain}>
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {domains.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            Bu kullanıcının henüz domaini bulunmuyor.
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {domains.map((domain: any) => (
                <DomainCard
                  key={domain.id}
                  domain={domain}
                  onDelete={onDeleteDomain}
                  onVerify={onVerifyDomain}
                  isLoading={loadingStates[domain.id]}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};