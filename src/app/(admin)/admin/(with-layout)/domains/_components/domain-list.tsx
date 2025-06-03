// src/app/(admin)/admin/(with-layout)/domains/_components/domain-list.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Globe, CheckCircle, XCircle, AlertCircle, Copy, Trash } from "lucide-react";
import { Domain, Site } from "@prisma/client";
import { toast } from "sonner";
import { addDomain, deleteDomain, verifyDomain } from "@/actions/domain";
import { DomainSetupGuide } from "./domain-setup-guide";

interface DomainWithSite extends Domain {
  site: Site | null;
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

  const handleAddDomain = async () => {
    if (!domainName || !selectedSiteId) {
      toast.error("Please fill all fields");
      return;
    }

    setIsLoading(true);
    try {
      const result = await addDomain({
        name: domainName.toLowerCase().trim(),
        siteId: selectedSiteId,
      });

      if (result.status === 200) {
        toast.success("Domain added successfully!");
        setIsAddingDomain(false);
        setDomainName("");
        setSelectedSiteId("");
      } else {
        toast.error(result.message || "Failed to add domain");
      }
    } catch (error) {
      toast.error("An error occurred");
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
      return <Badge variant="destructive">Unverified</Badge>;
    }
    
    if (domain.sslStatus === "active") {
      return <Badge variant="default">Active</Badge>;
    }
    
    return <Badge variant="secondary">SSL Pending</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Custom Domains</h2>
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
              <DialogDescription>
                Add a custom domain to one of your sites
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="domain">Domain Name</Label>
                <Input
                  id="domain"
                  placeholder="example.com"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="site">Select Site</Label>
                <Select value={selectedSiteId} onValueChange={setSelectedSiteId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddDomain} disabled={isLoading} className="w-full">
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
              <p className="text-muted-foreground">No domains added yet</p>
            </CardContent>
          </Card>
        ) : (
          domains.map((domain) => (
            <Card key={domain.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    <CardTitle className="text-lg">{domain.name}</CardTitle>
                  </div>
                  {getStatusBadge(domain)}
                </div>
                <CardDescription>
                  {domain.site ? `Connected to ${domain.site.name}` : "Not connected to any site"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!domain.isVerified && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div className="space-y-2 flex-1">
                        <p className="text-sm font-medium">Domain verification required</p>
                        <p className="text-xs text-muted-foreground">
                          Add the following TXT record to your domain's DNS settings:
                        </p>
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono flex items-center justify-between">
                          <span>_linkbuilder-verify.{domain.name}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(`_linkbuilder-verify.${domain.name}`)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono flex items-center justify-between">
                          <span className="truncate">{domain.verificationId}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(domain.verificationId)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleVerifyDomain(domain.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Verify Domain"}
                    </Button>
                  </div>
                )}

                {domain.isVerified && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-sm font-medium">Domain verified</p>
                    </div>
                    {domain.sslStatus === "pending" && (
                      <p className="text-xs text-muted-foreground mt-1">
                        SSL certificate is being provisioned...
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteDomain(domain.id)}
                    disabled={isLoading}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

          <div className="grid gap-4">
        {domains.map((domain) => (
          <div key={domain.id} className="space-y-4">
            <Card>
              {/* ... önceki card içeriği ... */}
              <CardContent className="space-y-4">
                {!domain.isVerified && (
                  <div className="space-y-4">
                    <DomainSetupGuide 
                      domain={domain.name} 
                      verificationId={domain.verificationId} 
                    />
                    <Button
                      onClick={() => handleVerifyDomain(domain.id)}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? "Verifying..." : "I've Added DNS Records - Verify Domain"}
                    </Button>
                  </div>
                )}
                {/* ... geri kalan kod ... */}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}