"use client";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import React from "react";
import ComponentsTab from "./tabs/components-tab";
import TabList from "./tabs";
import SettingsTab from "./tabs/settings-tab";
import MediaBucketTab from "./tabs/media-bucket-tab";

type Props = {
    subaccountId: string;
};

const FunnelEditorSidebar = ({ subaccountId }: Props) => {
    const { state, dispatch } = useEditor();

    return (
        <Sheet open={true} modal={false}>
            <Tabs className="w-full" defaultValue="Settings">
                <SheetContent
                
                    side={"right"}
                    className={clsx("mt-[97px] w-16 z-[80] shadow-none p-0 focus:border-none transition-all overflow-hidden", {
                        hidden: state.editor.previewMode,
                    })}
                >
                    <TabList />
                </SheetContent>
                <SheetContent
                    side={"right"}
                    className={clsx("mt-[97px] w-80 z-[40] shadow-none p-0 mr-16 focus:border-none transition-all overflow-hidden", {
                        hidden: state.editor.previewMode,
                    })}
                >
                    <div className="grid gap-4 h-[calc(100%_-_97px)] overflow-y-auto overflow-x-hidden no-scrollbar">
                        <TabsContent value="Settings">
                            <SheetHeader className="text-left p-6">
                                <SheetTitle>Styles</SheetTitle>
                                <SheetDescription>Stiller burada. Tüm komponentlara istediğin stili ekleyeyebilirsin</SheetDescription>
                            </SheetHeader>
                            <SettingsTab />
                        </TabsContent>
                        <TabsContent value="Media">
                            <MediaBucketTab subaccountId={subaccountId} />
                        </TabsContent>
                        <TabsContent value="Components">
                            <SheetHeader className="text-left p-6 ">
                                <SheetTitle>Components</SheetTitle>
                                <SheetDescription>Burdan komponentları alıp sayfaya sürükleyebilirsin</SheetDescription>
                            </SheetHeader>
                            <ComponentsTab />
                        </TabsContent>
                    </div>
                </SheetContent>
            </Tabs>
        </Sheet>
    );
};

export default FunnelEditorSidebar;