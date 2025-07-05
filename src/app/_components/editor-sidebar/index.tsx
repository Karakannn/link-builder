"use client";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    const { state, dispatch } = useEditor();

    const handleToggleLayerSidebar = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log("🔧 Toggle Layer Sidebar clicked, current state:", state.editor.layerSidebarCollapsed);
        dispatch({
            type: "TOGGLE_LAYER_SIDEBAR",
        });
    };

    return (
        <>
            {/* Sol Sidebar - Layers Panel */}
            <div
                className={clsx("fixed left-0 mt-[97px] z-[40] shadow-none bg-background border-r border-border transition-all overflow-hidden", {
                    "w-80": !state.editor.layerSidebarCollapsed,
                    "w-16": state.editor.layerSidebarCollapsed,
                    hidden: state.editor.previewMode,
                })}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className="h-[calc(100vh_-_97px)] overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col">
                    {!state.editor.layerSidebarCollapsed ? (
                        <>
                            <div className="text-left p-6">
                                <h2 className="text-lg font-semibold text-foreground">Layers</h2>
                                <p className="text-sm text-muted-foreground">Sayfadaki tüm elemanları gözden geçir ve düzenle</p>
                            </div>
                            <LayersTab />
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                            <button
                                onClick={handleToggleLayerSidebar}
                                className="p-2 hover:bg-accent rounded-md transition-colors"
                                title="Expand Layers"
                            >
                                <ChevronRight size={20} className="text-muted-foreground" />
                            </button>
                        </div>
                    )}
                    
                    {/* Toggle Button - Always visible */}
                    <div className="absolute top-4 right-2 z-[9999]">
                        <button
                            onClick={handleToggleLayerSidebar}
                            className="p-2 hover:bg-accent rounded-md transition-colors bg-background shadow-sm border border-border"
                            title={state.editor.layerSidebarCollapsed ? "Expand Layers" : "Collapse Layers"}
                        >
                            {state.editor.layerSidebarCollapsed ? (
                                <ChevronRight size={18} className="text-muted-foreground" />
                            ) : (
                                <ChevronLeft size={18} className="text-muted-foreground" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

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
                            <div className="flex flex-col h-full overflow-hidden">
                                <TabsContent value="Custom" className="flex-1 flex flex-col overflow-hidden">
                                    <SheetHeader className="text-left p-6 flex-shrink-0">
                                        <SheetTitle>Custom</SheetTitle>
                                        <SheetDescription>Custom Stiller burada. Tüm komponenta istediğin custom stili ekleyeyebilirsin</SheetDescription>
                                    </SheetHeader>
                                    <div className="flex-1 overflow-y-auto pb-6">
                                        <CustomTab />
                                    </div>
                                </TabsContent>

                                <TabsContent value="CustomCSS" className="flex-1 flex flex-col overflow-hidden">
                                    <div className="flex-1 overflow-y-auto pb-6">
                                        <CustomCSSTab />
                                    </div>
                                </TabsContent>

                                <TabsContent value="Settings" className="flex-1 flex flex-col overflow-hidden">
                                    <SheetHeader className="text-left p-6 flex-shrink-0">
                                        <SheetTitle>Stiller</SheetTitle>
                                        <SheetDescription>Stiller burada. Tüm komponentlara istediğin stili ekleyeyebilirsin</SheetDescription>
                                    </SheetHeader>
                                    <div className="flex-1 overflow-y-auto pb-6">
                                        <SettingsTab />
                                    </div>
                                </TabsContent>
                                <TabsContent value="Media" className="flex-1 flex flex-col overflow-hidden">
                                    <div className="flex-1 overflow-y-auto pb-6">
                                        <MediaBucketTab userId={userId} />
                                    </div>
                                </TabsContent>
                                <TabsContent value="Components" className="flex-1 flex flex-col overflow-hidden">
                                    <SheetHeader className="text-left p-6 flex-shrink-0">
                                        <SheetTitle>Components</SheetTitle>
                                        <SheetDescription>Burdan komponentları alıp sayfaya sürükleyebilirsin</SheetDescription>
                                    </SheetHeader>
                                    <div className="flex-1 overflow-y-auto pb-6">
                                        <ComponentsTab />
                                    </div>
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