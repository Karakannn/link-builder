"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserNav } from "@/components/global/user-nav";
import { DeviceTypes, useEditor } from "@/providers/editor/editor-provider";
import { useLandingModal } from "@/providers/landing-modal-provider";
import clsx from "clsx";
import { ArrowLeftCircle, EyeIcon, Laptop, Redo2, Smartphone, Tablet, Undo2, Square, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { FocusEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";
import { Page, User } from "@prisma/client";
import { upsertPage } from "@/actions/page";
import { saveLandingModalContent } from "@/actions/landing-modal";
import { saveLiveStreamCardContent } from "@/actions/live-stream-card";

interface Props {
  user: User;
  pageDetails: Page;
}

const FunnelEditorNavigation: React.FC<Props> = ({ user, pageDetails }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { state, dispatch } = useEditor();
  const { openModal } = useLandingModal();
  const [lastUpdated, setLastUpdated] = useState<Date>(pageDetails.updatedAt || new Date());
  const [isSaving, setIsSaving] = useState(false);

  // Check if we're on the landing modal page
  const isLandingModalPage = pathname?.includes('landing-modal');
  // Check if we're on the live stream card page
  const isLiveStreamCardPage = pathname?.includes('live-stream-cards');

  useEffect(() => {
    dispatch({
      type: "SET_PAGE_ID",
      payload: {
        pageId: pageDetails.id,
      },
    });
  }, [pageDetails]);

  // Format date for display
  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return "Az önce";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} dakika önce`;
    } else if (diffInMinutes < 1440) { // 24 hours
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} saat önce`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} gün önce`;
    }
  };

  const handleOnBlurTitleChange: FocusEventHandler<HTMLInputElement> = async (event) => {
    if (event.target.value === pageDetails.title) return;

    if (event.target.value) {
      /*   await upsertFunnelPage(
                  subaccountId,
                  {
                      id: funnelPageDetails.id,
                      name: event.target.value,
                      order: funnelPageDetails.order,
                  },
                  funnelId
              ); */

      toast.message("Başarılı", {
        description: "Sayfa başlığı başarıyla güncellendi",
      });
      router.refresh();
    } else {
      toast.message("Hata", {
        description: "Sayfa başlığı boş olamaz",
      });
      event.target.value = pageDetails.title;
    }
  };

  const handlePreviewClick = () => {
    dispatch({ type: "TOGGLE_PREVIEW_MODE" });
    dispatch({ type: "TOGGLE_LIVE_MODE" });
  };

  const handlePreviewModalClick = () => {
    openModal(state.editor.elements);
  };

  const handleUndo = () => {
    dispatch({ type: "UNDO" });
  };
  const handleRedo = () => {
    dispatch({ type: "REDO" });
  };
  const handleOnSave = async () => {
    if (isSaving) return; // Prevent multiple saves
    
    setIsSaving(true);
    const content = JSON.stringify(state.editor.elements);

    try {
      let response;
      
      if (isLandingModalPage) {
        // For landing modal pages, use saveLandingModalContent
        const modalId = pageDetails.id;
        response = await saveLandingModalContent(content, modalId);
        console.log("Modal save response:", response);
      } else if (isLiveStreamCardPage) {
        // For live stream card pages, use saveLiveStreamCardContent
        const cardId = pageDetails.id;
        response = await saveLiveStreamCardContent(content, cardId);
        console.log("Stream card save response:", response);
      } else {
        // For regular pages, use upsertPage
        response = await upsertPage({
          ...pageDetails,
          content: content,
        });
        console.log("Page save response:", response);
      }

      // Update last updated time
      setLastUpdated(new Date());

      toast("Başarılı", {
        description: isLandingModalPage ? "Modal başarıyla kaydedildi" : 
                   isLiveStreamCardPage ? "Stream card başarıyla kaydedildi" : 
                   "Sayfa başarıyla kaydedildi",
      });
    } catch (error) {
      console.error("Save error:", error);
      toast("Hata!", {
        description: isLandingModalPage ? "Modal kaydedilemedi" : 
                   isLiveStreamCardPage ? "Stream card kaydedilemedi" : 
                   "Editör kaydedilemedi",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TooltipProvider>
      <nav
        className={clsx(`border-b flex items-center justify-between p-6 gap-2 transition-all`, {
          "!h-0 !p-0 !overflow-hidden": state.editor.previewMode,
        })}
      >
        <aside className="flex items-center gap-4 max-w-[260px] w-[300px]">
          <Link href={
            isLandingModalPage ? `/admin/landing-modal` : 
            isLiveStreamCardPage ? `/admin/live-stream-cards` : 
            `/admin/sites`
          }>
            <ArrowLeftCircle />
          </Link>
          <div className="flex flex-col w-full">
            <Input defaultValue={pageDetails.title} className="border-none h-5 m-0 p-0 text-lg" onBlur={handleOnBlurTitleChange} />
          </div>
        </aside>
        <aside>
          <Tabs
            defaultValue="Desktop"
            className="w-fit"
            value={state.editor.device}
            onValueChange={(value) => {
              dispatch({
                type: "CHANGE_DEVICE",
                payload: { device: value as DeviceTypes },
              });
            }}
          >
            <TabsList className="grid w-full grid-cols-3 bg-transparent h-fit">
              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger value="Desktop" className="data-[state=active]:bg-muted w-10 h-10 p-0">
                    <Laptop />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Desktop</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger value="Tablet" className="data-[state=active]:bg-muted w-10 h-10 p-0">
                    <Tablet />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tablet</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <TabsTrigger value="Mobile" className="data-[state=active]:bg-muted w-10 h-10 p-0">
                    <Smartphone />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mobile</p>
                </TooltipContent>
              </Tooltip>
            </TabsList>
          </Tabs>
        </aside>
        <aside className="flex items-center gap-2">
          <Button variant={"ghost"} size={"icon"} className="hover:bg-slate-800" onClick={handlePreviewClick}>
            <EyeIcon />
          </Button>
          <Button disabled={!(state.history.currentIndex > 0)} onClick={handleUndo} variant={"ghost"} size={"icon"} className="hover:bg-slate-800">
            <Undo2 />
          </Button>
          <Button
            disabled={!(state.history.currentIndex < state.history.history.length - 1)}
            onClick={handleRedo}
            variant={"ghost"}
            size={"icon"}
            className="hover:bg-slate-800 mr-4"
          >
            <Redo2 />
          </Button>
          <div className="flex flex-col item-center mr-4">
            <span className="text-muted-foreground text-sm">Son güncelleme: {formatLastUpdated(lastUpdated)}</span>
          </div>
          <Button onClick={handleOnSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              "Kaydet"
            )}
          </Button>
          {isLandingModalPage && (
            <Button 
              variant="outline" 
              onClick={handlePreviewModalClick}
              className="ml-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
            >
              <Square className="w-4 h-4 mr-2" />
              Modal Önizle
            </Button>
          )}
          {isLiveStreamCardPage && (
            <Button 
              variant="outline" 
              onClick={handlePreviewModalClick}
              className="ml-2 bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
            >
              <Square className="w-4 h-4 mr-2" />
              Stream Card Önizle
            </Button>
          )}
          <div className="ml-2">
            <UserNav user={user} />
          </div>
        </aside>
      </nav>
    </TooltipProvider>
  );
};

export default FunnelEditorNavigation;
