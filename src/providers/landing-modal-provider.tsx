"use client";

import { createContext, useContext, useState } from "react";
import { LandingModal } from "@/components/global/landing-modal";
import { useEditor } from "@/providers/editor/editor-provider";
import { EditorElement } from "@/providers/editor/editor-provider";

interface LandingModalContextType {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

const LandingModalContext = createContext<LandingModalContextType>({
    isOpen: false,
    openModal: () => {},
    closeModal: () => {},
});

export function LandingModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    };
    const closeModal = () => setIsOpen(false);
    
    return (
        <LandingModalContext.Provider value={{ isOpen, openModal, closeModal }}>
            {children}
            <LandingModal 
                isOpen={isOpen} 
                onClose={closeModal}
            />
        </LandingModalContext.Provider>
    );
}

export const useLandingModal = () => {
    const context = useContext(LandingModalContext);
    if (!context) {
        throw new Error("useLandingModal must be used within a LandingModalProvider");
    }
    return context;
};
