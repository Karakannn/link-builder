"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { getPublicSiteOverlaySettings, getPublicLandingModalContent } from "@/actions/landing-modal";
import { LiveStreamCard } from "@/components/global/live-stream-card";
import { X } from "lucide-react";
import Recursive from "@/app/_components/editor/_components-editor/recursive";
import { EditorElement } from "@/providers/editor/editor-provider";

interface OverlayContextType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    hasLandingModal: boolean;
    hasLiveStream: boolean;
    modalContent: EditorElement[] | null;
    liveStreamLink: string | null;
    isLoading: boolean;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export const useOverlay = () => {
    const context = useContext(OverlayContext);
    if (!context) {
        throw new Error("useOverlay must be used within an OverlayProvider");
    }
    return context;
};

interface OverlayProviderProps {
    children: React.ReactNode;
    siteId: string;
}

export const OverlayProvider = ({ children, siteId }: OverlayProviderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasLandingModal, setHasLandingModal] = useState(false);
    const [hasLiveStream, setHasLiveStream] = useState(false);
    const [modalContent, setModalContent] = useState<EditorElement[] | null>(null);
    const [liveStreamLink, setLiveStreamLink] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const hasCheckedRef = useRef(false);

    useEffect(() => {
        if (hasCheckedRef.current) return;
        
        const checkOverlay = async () => {
            try {
                setIsLoading(true);
                
                // Get site settings - use public action for custom domain
                const settingsResult = await getPublicSiteOverlaySettings(siteId);
                
                if (settingsResult.status === 200 && settingsResult.settings) {
                    const { 
                        enableOverlay, 
                        selectedModalId, 
                        liveStreamLink: streamLink 
                    } = settingsResult.settings;
                    
                    if (enableOverlay) {
                        // Check landing modal
                        if (selectedModalId) {
                            const modalResult = await getPublicLandingModalContent(selectedModalId);
                            if (modalResult && modalResult.content) {
                                // Parse the modal content properly
                                let parsedContent: EditorElement[] = [];
                                try {
                                    const content = typeof modalResult.content === 'string' 
                                        ? JSON.parse(modalResult.content) 
                                        : modalResult.content;
                                    
                                    if (Array.isArray(content)) {
                                        parsedContent = content as EditorElement[];
                                    }
                                } catch (parseError) {
                                    console.error("Error parsing modal content:", parseError);
                                }
                                
                                if (parsedContent.length > 0) {
                                    setModalContent(parsedContent);
                                    setHasLandingModal(true);
                                }
                            }
                        }
                        
                        // Check live stream
                        if (streamLink) {
                            setLiveStreamLink(streamLink);
                            setHasLiveStream(true);
                        }
                        
                        // Show overlay if at least one is configured
                        if (selectedModalId || streamLink) {
                            setIsOpen(true);
                        }
                    }
                }
            } catch (error) {
                console.error("Error checking overlay:", error);
            } finally {
                setIsLoading(false);
                hasCheckedRef.current = true;
            }
        };

        checkOverlay();
    }, [siteId]);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const value = {
        isOpen,
        setIsOpen,
        hasLandingModal,
        hasLiveStream,
        modalContent,
        liveStreamLink,
        isLoading
    };

    return (
        <OverlayContext.Provider value={value}>
            {children}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    onClick={handleBackdropClick}
                >
                    <div className="relative z-10 max-h-[90vh] max-w-[90vw] overflow-auto">
                        <div className="relative">
                            {/* Close button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            {/* Column layout for both components */}
                            <div className="flex flex-col md:flex-row gap-6 p-4">
                                {/* Landing Modal */}
                                {hasLandingModal && modalContent && (
                                    <div className="flex-1">
                                        <div className="bg-background rounded-lg shadow-xl border border-border overflow-hidden">
                                            <div className="p-6 min-h-[300px]">
                                                {modalContent.map((element) => (
                                                    <Recursive
                                                        key={element.id}
                                                        element={element}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Live Stream Card */}
                                {hasLiveStream && liveStreamLink && (
                                    <div className="flex-1">
                                        <LiveStreamCard 
                                            liveStreamLink={liveStreamLink}
                                            showCloseButton={false}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </OverlayContext.Provider>
    );
}; 