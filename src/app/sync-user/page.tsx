"use client";

import { syncCurrentUserToDatabase } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

export default function SyncUserPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const result = await syncCurrentUserToDatabase();
      
      if (result.status === 200) {
        toast.success(result.message);
        // Redirect to dashboard after successful sync
        window.location.href = "/admin/dashboard";
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while syncing user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sync User Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the button below to sync your Clerk account with the database.
          </p>
          <Button 
            onClick={handleSync} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Syncing..." : "Sync User"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 