"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PAGE_TEMPLATES, PageTemplate } from "@/constants/page-templates";
import { THEME_OPTIONS, ThemeOption } from "@/constants/theme-options";
import { Check, Plus, Loader2 } from "lucide-react";

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePage: (title: string, slug: string, template: PageTemplate, theme: ThemeOption) => void;
}

export const TemplateSelectionModal = ({ 
  isOpen, 
  onClose, 
  onCreatePage 
}: TemplateSelectionModalProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption | null>(null);
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
    if (!selectedTemplate || !selectedTheme || !pageTitle.trim() || !pageSlug.trim()) {
      return;
    }
    
    setIsLoading(true);
    try {
      await onCreatePage(pageTitle.trim(), pageSlug.trim(), selectedTemplate, selectedTheme);
      
      // Reset form
      setSelectedTemplate(null);
      setSelectedTheme(null);
      setPageTitle("");
      setPageSlug("");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return; // Prevent closing while loading
    
    setSelectedTemplate(null);
    setSelectedTheme(null);
    setPageTitle("");
    setPageSlug("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Yeni Sayfa Oluştur</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Page Info Form */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="page-title">Sayfa Başlığı</Label>
                <Input
                  id="page-title"
                  value={pageTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Örn: Hakkımızda"
                  disabled={isLoading}
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
                />
              </div>
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Template Seçin</h3>
            <RadioGroup 
              value={selectedTemplate?.id || ""} 
              onValueChange={(value) => {
                const template = PAGE_TEMPLATES.find(t => t.id === value);
                setSelectedTemplate(template || null);
              }}
              disabled={isLoading}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {PAGE_TEMPLATES.map((template) => (
                <div key={template.id} className="relative">
                  <RadioGroupItem
                    value={template.id}
                    id={template.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={template.id}
                    className={`block cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedTemplate?.id === template.id 
                        ? 'ring-2 ring-blue-500 shadow-lg' 
                        : 'hover:shadow-md'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Card className="h-full">
                      <CardHeader className="text-center pb-3">
                        <div className="text-4xl mb-2">{template.thumbnail}</div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">{template.name}</h4>
                          {selectedTemplate?.id === template.id && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-gray-600 text-center">
                          {template.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Theme Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tema Seçin</h3>
            <RadioGroup 
              value={selectedTheme?.id || ""} 
              onValueChange={(value) => {
                const theme = THEME_OPTIONS.find(t => t.id === value);
                setSelectedTheme(theme || null);
              }}
              disabled={isLoading}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {THEME_OPTIONS.map((theme) => (
                <div key={theme.id} className="relative">
                  <RadioGroupItem
                    value={theme.id}
                    id={`theme-${theme.id}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`theme-${theme.id}`}
                    className={`block cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedTheme?.id === theme.id 
                        ? 'ring-2 ring-blue-500 shadow-lg' 
                        : 'hover:shadow-md'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Card className="h-full">
                      <CardHeader className="text-center pb-3">
                        <div 
                          className="w-16 h-16 mx-auto mb-3 rounded-full shadow-lg"
                          style={{ background: theme.gradient }}
                        />
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">{theme.name}</h4>
                          {selectedTheme?.id === theme.id && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-gray-600 text-center">
                          {theme.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Preview */}
          {selectedTemplate && selectedTheme && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">
                Seçilen: {selectedTemplate.name} - {selectedTheme.name} Tema
              </h4>
              <p className="text-sm text-gray-600">
                {selectedTemplate.description} • {selectedTheme.description}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              İptal
            </Button>
            <Button 
              onClick={handleCreatePage}
              disabled={!selectedTemplate || !selectedTheme || !pageTitle.trim() || !pageSlug.trim() || isLoading}
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