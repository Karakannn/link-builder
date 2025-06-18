"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MODAL_TEMPLATES, ModalTemplate } from "@/constants/modal-templates";
import { MODAL_THEMES, ModalTheme } from "@/constants/modal-templates";
import { MODAL_LAYOUTS, ModalLayout } from "@/constants/modal-templates";
import { Check, Plus, Loader2 } from "lucide-react";

interface ModalTemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateModal: (name: string, template: ModalTemplate, theme: ModalTheme, layout: ModalLayout) => void;
}

export const ModalTemplateSelectionModal = ({ 
  isOpen, 
  onClose, 
  onCreateModal 
}: ModalTemplateSelectionModalProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ModalTemplate | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<ModalTheme | null>(null);
  const [selectedLayout, setSelectedLayout] = useState<ModalLayout | null>(null);
  const [modalName, setModalName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateModal = async () => {
    if (!selectedTemplate || !selectedTheme || !selectedLayout || !modalName.trim()) {
      return;
    }
    
    setIsLoading(true);
    try {
      await onCreateModal(modalName.trim(), selectedTemplate, selectedTheme, selectedLayout);
      
      // Reset form
      setSelectedTemplate(null);
      setSelectedTheme(null);
      setSelectedLayout(null);
      setModalName("");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return; // Prevent closing while loading
    
    setSelectedTemplate(null);
    setSelectedTheme(null);
    setSelectedLayout(null);
    setModalName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Yeni Modal Oluştur</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Modal Info Form */}
          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <div>
              <Label htmlFor="modal-name">Modal Adı</Label>
              <Input
                id="modal-name"
                value={modalName}
                onChange={(e) => setModalName(e.target.value)}
                placeholder="Örn: Hoşgeldiniz Modalı"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Template Seçin</h3>
            <RadioGroup 
              value={selectedTemplate?.id || ""} 
              onValueChange={(value) => {
                const template = MODAL_TEMPLATES.find(t => t.id === value);
                setSelectedTemplate(template || null);
              }}
              disabled={isLoading}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {MODAL_TEMPLATES.map((template) => (
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
                        ? 'ring-2 ring-primary shadow-lg' 
                        : 'hover:shadow-md'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Card className="h-full">
                      <CardHeader className="text-center pb-3">
                        <div className="text-4xl mb-2">{template.thumbnail}</div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm text-card-foreground">{template.name}</h4>
                          {selectedTemplate?.id === template.id && (
                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground text-center">
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
            <h3 className="text-lg font-semibold mb-4 text-foreground">Tema Seçin</h3>
            <RadioGroup 
              value={selectedTheme?.id || ""} 
              onValueChange={(value) => {
                const theme = MODAL_THEMES.find(t => t.id === value);
                setSelectedTheme(theme || null);
              }}
              disabled={isLoading}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {MODAL_THEMES.map((theme) => (
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
                        ? 'ring-2 ring-primary shadow-lg' 
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
                          <h4 className="font-semibold text-sm text-card-foreground">{theme.name}</h4>
                          {selectedTheme?.id === theme.id && (
                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground text-center">
                          {theme.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Layout Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Layout Seçin</h3>
            <RadioGroup 
              value={selectedLayout?.id || ""} 
              onValueChange={(value) => {
                const layout = MODAL_LAYOUTS.find(l => l.id === value);
                setSelectedLayout(layout || null);
              }}
              disabled={isLoading}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {MODAL_LAYOUTS.map((layout) => (
                <div key={layout.id} className="relative">
                  <RadioGroupItem
                    value={layout.id}
                    id={`layout-${layout.id}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`layout-${layout.id}`}
                    className={`block cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedLayout?.id === layout.id 
                        ? 'ring-2 ring-primary shadow-lg' 
                        : 'hover:shadow-md'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Card className="h-full">
                      <CardHeader className="text-center pb-3">
                        <div className="text-4xl mb-2">{layout.thumbnail}</div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm text-card-foreground">{layout.name}</h4>
                          {selectedLayout?.id === layout.id && (
                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground text-center">
                          {layout.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Preview */}
          {selectedTemplate && selectedTheme && selectedLayout && (
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2 text-foreground">
                Seçilen: {selectedTemplate.name} - {selectedTheme.name} Tema - {selectedLayout.name} Layout
              </h4>
              <p className="text-sm text-muted-foreground">
                {selectedTemplate.description} • {selectedTheme.description} • {selectedLayout.description}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              İptal
            </Button>
            <Button 
              onClick={handleCreateModal}
              disabled={!selectedTemplate || !selectedTheme || !selectedLayout || !modalName.trim() || isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {isLoading ? "Oluşturuluyor..." : "Modal Oluştur"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 