// src/components/editor/spacing-visualizer.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface SpacingVisualizerProps {
    styles?: React.CSSProperties;
    className?: string;
}

export const SpacingVisualizer: React.FC<SpacingVisualizerProps> = ({
    styles = {},
    className
}) => {
    const parseValue = (value: string | number | undefined): string => {
        if (value === undefined || value === null) return '0px';
        return typeof value === 'number' ? `${value}px` : value;
    };

    // Extract spacing values from styles object
    const marginTop = parseValue(styles.marginTop);
    const marginRight = parseValue(styles.marginRight);
    const marginBottom = parseValue(styles.marginBottom);
    const marginLeft = parseValue(styles.marginLeft);
    const paddingTop = parseValue(styles.paddingTop);
    const paddingRight = parseValue(styles.paddingRight);
    const paddingBottom = parseValue(styles.paddingBottom);
    const paddingLeft = parseValue(styles.paddingLeft);

    const hasMargin = marginTop !== '0px' || marginRight !== '0px' ||
        marginBottom !== '0px' || marginLeft !== '0px';

    const hasPadding = paddingTop !== '0px' || paddingRight !== '0px' ||
        paddingBottom !== '0px' || paddingLeft !== '0px';

    // Don't show visualizer for absolute positioning to avoid conflicts
    const isAbsolute = styles.position === "absolute";
    const isFixed = styles.position === "fixed";

    if (isAbsolute || isFixed) {
        return null;
    }

    return (
        <>
            {/* Margin Visualization */}
            {hasMargin && (
                <div
                    className={cn("absolute pointer-events-none", className)}
                    style={{
                        top: `-${marginTop}`,
                        right: `-${marginRight}`,
                        bottom: `-${marginBottom}`,
                        left: `-${marginLeft}`,
                        border: '1px dashed rgba(255, 152, 0, 0.5)',
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    }}
                >
                    {/* Margin labels */}
                    {marginTop !== '0px' && (
                        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs bg-orange-500 text-white px-1 rounded whitespace-nowrap">
                            {marginTop}
                        </div>
                    )}
                    {marginRight !== '0px' && (
                        <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 text-xs bg-orange-500 text-white px-1 rounded whitespace-nowrap">
                            {marginRight}
                        </div>
                    )}
                    {marginBottom !== '0px' && (
                        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs bg-orange-500 text-white px-1 rounded whitespace-nowrap">
                            {marginBottom}
                        </div>
                    )}
                    {marginLeft !== '0px' && (
                        <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 text-xs bg-orange-500 text-white px-1 rounded whitespace-nowrap">
                            {marginLeft}
                        </div>
                    )}
                </div>
            )}

            {/* Padding Visualization */}
            {hasPadding && (
                <div className="absolute inset-0 pointer-events-none">
                    {/* Padding overlay */}
                    <div
                        className="absolute inset-0 border-2 border-dashed border-green-500/50"
                        style={{
                            top: paddingTop,
                            right: paddingRight,
                            bottom: paddingBottom,
                            left: paddingLeft,
                        }}
                    />

                    {/* Padding labels */}
                    {paddingTop !== '0px' && (
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs bg-green-500 text-white px-1 rounded whitespace-nowrap z-10">
                            {paddingTop}
                        </div>
                    )}
                    {paddingRight !== '0px' && (
                        <div className="absolute top-1/2 right-1 transform -translate-y-1/2 text-xs bg-green-500 text-white px-1 rounded whitespace-nowrap z-10">
                            {paddingRight}
                        </div>
                    )}
                    {paddingBottom !== '0px' && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs bg-green-500 text-white px-1 rounded whitespace-nowrap z-10">
                            {paddingBottom}
                        </div>
                    )}
                    {paddingLeft !== '0px' && (
                        <div className="absolute top-1/2 left-1 transform -translate-y-1/2 text-xs bg-green-500 text-white px-1 rounded whitespace-nowrap z-10">
                            {paddingLeft}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};