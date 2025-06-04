"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { getDomainSetupInfo } from "@/actions/domain";

interface Props {
  domain: string;
  verificationId: string;
}

interface SetupInfo {
  cnameTarget: string;
  aRecord: string;
}

export function DomainSetupGuide({ domain, verificationId }: Props) {
  const [setupInfo, setSetupInfo] = useState<SetupInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSetupInfo = async () => {
      try {
        const result = await getDomainSetupInfo(domain);
        if (result.status === 200) {
          setSetupInfo({
            cnameTarget: result.cnameTarget!,
            aRecord: result.aRecord!,
          });
        }
      } catch (error) {
        console.error("Failed to fetch setup info:", error);
        toast.error("Failed to load setup information");
      } finally {
        setLoading(false);
      }
    };

    fetchSetupInfo();
  }, [domain]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!setupInfo) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">Failed to load setup information. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  const isSubdomain = domain.split('.').length > 2;
  const rootDomain = domain.split('.').slice(-2).join('.');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Setup Instructions for {domain}
        </CardTitle>
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
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <p className="text-sm">
                  <strong>Important:</strong> Add these DNS records at your domain provider ({rootDomain})
                </p>
              </div>

              {/* CNAME Method for subdomains */}
              {isSubdomain ? (
                <div className="border rounded-lg p-4 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    CNAME Record (Recommended for subdomains)
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Preferred</span>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Since you're using a subdomain ({domain}), add this CNAME record:
                  </p>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 p-2 rounded">
                      <div>Type</div>
                      <div>Name</div>
                      <div>Target</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded">
                      <div className="font-mono">CNAME</div>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                          {domain.split('.')[0]}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(domain.split('.')[0])}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                          {setupInfo.cnameTarget}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(setupInfo.cnameTarget)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* CNAME Method for www subdomain */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      Option 1: CNAME Record (www subdomain)
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Recommended</span>
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Set up www.{domain} to redirect to your site:
                    </p>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        <div>Type</div>
                        <div>Name</div>
                        <div>Target</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded">
                        <div className="font-mono">CNAME</div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">www</code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard("www")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                            {setupInfo.cnameTarget}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(setupInfo.cnameTarget)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* A Record Method for root domain */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      Option 2: A Record (root domain)
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Alternative</span>
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Point your root domain ({domain}) directly to our servers:
                    </p>
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        <div>Type</div>
                        <div>Name</div>
                        <div>Value</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded">
                        <div className="font-mono">A</div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">@</code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard("@")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                            {setupInfo.aRecord}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(setupInfo.aRecord)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

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
                <div className="grid grid-cols-3 gap-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  <div>Type</div>
                  <div>Name</div>
                  <div>Value</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded">
                  <div className="font-mono">TXT</div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                      _linkbuilder-verify
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard("_linkbuilder-verify")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded truncate max-w-[200px]">
                      {verificationId}
                    </code>
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
                  After adding both DNS records, click "Verify Domain" to check the setup.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}