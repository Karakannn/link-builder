import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { ColorPicker, ColorPickerSelection, ColorPickerHue, ColorPickerAlpha, ColorPickerOutput, ColorPickerFormat } from '@/components/ui/color-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider'
import { AlignLeft, AlignRight, AlignJustify, AlignHorizontalSpaceBetween, AlignHorizontalSpaceAround, AlignHorizontalJustifyCenterIcon, AlignHorizontalJustifyStart, AlignHorizontalJustifyEndIcon, AlignVerticalJustifyCenter, AlignVerticalJustifyStart, ChevronsLeftRightIcon, LucideImageDown } from 'lucide-react'
import React from 'react'

type Props = {}

const DecorationsProperties = (props: Props) => {

  const { getCurrentStyles, handleStyleColorChangeComplete, handleOnChanges } = useEditorSidebar();

  return (
    <AccordionItem value="Decorations" className="px-0 py-0 ">
      <AccordionTrigger className="px-6 !no-underline">Decorations</AccordionTrigger>
      <AccordionContent className="px-6 flex flex-col gap-4">
        <div>
          <Label className="text-muted-foreground">Opacity</Label>
          <div className="flex items-center justify-end">
            <small className="p-2">
              {(() => {
                const opacity = getCurrentStyles().opacity;
                if (typeof opacity === "number") return opacity;
                if (typeof opacity === "string") {
                  return parseFloat(opacity.replace("%", "")) || 0;
                }
                return 0;
              })()}%
            </small>
          </div>
          <Slider
            onValueChange={(e) => {
              handleOnChanges({
                target: {
                  id: "opacity",
                  value: `${e[0]}%`,
                },
              });
            }}
            defaultValue={[(() => {
              const opacity = getCurrentStyles().opacity;
              if (typeof opacity === "number") return opacity;
              if (typeof opacity === "string") {
                return parseFloat(opacity.replace("%", "")) || 0;
              }
              return 0;
            })()]}
            max={100}
            step={1}
          />
        </div>
        <div>
          <Label className="text-muted-foreground">Border Radius</Label>
          <div className="flex items-center justify-end">
            <small className="p-2">
              {(() => {
                const borderRadius = getCurrentStyles().borderRadius;
                if (typeof borderRadius === "number") return borderRadius;
                if (typeof borderRadius === "string") {
                  return parseFloat(borderRadius.replace("px", "")) || 0;
                }
                return 0;
              })()}
              px
            </small>
          </div>
          <Slider
            onValueChange={(e) => {
              handleOnChanges({
                target: {
                  id: "borderRadius",
                  value: `${e[0]}px`,
                },
              });
            }}
            defaultValue={[(() => {
              const borderRadius = getCurrentStyles().borderRadius;
              if (typeof borderRadius === "number") return borderRadius;
              if (typeof borderRadius === "string") {
                return parseFloat(borderRadius.replace("px", "")) || 0;
              }
              return 0;
            })()]}
            max={100}
            step={1}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground">Background Color</Label>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: getCurrentStyles().backgroundColor as string }}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <ColorPicker
                  value={getCurrentStyles().backgroundColor}
                  onChangeComplete={(value) => handleStyleColorChangeComplete("backgroundColor", value)}
                >
                  <ColorPickerSelection className="h-32" />
                  <div className="flex flex-col gap-2 mt-4">
                    <ColorPickerHue />
                    <ColorPickerAlpha />
                    <div className="flex items-center gap-2">
                      <ColorPickerOutput />
                      <ColorPickerFormat />
                    </div>
                  </div>
                </ColorPicker>
              </PopoverContent>
            </Popover>
            <Input 
              placeholder="#HFI245" 
              className="flex-1" 
              id="backgroundColor" 
              onChange={handleOnChanges}
              value={getCurrentStyles().backgroundColor || ""} 
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground">Background Image</Label>
          <div className="flex border-[1px] rounded-md overflow-clip">
            <div
              className="w-12"
              style={{
                backgroundImage: getCurrentStyles().backgroundImage,
              }}
            />
            <Input placeholder="url()" className="!border-y-0 rounded-none !border-r-0 mr-2" id="backgroundImage" onChange={handleOnChanges} value={getCurrentStyles().backgroundImage || ""} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground">Image Position</Label>
          <Tabs
            onValueChange={(e) =>
              handleOnChanges({
                target: {
                  id: "backgroundSize",
                  value: e,
                },
              })
            }
            value={getCurrentStyles().backgroundSize?.toString()}
          >
            <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
              <TabsTrigger value="cover" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                <ChevronsLeftRightIcon size={18} />
              </TabsTrigger>
              <TabsTrigger value="contain" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                <AlignVerticalJustifyCenter size={22} />
              </TabsTrigger>
              <TabsTrigger value="auto" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                <LucideImageDown size={18} />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export default DecorationsProperties