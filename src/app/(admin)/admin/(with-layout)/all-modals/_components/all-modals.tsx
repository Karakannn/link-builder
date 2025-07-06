"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Edit,
  Trash2,
  Calendar,
  User,
  Loader2,
  AlertTriangle,
  Plus
} from "lucide-react";
import { adminDeleteModal, adminUpdateModalName, adminCreateModalFromTemplate, getUsersWithoutModals } from "@/actions/landing-modal";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModalTemplateSelectionModal } from "../../landing-modal/_components/modal-template-selection-modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Kullanıcıya göre grupla
function groupByUser(modals: any[]) {
  const grouped: Record<string, { user: any; modals: any[] }> = {};
  for (const modal of modals) {
    const userId = modal.user?.email || modal.user?.id || "unknown";
    if (!grouped[userId]) {
      grouped[userId] = {
        user: modal.user,
        modals: [],
      };
    }
    grouped[userId].modals.push(modal);
  }
  return grouped;
}

type ModalsData = {
  status: number;
  modals?: any[];
  message?: string;
};

type Props = {
  modalsData: ModalsData;
};

const AllModals = ({ modalsData }: Props) => {
  const router = useRouter();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [editingModal, setEditingModal] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newModalName, setNewModalName] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUserForCreate, setSelectedUserForCreate] = useState<any>(null);
  const [isCreatingModal, setIsCreatingModal] = useState(false);
  const [isGlobalCreateModalOpen, setIsGlobalCreateModalOpen] = useState(false);
  const [selectedGlobalUser, setSelectedGlobalUser] = useState<string>("");
  const [isGlobalCreatingModal, setIsGlobalCreatingModal] = useState(false);
  const [usersWithoutModals, setUsersWithoutModals] = useState<any[]>([]);

  const handleEdit = (modalId: string) => {
    router.push("/admin/landing-modal/builder/" + modalId);
  };

  const handleDeleteModal = async (modalId: string, modalName: string) => {
    setLoadingStates(prev => ({ ...prev, [modalId]: true }));
    try {
      const result = await adminDeleteModal(modalId);
      if (result.status === 200) {
        toast.success(`"${modalName}" modalı başarıyla silindi!`);
        router.refresh();
      } else {
        toast.error(result.message || "Modal silinirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setLoadingStates(prev => ({ ...prev, [modalId]: false }));
    }
  };

  const handleOpenEditName = (modal: any) => {
    setEditingModal(modal);
    setNewModalName(modal.name);
    setIsEditModalOpen(true);
  };

  const handleSaveModalName = async () => {
    if (!editingModal || !newModalName.trim()) return;
    setLoadingStates(prev => ({ ...prev, [editingModal.id]: true }));
    try {
      const result = await adminUpdateModalName(editingModal.id, newModalName.trim());
      if (result.status === 200) {
        toast.success("Modal adı başarıyla güncellendi!");
        setIsEditModalOpen(false);
        setEditingModal(null);
        setNewModalName("");
        router.refresh();
      } else {
        toast.error(result.message || "Modal adı güncellenirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    } finally {
      setLoadingStates(prev => ({ ...prev, [editingModal.id]: false }));
    }
  };

  const handleOpenCreateModal = (user: any) => {
    setSelectedUserForCreate(user);
    setIsCreateModalOpen(true);
  };

  const handleCreateModal = async (name: string) => {
    if (!selectedUserForCreate || !selectedUserForCreate.id) {
      toast.error("Kullanıcı bilgisi eksik");
      return;
    }
    
    setIsCreatingModal(true);
    try {
      console.log("[FRONTEND] Creating modal with:", {
        name,
        userId: selectedUserForCreate.id,
        userEmail: selectedUserForCreate.email,
        selectedUserForCreate
      });

      // Create a basic modal with default template
      const basicModalContent = [
        {
          id: "modal-container",
          name: "Modal Container",
          type: "container",
          styles: {
            display: "flex",
            flexDirection: "column",
            width: "500px",
            height: "300px",
            padding: "40px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            gap: "0.5rem",
          },
          content: [
            {
              id: "modal-title",
              name: "Modal Title",
              type: "text",
              styles: {
                fontSize: "24px",
                fontWeight: "bold",
                color: "#667eea",
                marginBottom: "20px",
                textAlign: "center",
              },
              content: {
                innerText: name,
              },
            },
            {
              id: "modal-content",
              name: "Modal Content",
              type: "text",
              styles: {
                fontSize: "16px",
                color: "#666",
                lineHeight: "1.6",
                textAlign: "center",
                marginBottom: "20px",
              },
              content: {
                innerText: "Modal içeriğini düzenlemek için editörde değişiklik yapın.",
              },
            },
            {
              id: "modal-button",
              name: "Modal Button",
              type: "link",
              styles: {
                padding: "12px 24px",
                fontSize: "16px",
                backgroundColor: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
                textAlign: "center",
                textDecoration: "none",
              },
              content: {
                href: "#",
                innerText: "Tamam",
              },
            },
          ],
        },
      ];
      
      console.log("[FRONTEND] Template content generated:", typeof basicModalContent);
      
      const result = await adminCreateModalFromTemplate(
        name, 
        JSON.parse(JSON.stringify(basicModalContent)),
        selectedUserForCreate.id
      );
      
      console.log("[FRONTEND] Backend result:", result);
      
      if (result.status === 200) {
        toast.success(`"${name}" modalı başarıyla oluşturuldu!`);
        setIsCreateModalOpen(false);
        setSelectedUserForCreate(null);
        router.refresh();
      } else {
        console.error("[FRONTEND] Backend error:", result);
        toast.error(result.message || "Modal oluşturulurken bir hata oluştu");
      }
    } catch (error) {
      console.error("[FRONTEND] Frontend error:", {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      toast.error(`Beklenmeyen bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    } finally {
      setIsCreatingModal(false);
    }
  };

  const handleGlobalCreateModal = async (name: string) => {
    if (!selectedGlobalUser) {
      toast.error("Lütfen bir kullanıcı seçin");
      return;
    }
    
    setIsGlobalCreatingModal(true);
    try {
      // Create a basic modal with default template
      const basicModalContent = [
        {
          id: "modal-container",
          name: "Modal Container",
          type: "container",
          styles: {
            display: "flex",
            flexDirection: "column",
            width: "500px",
            height: "300px",
            padding: "40px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            gap: "0.5rem",
          },
          content: [
            {
              id: "modal-title",
              name: "Modal Title",
              type: "text",
              styles: {
                fontSize: "24px",
                fontWeight: "bold",
                color: "#667eea",
                marginBottom: "20px",
                textAlign: "center",
              },
              content: {
                innerText: name,
              },
            },
            {
              id: "modal-content",
              name: "Modal Content",
              type: "text",
              styles: {
                fontSize: "16px",
                color: "#666",
                lineHeight: "1.6",
                textAlign: "center",
                marginBottom: "20px",
              },
              content: {
                innerText: "Modal içeriğini düzenlemek için editörde değişiklik yapın.",
              },
            },
            {
              id: "modal-button",
              name: "Modal Button",
              type: "link",
              styles: {
                padding: "12px 24px",
                fontSize: "16px",
                backgroundColor: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
                textAlign: "center",
                textDecoration: "none",
              },
              content: {
                href: "#",
                innerText: "Tamam",
              },
            },
          ],
        },
      ];
      
      const result = await adminCreateModalFromTemplate(
        name, 
        JSON.parse(JSON.stringify(basicModalContent)),
        selectedGlobalUser
      );
      
      if (result.status === 200) {
        toast.success(`"${name}" modalı başarıyla oluşturuldu!`);
        setIsGlobalCreateModalOpen(false);
        setSelectedGlobalUser("");
        router.refresh();
      } else {
        toast.error(result.message || "Modal oluşturulurken bir hata oluştu");
      }
    } catch (error) {
      toast.error(`Beklenmeyen bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    } finally {
      setIsGlobalCreatingModal(false);
    }
  };

  const handleOpenGlobalCreateModal = async () => {
    setIsGlobalCreateModalOpen(true);
    setSelectedGlobalUser("");
    
    try {
      const result = await getUsersWithoutModals();
      if (result.status === 200) {
        setUsersWithoutModals(result.users || []);
      } else {
        toast.error("Kullanıcı bilgileri yüklenirken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Beklenmeyen bir hata oluştu");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (modalsData.status !== 200) {
    return (
      <div className="p-6 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive">
        <h3 className="text-lg font-medium mb-2">Hata</h3>
        <p>{modalsData.message || "Modal verileri yüklenirken bir hata oluştu."}</p>
      </div>
    );
  }

  const grouped = groupByUser(modalsData.modals || []);
  const userCount = Object.keys(grouped).length;
  const modalCount = modalsData.modals?.length || 0;
  const activeCount = modalsData.modals?.filter((m: any) => m.isEnabled).length || 0;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tüm Landing Modalları</h1>
            <p className="text-muted-foreground mt-2">
              Sistemdeki tüm kullanıcıların landing modallarını görüntüleyin ve yönetin
            </p>
          </div>
          <Button 
            onClick={handleOpenGlobalCreateModal}
            className="gap-2"
            disabled={isGlobalCreatingModal}
          >
            {isGlobalCreatingModal ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {isGlobalCreatingModal ? "Oluşturuluyor..." : "Yeni Modal Oluştur"}
          </Button>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Modal</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{modalCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktif Modallar</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCount}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Kullanıcılar Listesi */}
      <div className="space-y-6">
        {userCount === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Henüz modal bulunamadı</h3>
              <p className="text-muted-foreground">Kullanıcılar henüz landing modal oluşturmamış.</p>
            </CardContent>
          </Card>
        ) : (
          Object.values(grouped).map(({ user, modals }) => (
            <Card key={user?.email || user?.id || Math.random()} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {user?.firstname} {user?.lastname}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {user?.email}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {modals.length} modal
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenCreateModal(user)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {modals.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    Bu kullanıcının henüz modalı bulunmuyor.
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {modals.map((modal: any) => (
                        <Card key={modal.id} className="border-dashed">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-medium truncate">
                                {modal.name}
                              </CardTitle>
                              {modal.isEnabled && (
                                <Badge variant="default" className="text-xs">
                                  Aktif
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="text-xs">
                              ID: {modal.id}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(modal.createdAt)}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(modal.id)}
                                className="flex-1"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Düzenle
                              </Button>
                              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleOpenEditName(modal)}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Modal Adını Düzenle</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="modal-name">Modal Adı</Label>
                                      <Input
                                        id="modal-name"
                                        value={newModalName}
                                        onChange={(e) => setNewModalName(e.target.value)}
                                        placeholder="Modal adını girin"
                                      />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setIsEditModalOpen(false);
                                          setEditingModal(null);
                                          setNewModalName("");
                                        }}
                                      >
                                        İptal
                                      </Button>
                                      <Button
                                        onClick={handleSaveModalName}
                                        disabled={loadingStates[editingModal?.id] || !newModalName.trim()}
                                      >
                                        {loadingStates[editingModal?.id] ? (
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                          "Kaydet"
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    disabled={loadingStates[modal.id]}
                                  >
                                    {loadingStates[modal.id] ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-3 h-3" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Modalı Sil</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      <strong>"{modal.name}"</strong> modalını silmek istediğinizden emin misiniz? 
                                      Bu işlem geri alınamaz ve modal kalıcı olarak silinecektir.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>İptal</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteModal(modal.id, modal.name)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Evet, Sil
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Modal Modal */}
      <ModalTemplateSelectionModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedUserForCreate(null);
        }}
        onCreateModal={handleCreateModal}
      />

      {/* Global Create Modal Modal */}
      <Dialog open={isGlobalCreateModalOpen} onOpenChange={setIsGlobalCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Yeni Modal Oluştur</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* User Selection */}
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <div>
                <Label htmlFor="user-select">Kullanıcı Seçin</Label>
                {usersWithoutModals.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Henüz modalı olmayan kullanıcı bulunmuyor. Tüm kullanıcıların zaten modalları var.
                  </div>
                ) : (
                  <Select value={selectedGlobalUser} onValueChange={setSelectedGlobalUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Bir kullanıcı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {usersWithoutModals.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstname} {user.lastname} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {selectedGlobalUser && (
              <ModalTemplateSelectionModal
                isOpen={true}
                onClose={() => {}}
                onCreateModal={handleGlobalCreateModal}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllModals; 