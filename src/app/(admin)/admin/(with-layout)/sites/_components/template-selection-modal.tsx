"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePage: (title: string, slug: string) => void;
}

export const TemplateSelectionModal = ({ 
  isOpen, 
  onClose, 
  onCreatePage 
}: TemplateSelectionModalProps) => {
  const [pageTitle, setPageTitle] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTitleChange = (value: string) => {
    setPageTitle(value);
    // Auto-generate slug from title
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
    setPageSlug(slug);
  };

  const handleCreatePage = async () => {
    if (!pageTitle.trim() || !pageSlug.trim()) {
      return;
    }
    
    setIsLoading(true);
    try {
      await onCreatePage(pageTitle.trim(), pageSlug.trim());
      
      // Reset form
      setPageTitle("");
      setPageSlug("");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return; // Prevent closing while loading
    
    setPageTitle("");
    setPageSlug("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Yeni Sayfa Oluştur</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Page Info Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="page-title">Sayfa Başlığı</Label>
              <Input
                id="page-title"
                value={pageTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Örn: Hakkımızda"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && pageTitle.trim() && pageSlug.trim()) {
                    handleCreatePage();
                  }
                }}
              />
            </div>
            <div>
              <Label htmlFor="page-slug">Sayfa URL'i</Label>
              <Input
                id="page-slug"
                value={pageSlug}
                onChange={(e) => setPageSlug(e.target.value)}
                placeholder="Örn: hakkimizda"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && pageTitle.trim() && pageSlug.trim()) {
                    handleCreatePage();
                  }
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              İptal
            </Button>
            <Button 
              onClick={handleCreatePage}
              disabled={!pageTitle.trim() || !pageSlug.trim() || isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {isLoading ? "Oluşturuluyor..." : "Sayfa Oluştur"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 