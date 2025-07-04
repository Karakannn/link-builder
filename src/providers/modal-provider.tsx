"use client";

import useMounted from "@/hooks/use-mounted";
import { createContext, useContext, useState } from "react";

interface ModalProviderProps {
    children: React.ReactNode;
}

export type ModalData = {
  
};

type ModalContextType = {
    data: ModalData;
    isOpen: boolean;
    setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => void;
    setClose: () => void;
};

export const ModalContext = createContext<ModalContextType>({
    data: {},
    isOpen: false,
    setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => {},
    setClose: () => {},
});

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState<ModalData>({});
    const [showingModal, setShowingModal] = useState<React.ReactNode>(null);
    const mounted = useMounted();

    const setOpen = async (modal: React.ReactNode, fetchData?: () => Promise<any>) => {
        if (modal) {
          
            setShowingModal(modal);
            setIsOpen(true);
        }
    };

    const setClose = () => {
        setIsOpen(false);
        setData({});
    };

    if (!mounted) return null;

    return (
        <ModalContext.Provider
            value={{
                data,
                isOpen,
                setOpen,
                setClose,
            }}
        >
            {children}
            {showingModal}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error("useModal must be used within a ModalProvider");
    return context;
};