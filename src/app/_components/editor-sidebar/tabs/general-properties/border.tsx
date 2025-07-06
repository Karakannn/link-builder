import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { ColorPicker, ColorPickerSelection, ColorPickerHue, ColorPickerAlpha, ColorPickerOutput, ColorPickerFormat } from '@/components/ui/color-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider'
import React from 'react'

type Props = {}

const BorderProperties = (props: Props) => {

  const { getCurrentStyles, handleStyleColorChangeComplete, handleOnChanges } = useEditorSidebar();

  return (
    <AccordionItem value="Border" className="px-0 py-0 ">
      <AccordionTrigger className="px-6 !no-underline">Border</AccordionTrigger>
      <AccordionContent className="px-6 flex flex-col gap-4">
        <div>
          <Label className="text-muted-foreground">Border Width</Label>
          <div className="flex items-center justify-end">
            <small className="p-2">
              {(() => {
                const borderWidth = getCurrentStyles().borderWidth;
                if (typeof borderWidth === "number") return borderWidth;
                if (typeof borderWidth === "string") {
                  return parseFloat(borderWidth.replace("px", "")) || 0;
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
                  id: "borderWidth",
                  value: `${e[0]}px`,
                },
              });
            }}
            defaultValue={[(() => {
              const borderWidth = getCurrentStyles().borderWidth;
              if (typeof borderWidth === "number") return borderWidth;
              if (typeof borderWidth === "string") {
                return parseFloat(borderWidth.replace("px", "")) || 0;
              }
              return 0;
            })()]}
            max={20}
            step={1}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground">Border Style</Label>
          <Select
            value={getCurrentStyles().borderStyle || "solid"}
            onValueChange={(value) => {
              handleOnChanges({
                target: {
                  id: "borderStyle",
                  value: value,
                },
              });
            }}
          >
            <SelectTrigger>
              <SelectValue className="w-full" placeholder="Border Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Border Styles</SelectLabel>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
                <SelectItem value="double">Double</SelectItem>
                <SelectItem value="groove">Groove</SelectItem>
                <SelectItem value="ridge">Ridge</SelectItem>
                <SelectItem value="inset">Inset</SelectItem>
                <SelectItem value="outset">Outset</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <small className="text-xs text-muted-foreground">
            Not: Element seçildiğinde border style geçici olarak değişebilir
          </small>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground">Border Color</Label>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: getCurrentStyles().borderColor as string }}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <ColorPicker
                  value={getCurrentStyles().borderColor}
                  onChangeComplete={(value) => handleStyleColorChangeComplete("borderColor", value)}
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
              placeholder="#000000" 
              className="flex-1" 
              id="borderColor" 
              onChange={handleOnChanges}
              value={getCurrentStyles().borderColor || ""} 
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
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
          <Label className="text-muted-foreground">Box Shadow</Label>
          <Input 
            placeholder="0px 0px 0px 0px rgba(0,0,0,0)" 
            className="flex-1" 
            id="boxShadow" 
            onChange={handleOnChanges}
            value={getCurrentStyles().boxShadow || ""} 
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export default BorderProperties 