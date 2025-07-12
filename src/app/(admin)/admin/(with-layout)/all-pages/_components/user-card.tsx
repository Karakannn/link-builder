import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Settings, Plus } from "lucide-react";
import { SiteCard } from "./site-card";

type UserCardProps = {
  user: any;
  onEdit: (pageId: string) => void;
  onDelete: (pageId: string, pageTitle: string) => void;
  onSetAsHome: (pageId: string, pageTitle: string) => void;
  onOpenSettings: (site: any) => void;
  onCreatePage?: (site: any) => void;
};

export const UserCard = ({ user, onEdit, onDelete, onSetAsHome, onOpenSettings, onCreatePage }: UserCardProps) => {
  const sitesWithPages = user.sites.filter((site: any) => site.pages.length > 0);
  const totalPages = user.sites.reduce((acc: number, site: any) => acc + site.pages.length, 0);

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
                {user.firstname} {user.lastname}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary">{totalPages} sayfa</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="divide-y">
          {sitesWithPages.map((site: any) => (
            <SiteCard
              key={site.id}
              site={site}
              onEdit={onEdit}
              onDelete={onDelete}
              onSetAsHome={onSetAsHome}
              onOpenSettings={onOpenSettings}
              onCreatePage={onCreatePage}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};