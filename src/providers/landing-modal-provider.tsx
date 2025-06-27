"use client";

import { createContext, useContext, useState } from "react";
import { LandingModal } from "@/components/global/landing-modal";
import { useEditor } from "@/providers/editor/editor-provider";
import { EditorElement } from "@/providers/editor/editor-provider";

interface LandingModalContextType {
    isOpen: boolean;
    modalContent: EditorElement[] | null;
    openModal: (content?: EditorElement[]) => void;
    closeModal: () => void;
}

const LandingModalContext = createContext<LandingModalContextType>({
    isOpen: false,
    modalContent: null,
    openModal: () => {},
    closeModal: () => {},
});

export function LandingModalProvider({ children, isPreview = false }: { children: React.ReactNode; isPreview?: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState<EditorElement[] | null>(null);

    const openModal = (content?: EditorElement[]) => {
        if (content) {
            setModalContent(content);
        }
        setIsOpen(true);
    };
    
    const closeModal = () => {
        setIsOpen(false);
        setModalContent(null);
    };
    
    return (
        <LandingModalContext.Provider value={{ isOpen, modalContent, openModal, closeModal }}>
            {children}
            <LandingModal 
                isOpen={isOpen} 
                onClose={closeModal}
                modalContent={modalContent || undefined}
                isPreview={isPreview}
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
