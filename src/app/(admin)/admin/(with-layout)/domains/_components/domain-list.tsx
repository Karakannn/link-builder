"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Globe, CheckCircle, AlertCircle, Copy, Trash, ExternalLink, Settings } from "lucide-react";
import { Domain, Site } from "@prisma/client";
import { toast } from "sonner";
import { addDomain, deleteDomain, verifyDomain, getDnsInstructions } from "@/actions/domain";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DomainWithSite extends Domain {
    site: {
        id: string;
        name: string;
        isPublished: boolean;
    } | null;
}

interface Props {
    domains: DomainWithSite[];
    sites: Site[];
}

export function DomainList({ domains, sites }: Props) {
    const [isAddingDomain, setIsAddingDomain] = useState(false);
    const [domainName, setDomainName] = useState("");
    const [selectedSiteId, setSelectedSiteId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

    // Get sites that have homepages
    const sitesWithHomepage = sites.filter((site:any) => site.pages && site.pages.length > 0);

    const handleAddDomain = async () => {
        if (!domainName || !selectedSiteId) {
            toast.error("Lütfen tüm alanları doldurun");
            return;
        }

        // Domain adını temizle ve kontrol et
        const cleanDomainName = domainName.toLowerCase().trim();
        

        // Aynı domain adının zaten var olup olmadığını kontrol et
        const existingDomain = domains.find(d => d.name.toLowerCase() === cleanDomainName);
        if (existingDomain) {
            toast.error("Bu domain adı zaten kullanılıyor");
            return;
        }

        setIsLoading(true);
        try {
            const result = await addDomain({
                name: cleanDomainName,
                siteId: selectedSiteId,
            });

            if (result.status === 200) {
                toast.success("Domain başarıyla eklendi!");
                setIsAddingDomain(false);
                setDomainName("");
                setSelectedSiteId("");
                // Sayfayı yenile
                window.location.reload();
            } else {
                toast.error(result.message || "Domain eklenirken bir hata oluştu");
            }
        } catch (error) {
            toast.error("Beklenmeyen bir hata oluştu");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyDomain = async (domainId: string) => {
        setIsLoading(true);
        try {
            const result = await verifyDomain(domainId);

            if (result.status === 200) {
                toast.success("Domain verified successfully!");
            } else {
                toast.error(result.message || "Domain verification failed");
            }
        } catch (error) {
            toast.error("An error occurred during verification");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteDomain = async (domainId: string) => {
        if (!confirm("Are you sure you want to delete this domain?")) {
            return;
        }

        setIsLoading(true);
        try {
            const result = await deleteDomain(domainId);

            if (result.status === 200) {
                toast.success("Domain deleted successfully!");
            } else {
                toast.error(result.message || "Failed to delete domain");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const getStatusBadge = (domain: DomainWithSite) => {
        if (!domain.isVerified) {
            return <Badge variant="destructive">Needs Setup</Badge>;
        }

        if (domain.sslStatus === "active") {
            return <Badge variant="default">Active</Badge>;
        }

        return <Badge variant="secondary">SSL Pending</Badge>;
    };

    const getDnsInstructionsForDomain = async (domainName: string) => {
        try {
            const result = await getDnsInstructions(domainName);
            return result.instructions;
        } catch (error) {
            return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Custom Domains</h2>
                    <p className="text-muted-foreground">Connect your own domain to your published sites</p>
                </div>
                <Dialog open={isAddingDomain} onOpenChange={setIsAddingDomain}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Domain
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Custom Domain</DialogTitle>
                            <DialogDescription>Connect a custom domain to one of your published sites</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div>
                                <Label htmlFor="domain">Domain Name</Label>
                                <Input id="domain" placeholder="example.com" value={domainName} onChange={(e) => setDomainName(e.target.value)} />
                                <p className="text-xs text-muted-foreground mt-1">Don't include http:// or www</p>
                            </div>
                            <div>
                                <Label htmlFor="site">Select Site</Label>
                                <Select value={selectedSiteId} onValueChange={setSelectedSiteId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a published site" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sitesWithHomepage.length === 0 ? (
                                            <div className="p-2 text-sm text-muted-foreground">
                                                No sites with homepage available. Please create a homepage first.
                                            </div>
                                        ) : (
                                            sitesWithHomepage.map((site) => (
                                                <SelectItem key={site.id} value={site.id}>
                                                    {site.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleAddDomain} disabled={isLoading || sitesWithHomepage.length === 0} className="w-full">
                                {isLoading ? "Adding..." : "Add Domain"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {domains.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-10">
                            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No domains added yet</h3>
                            <p className="text-muted-foreground text-center mb-4">Add a custom domain to display your site on your own URL</p>
                            {sitesWithHomepage.length === 0 && (
                                <p className="text-sm text-amber-600 mb-4">You need to create a homepage before adding domains</p>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    domains.map((domain) => (
                        <Card key={domain.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-5 w-5" />
                                        <div>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                {domain.name}
                                                <Button variant="ghost" size="sm" onClick={() => window.open(`http://${domain.name}`, "_blank")}>
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </CardTitle>
                                            <CardDescription>{domain.site ? `Connected to ${domain.site.name}` : "Not connected to any site"}</CardDescription>
                                        </div>
                                    </div>
                                    {getStatusBadge(domain)}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {!domain.isVerified ? (
                                    <div className="space-y-4">
                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                                            <div className="flex items-start gap-2">
                                                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                                                <div className="space-y-2 flex-1">
                                                    <p className="text-sm font-medium">Domain setup required</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Configure your domain's DNS settings to point to our servers
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <Collapsible open={expandedDomain === domain.id} onOpenChange={(open) => setExpandedDomain(open ? domain.id : null)}>
                                            <CollapsibleTrigger asChild>
                                                <Button variant="outline" className="w-full">
                                                    <Settings className="h-4 w-4 mr-2" />
                                                    {expandedDomain === domain.id ? "Hide" : "Show"} DNS Instructions
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="space-y-4 mt-4">
                                                <div className="border rounded-lg p-4 space-y-4">
                                                    <h4 className="font-medium">DNS Configuration</h4>
                                                    <p className="text-sm text-muted-foreground">Add these DNS records at your domain provider:</p>

                                                    <div className="space-y-3">
                                                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-sm font-medium">Type: A Record</span>
                                                                <Button size="sm" variant="ghost" onClick={() => copyToClipboard("127.0.0.1")}>
                                                                    <Copy className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                            <div className="text-xs">
                                                                <div>Name: @ (root domain)</div>
                                                                <div>Value: 127.0.0.1</div>
                                                            </div>
                                                        </div>

                                                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-sm font-medium">Type: CNAME</span>
                                                                <Button size="sm" variant="ghost" onClick={() => copyToClipboard("localhost:3000")}>
                                                                    <Copy className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                            <div className="text-xs">
                                                                <div>Name: www</div>
                                                                <div>Value: localhost:3000</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>

                                        <Button onClick={() => handleVerifyDomain(domain.id)} disabled={isLoading} className="w-full">
                                            {isLoading ? "Verifying..." : "I've configured DNS - Verify Domain"}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="text-sm font-medium">Domain is active</p>
                                                <p className="text-xs text-muted-foreground">Your site is now available at {domain.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteDomain(domain.id)} disabled={isLoading}>
                                        <Trash className="h-4 w-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
