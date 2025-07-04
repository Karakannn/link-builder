// src/providers/border-visibility-provider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface BorderVisibilityContextType {
    showBorders: boolean;
    borderLevel: number;
    hoveredElementId: string | null;
    focusMode: boolean;
    toggleBorders: () => void;
    setBorderLevel: (level: number) => void;
    setHoveredElement: (id: string | null) => void;
    toggleFocusMode: () => void;
    resetBorders: () => void;
}

const BorderVisibilityContext = createContext<BorderVisibilityContextType | null>(null);

export const BorderVisibilityProvider = ({ children }: { children: React.ReactNode }) => {
    const [showBorders, setShowBorders] = useState(true);
    const [borderLevel, setBorderLevel] = useState(2); // 0-3 arası, 2 varsayılan
    const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
    const [focusMode, setFocusMode] = useState(false);

    const toggleBorders = () => setShowBorders(prev => !prev);
    const toggleFocusMode = () => setFocusMode(prev => !prev);

    const resetBorders = () => {
        setShowBorders(true);
        setBorderLevel(2);
        setFocusMode(false);
        setHoveredElementId(null);
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Ctrl/Cmd + B: Toggle borders
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                toggleBorders();
            }

            // Ctrl/Cmd + F: Toggle focus mode
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                toggleFocusMode();
            }

            // Ctrl/Cmd + 1-4: Set border level
            if ((e.ctrlKey || e.metaKey) && ['1', '2', '3', '4'].includes(e.key)) {
                e.preventDefault();
                setBorderLevel(parseInt(e.key) - 1);
            }

            // Escape: Reset borders
            if (e.key === 'Escape') {
                setHoveredElementId(null);
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, []);

    return (
        <BorderVisibilityContext.Provider value={{
            showBorders,
            borderLevel,
            hoveredElementId,
            focusMode,
            toggleBorders,
            setBorderLevel,
            setHoveredElement: setHoveredElementId,
            toggleFocusMode,
            resetBorders,
        }}>
            {children}
        </BorderVisibilityContext.Provider>
    );
};

export const useBorderVisibility = () => {
    const context = useContext(BorderVisibilityContext);
    if (!context) {
        throw new Error('useBorderVisibility must be used within BorderVisibilityProvider');
    }
    return context;
};