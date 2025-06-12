import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { DeviceTypes } from '@/providers/editor/editor-provider'
import { Laptop, Tablet, Smartphone } from 'lucide-react'
import React from 'react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider'

type Props = {}

const DeviceProperties = (props: Props) => {

    const { handleResetToDesktop, activeDevice, setActiveDevice } = useEditorSidebar()

    return (
        <>
            {/* Device selector for responsive styles */}
            <div className="px-6 py-4 border-b flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Device</Label>
                    {activeDevice !== "Desktop" && (
                        <Button
                            onClick={handleResetToDesktop}
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                        >
                            Reset to Desktop
                        </Button>
                    )}
                </div>

                <Tabs
                    value={activeDevice}
                    onValueChange={(value) => setActiveDevice(value as DeviceTypes)}
                    className="w-full"
                >
                    <TabsList className="w-full grid grid-cols-3">
                        <TabsTrigger value="Desktop" className="flex items-center gap-1.5">
                            <Laptop className="h-4 w-4" />
                            <span>Desktop</span>
                        </TabsTrigger>
                        <TabsTrigger value="Tablet" className="flex items-center gap-1.5">
                            <Tablet className="h-4 w-4" />
                            <span>Tablet</span>
                        </TabsTrigger>
                        <TabsTrigger value="Mobile" className="flex items-center gap-1.5">
                            <Smartphone className="h-4 w-4" />
                            <span>Mobile</span>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {activeDevice !== "Desktop" && (
                    <div className="bg-amber-50 text-amber-800 text-xs p-2 rounded mt-2">
                        Editing styles for {activeDevice} device
                    </div>
                )}
            </div>
        </>
    )
}

export default DeviceProperties