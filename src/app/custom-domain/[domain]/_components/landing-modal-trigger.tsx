"use client";

import { useEffect, useRef } from "react";
import { useLandingModal } from "@/providers/landing-modal-provider";
import { getPublicLandingModalContent } from "@/actions/landing-modal";

interface LandingModalTriggerProps {
    modalId: string;
    siteId: string;
}

export function LandingModalTrigger({ modalId, siteId }: LandingModalTriggerProps) {
    const { openModal } = useLandingModal();
    const hasTriggered = useRef(false);

    useEffect(() => {
        if (hasTriggered.current) return;
        hasTriggered.current = true;
        const loadAndShowModal = async () => {
            try {
                console.log("🎯 [LandingModalTrigger] modalId:", modalId);
                // Modal content'ini yükle
                const modalContent = await getPublicLandingModalContent(modalId);
                console.log("🎯 [LandingModalTrigger] getPublicLandingModalContent result:", modalContent);
                if (modalContent && modalContent.content) {
                    let parsedContent: any[] = [];
                    try {
                        if (typeof modalContent.content === 'string') {
                            parsedContent = JSON.parse(modalContent.content);
                        } else if (Array.isArray(modalContent.content)) {
                            parsedContent = modalContent.content;
                        }
                    } catch (error) {
                        console.error("❌ Modal content parse error:", error);
                        return;
                    }
                    console.log("🎯 [LandingModalTrigger] Parsed modal content:", parsedContent);
                    // Modal'ı content ile birlikte aç
                    openModal(parsedContent);
                } else {
                    console.error("❌ Modal content not found or invalid");
                }
            } catch (error) {
                console.error("❌ Error loading landing modal:", error);
            }
        };
        loadAndShowModal();
    }, [modalId, siteId, openModal]);
    return null;
} 