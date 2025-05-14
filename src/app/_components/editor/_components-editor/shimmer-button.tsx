import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Trash } from "lucide-react";
import clsx from "clsx";
import React, { CSSProperties, useEffect, useRef } from "react";

type Props = {
    element: EditorElement;
};

const ShimmerButtonComponent = ({ element }: Props) => {
    const { state, dispatch } = useEditor();
    const { id, styles, content } = element;
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch({
            type: "CHANGE_CLICKED_ELEMENT",
            payload: {
                elementDetails: element,
            },
        });
    };

    const handleDeleteElement = () => {
        dispatch({
            type: "DELETE_ELEMENT",
            payload: {
                elementDetails: element,
            },
        });
    };

    // Extract shimmer button specific props from content with defaults
    const shimmerProps = !Array.isArray(content) ? content : {};
    const shimmerColor = shimmerProps.shimmerColor as string || "#ffffff";
    const shimmerSize = shimmerProps.shimmerSize as string || "0.1em";
    const shimmerDuration = shimmerProps.shimmerDuration as string || "2s";
    const borderRadius = shimmerProps.borderRadius as string || "10px";
    const background = shimmerProps.background as string || "rgba(99, 102, 241, 1)";
    const buttonText = shimmerProps.innerText || "Tıkla";
    
    return (
        <div
            style={styles}
            className={clsx("p-[2px] relative transition-all", {
                "!border-blue-500": state.editor.selectedElement.id === id,
                "!border-solid": state.editor.selectedElement.id === id,
                "!border-dashed border border-slate-300": !state.editor.liveMode,
            })}
            onClick={handleOnClickBody}
        >
            <ShimmerButton
                ref={buttonRef}
                shimmerColor={shimmerColor}
                shimmerSize={shimmerSize}
                shimmerDuration={shimmerDuration}
                borderRadius={borderRadius}
                background={background}
                className="w-full"
            >
                {buttonText}
            </ShimmerButton>

            {state.editor.selectedElement.id === id && !state.editor.liveMode && (
                <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
                    <Trash className="cursor-pointer" size={16} onClick={handleDeleteElement} />
                </div>
            )}
        </div>
    );
};

export default ShimmerButtonComponent; 