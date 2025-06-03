"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserNav } from "@/components/global/user-nav";
import { DeviceTypes, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { ArrowLeftCircle, EyeIcon, Laptop, Redo2, Smartphone, Tablet, Undo2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FocusEventHandler, useEffect } from "react";
import { toast } from "sonner";
import { Page, User } from "@prisma/client";
import { upsertPage } from "@/actions/page";

interface Props {
  user: User;
  pageDetails: Page;
}

const FunnelEditorNavigation: React.FC<Props> = ({ user, pageDetails }) => {
  const router = useRouter();
  const { state, dispatch } = useEditor();

  useEffect(() => {
    dispatch({
      type: "SET_PAGE_ID",
      payload: {
        pageId: pageDetails.id,
      },
    });
  }, [pageDetails]);

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

      toast.message("Success", {
        description: "Funnel page title updated successfully",
      });
      router.refresh();
    } else {
      toast.message("Oppse", {
        description: "Funnel page title cannot be empty",
      });
      event.target.value = pageDetails.title;
    }
  };

  const handlePreviewClick = () => {
    dispatch({ type: "TOGGLE_PREVIEW_MODE" });
    dispatch({ type: "TOGGLE_LIVE_MODE" });
  };
  const handleUndo = () => {
    dispatch({ type: "UNDO" });
  };
  const handleRedo = () => {
    dispatch({ type: "REDO" });
  };
  const handleOnSave = async () => {
    const content = JSON.stringify(state.editor.elements);

    try {
      const response = await upsertPage({
        ...pageDetails,
        content: content,
      });

      console.log("response", response);

      /*      await saveActivityLogsNotification({
                  agencyId: undefined,
                  description: `Updated a funnel page | ${response?.name}`,
                  subAccountId: subaccountId,
              }); */
      toast("Success", {
        description: "Page saved successfully",
      });
    } catch (error) {
      toast("Oppse!", {
        description: "Could not save editor",
      });
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
          <Link href={`/admin/sites`}>
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
            <div className="flex flex-row items-center gap-4">
              Draft
              <Switch disabled defaultChecked={true} />
              Publish
            </div>
            <span className="text-muted-foreground text-sm">Last updated şimdiiii</span>
          </div>
          <Button onClick={handleOnSave}>Save</Button>
          <div className="ml-2">
            <UserNav user={user} />
          </div>
        </aside>
      </nav>
    </TooltipProvider>
  );
};

export default FunnelEditorNavigation;
