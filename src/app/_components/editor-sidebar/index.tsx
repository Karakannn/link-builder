"use client";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import React from "react";
import ComponentsTab from "./tabs/placeholder-elements";
import TabList from "./tabs";
import MediaBucketTab from "./tabs/media-bucket-tab";
import LayersTab from "./tabs/layers-tab";
import { SettingsTab } from "./tabs/settings-tab";
import EditorSidebarProvider from "@/providers/editor/editor-sidebar-provider";
import { CustomTab } from "./tabs/custom-tab";
import { CustomCSSTab } from "./tabs/custom-css-tab";

type Props = {
    userId: string;
};

const FunnelEditorSidebar = ({ userId }: Props) => {
    const { state } = useEditor();

    return (
        <>
            {/* Sol Sidebar - Layers Panel */}
            <Sheet open={true} modal={false}>
                <SheetContent
                    side={"left"}
                    className={clsx("mt-[97px] w-80 z-[40] shadow-none p-0 focus:border-none transition-all overflow-hidden", {
                        hidden: state.editor.previewMode,
                    })}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className="h-[calc(100%_-_97px)] overflow-y-auto overflow-x-hidden no-scrollbar">
                        <SheetHeader className="text-left p-6">
                            <SheetTitle>Layers</SheetTitle>
                            <SheetDescription>Sayfadaki tüm elemanları gözden geçir ve düzenle</SheetDescription>
                        </SheetHeader>
                        <LayersTab />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Sağ Sidebar - Ana Panel */}
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
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <EditorSidebarProvider>
                            <div className="grid gap-4 h-[calc(100%_-_97px)] overflow-y-auto overflow-x-hidden no-scrollbar">
                                <TabsContent value="Custom">
                                    <SheetHeader className="text-left p-6">
                                        <SheetTitle>Custom</SheetTitle>
                                        <SheetDescription>Custom Stiller burada. Tüm komponenta istediğin custom stili ekleyeyebilirsin</SheetDescription>
                                    </SheetHeader>
                                    <CustomTab />
                                </TabsContent>

                                <TabsContent value="CustomCSS">
                                    <CustomCSSTab />
                                </TabsContent>

                                <TabsContent value="Settings">
                                    <SheetHeader className="text-left p-6">
                                        <SheetTitle>Stiller</SheetTitle>
                                        <SheetDescription>Stiller burada. Tüm komponentlara istediğin stili ekleyeyebilirsin</SheetDescription>
                                    </SheetHeader>
                                    <SettingsTab />
                                </TabsContent>
                                <TabsContent value="Media">
                                    <MediaBucketTab userId={userId} />
                                </TabsContent>
                                <TabsContent value="Components">
                                    <SheetHeader className="text-left p-6 ">
                                        <SheetTitle>Components</SheetTitle>
                                        <SheetDescription>Burdan komponentları alıp sayfaya sürükleyebilirsin</SheetDescription>
                                    </SheetHeader>
                                    <ComponentsTab />
                                </TabsContent>
                            </div>
                        </EditorSidebarProvider>
                    </SheetContent>
                </Tabs>
            </Sheet>
        </>
    );
};

export default FunnelEditorSidebar;