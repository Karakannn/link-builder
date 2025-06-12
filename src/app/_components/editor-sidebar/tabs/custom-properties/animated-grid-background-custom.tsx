import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider';
import { useEditorSidebar } from '@/providers/editor/editor-sidebar-provider';
import React from 'react'

type Props = {}

const AnimatedGridBackgroundCustomProperties = (props: Props) => {

    const { handleChangeCustomValues, getCurrentContent } = useEditorSidebar();

    return (
        <>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Grid Width</p>
                <Input id="width" type="number" placeholder="40" onChange={handleChangeCustomValues} value={getCurrentContent().width} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Grid Height</p>
                <Input id="height" type="number" placeholder="40" onChange={handleChangeCustomValues} value={getCurrentContent().height} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Number of Squares</p>
                <Input id="numSquares" type="number" placeholder="50" onChange={handleChangeCustomValues} value={getCurrentContent().numSquares} />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Max Opacity</p>
                <Slider
                    value={[getCurrentContent().maxOpacity * 100 || 50]}
                    onValueChange={(value) => handleChangeCustomValues({
                        target: { id: "maxOpacity", value: value[0] / 100 }
                    } as any)}
                    max={100}
                    step={1}
                />
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Duration (seconds)</p>
                <Input id="duration" type="number" placeholder="4" onChange={handleChangeCustomValues} value={getCurrentContent().duration} />
            </div>
        </>
    )
}

export default AnimatedGridBackgroundCustomProperties