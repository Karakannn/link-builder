// components/domain-card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, ExternalLink, Trash, CheckCircle, AlertCircle } from "lucide-react";
import { Domain } from "@prisma/client";

interface DomainWithSite extends Domain {
    site: {
        id: string;
        name: string;
        isPublished: boolean;
    } | null;
}

interface DomainCardProps {
    domain: DomainWithSite;
    onVerify: (domainId: string) => void;
    onDelete: (domainId: string) => void;
    isLoading: boolean;
}

export const DomainCard = ({ domain, onVerify, onDelete, isLoading }: DomainCardProps) => {
    const getStatusBadge = () => {
        if (!domain.isVerified) {
            return <Badge variant="destructive">Needs Setup</Badge>;
        }
        if (domain.sslStatus === "active") {
            return <Badge variant="default">Active</Badge>;
        }
        return <Badge variant="secondary">SSL Pending</Badge>;
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5" />
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                                {domain.name}
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => window.open(`http://${domain.name}`, "_blank")}
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </CardTitle>
                            <CardDescription>
                                {domain.site 
                                    ? `Connected to ${domain.site.name}` 
                                    : "Not connected to any site"
                                }
                            </CardDescription>
                        </div>
                    </div>
                    {getStatusBadge()}
                </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
                {!domain.isVerified ? (
                    <div className="space-y-4">
                        <StatusAlert 
                            type="warning"
                            title="Domain setup required"
                            description="Configure your domain's DNS settings to point to our servers"
                        />
                        
                        <Button 
                            onClick={() => onVerify(domain.id)} 
                            disabled={isLoading} 
                            className="w-full"
                        >
                            {isLoading ? "Verifying..." : "I've configured DNS - Verify Domain"}
                        </Button>
                    </div>
                ) : (
                    <StatusAlert 
                        type="success"
                        title="Domain is active"
                        description={`Your site is now available at ${domain.name}`}
                    />
                )}

                <div className="flex justify-end">
                    <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => onDelete(domain.id)} 
                        disabled={isLoading}
                    >
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

// Status Alert Component
const StatusAlert = ({ type, title, description }: {
    type: 'success' | 'warning';
    title: string;
    description: string;
}) => {
    const bgColor = type === 'success' 
        ? "bg-green-50 dark:bg-green-900/20" 
        : "bg-yellow-50 dark:bg-yellow-900/20";
    
    const Icon = type === 'success' ? CheckCircle : AlertCircle;
    const iconColor = type === 'success' ? "text-green-600" : "text-yellow-600";

    return (
        <div className={`${bgColor} p-4 rounded-lg`}>
            <div className="flex items-start gap-2">
                <Icon className={`h-5 w-5 ${iconColor} mt-0.5`} />
                <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
            </div>
        </div>
    );
};