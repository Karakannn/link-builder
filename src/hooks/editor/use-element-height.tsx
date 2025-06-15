import { useCallback, useState } from "react";

export const useElementHeight = (isDragging: boolean = false) => {
    const [height, setHeight] = useState<number | undefined>();

    const measureRef = useCallback((node: HTMLDivElement | null) => {
        if (node && !isDragging) {
            const rect = node.getBoundingClientRect();
            setHeight(rect.height);
        }
        return node;
    }, [isDragging]);

    return [measureRef, height] as const;
};