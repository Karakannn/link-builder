// src/components/editor/spacing-visualizer.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface SpacingVisualizerProps {
    marginTop?: string | number;
    marginRight?: string | number;
    marginBottom?: string | number;
    marginLeft?: string | number;
    paddingTop?: string | number;
    paddingRight?: string | number;
    paddingBottom?: string | number;
    paddingLeft?: string | number;
    className?: string;
}

export const SpacingVisualizer: React.FC<SpacingVisualizerProps> = ({
    marginTop = '0px',
    marginRight = '0px',
    marginBottom = '0px',
    marginLeft = '0px',
    paddingTop = '0px',
    paddingRight = '0px',
    paddingBottom = '0px',
    paddingLeft = '0px',
    className
}) => {
    const parseValue = (value: string | number): string => {
        return typeof value === 'number' ? `${value}px` : value;
    };

    const hasMargin = marginTop !== '0px' || marginRight !== '0px' ||
        marginBottom !== '0px' || marginLeft !== '0px';


    const hasPadding = paddingTop !== '0px' || paddingRight !== '0px' ||
        paddingBottom !== '0px' || paddingLeft !== '0px';
    console.log("hasMargin", hasMargin);
    console.log("hasPadding", hasPadding);

    return (
        <>
            {/* Margin Visualization */}
            {hasMargin && (
                <div
                    className={cn("absolute pointer-events-none", className)}
                    style={{
                        top: `-${parseValue(marginTop)}`,
                        right: `-${parseValue(marginRight)}`,
                        bottom: `-${parseValue(marginBottom)}`,
                        left: `-${parseValue(marginLeft)}`,
                        border: '1px dashed rgba(255, 152, 0, 0.5)',
                        backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    }}
                >
                    {/* Margin labels */}
                    {marginTop !== '0px' && (
                        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs bg-orange-500 text-white px-1 rounded whitespace-nowrap">
                            {parseValue(marginTop)}
                        </div>
                    )}
                    {marginRight !== '0px' && (
                        <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 text-xs bg-orange-500 text-white px-1 rounded whitespace-nowrap">
                            {parseValue(marginRight)}
                        </div>
                    )}
                    {marginBottom !== '0px' && (
                        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs bg-orange-500 text-white px-1 rounded whitespace-nowrap">
                            {parseValue(marginBottom)}
                        </div>
                    )}
                    {marginLeft !== '0px' && (
                        <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 text-xs bg-orange-500 text-white px-1 rounded whitespace-nowrap">
                            {parseValue(marginLeft)}
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
                            top: parseValue(paddingTop),
                            right: parseValue(paddingRight),
                            bottom: parseValue(paddingBottom),
                            left: parseValue(paddingLeft),
                        }}
                    />

                    {/* Padding labels */}
                    {paddingTop !== '0px' && (
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs bg-green-500 text-white px-1 rounded whitespace-nowrap z-10">
                            {parseValue(paddingTop)}
                        </div>
                    )}
                    {paddingRight !== '0px' && (
                        <div className="absolute top-1/2 right-1 transform -translate-y-1/2 text-xs bg-green-500 text-white px-1 rounded whitespace-nowrap z-10">
                            {parseValue(paddingRight)}
                        </div>
                    )}
                    {paddingBottom !== '0px' && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs bg-green-500 text-white px-1 rounded whitespace-nowrap z-10">
                            {parseValue(paddingBottom)}
                        </div>
                    )}
                    {paddingLeft !== '0px' && (
                        <div className="absolute top-1/2 left-1 transform -translate-y-1/2 text-xs bg-green-500 text-white px-1 rounded whitespace-nowrap z-10">
                            {parseValue(paddingLeft)}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};