"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Props {
  domain: string;
  verificationId: string;
}

export function DomainSetupGuide({ domain, verificationId }: Props) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Eğer Vercel kullanıyorsanız, otomatik olarak size bir CNAME target verir
  const cnameTarget = process.env.NEXT_PUBLIC_CNAME_TARGET || "cname.sitebuilder.com";
  const aRecordIP = process.env.NEXT_PUBLIC_A_RECORD_IP || "76.76.21.21"; // Vercel IP örneği

  return (
    <Card>
      <CardHeader>
        <CardTitle>Setup Instructions for {domain}</CardTitle>
        <CardDescription>
          Follow these steps to connect your domain to your site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="dns" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dns">DNS Setup</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dns" className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Choose one of the following methods:</h3>
              
              {/* CNAME Method (Recommended) */}
              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  Method 1: CNAME Record (Recommended)
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Subdomain only</span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  Use this method if you want to use a subdomain (e.g., www.{domain})
                </p>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="font-medium">Type</div>
                    <div className="font-medium">Name</div>
                    <div className="font-medium">Target</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    <div>CNAME</div>
                    <div>www</div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs">{cnameTarget}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(cnameTarget)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* A Record Method */}
              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  Method 2: A Record
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Root domain</span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  Use this method for root domain (e.g., {domain})
                </p>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="font-medium">Type</div>
                    <div className="font-medium">Name</div>
                    <div className="font-medium">Value</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    <div>A</div>
                    <div>@</div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs">{aRecordIP}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(aRecordIP)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Popular DNS Providers */}
              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="font-medium">Popular DNS Providers</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.godaddy.com/help/add-a-cname-record-19236" target="_blank" rel="noopener noreferrer">
                      GoDaddy Guide <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.namecheap.com/support/knowledgebase/article.aspx/9646" target="_blank" rel="noopener noreferrer">
                      Namecheap Guide <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/" target="_blank" rel="noopener noreferrer">
                      Cloudflare Guide <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-creating.html" target="_blank" rel="noopener noreferrer">
                      Route 53 Guide <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="verification" className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Domain Ownership Verification</h3>
              <p className="text-sm text-muted-foreground">
                Add this TXT record to verify you own the domain:
              </p>
              
              <div className="border rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="font-medium">Type</div>
                  <div className="font-medium">Name</div>
                  <div className="font-medium">Value</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  <div>TXT</div>
                  <div>_linkbuilder</div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs truncate max-w-[200px]">{verificationId}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(verificationId)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Note:</strong> DNS changes can take up to 48 hours to propagate, but usually happen within a few minutes.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}