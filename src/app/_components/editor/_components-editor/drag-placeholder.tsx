import { MoveIcon } from "lucide-react";
import React from "react";

interface DragPlaceholderProps {
    style?: React.CSSProperties;
    className?: string;
    height?: string | number;
}

export const DragPlaceholder = ({ style, height, className }: DragPlaceholderProps) => {
    console.log("height", height);
    
    return (

        <div
            className={`backdrop-blur-sm bg-white/5 border border-blue-500 rounded-lg relative overflow-hidden flex justify-center items-center ${className}`}
            style={{
                ...style,
                height: height || 'auto',
                minHeight: height || '50px'
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-500/10 animate-pulse" />
            <MoveIcon className="size-6 animate-pulse" />
        </div>

    )
}