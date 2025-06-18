"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { X } from "lucide-react";
import Recursive from "@/app/_components/editor/_components-editor/recursive";

interface LandingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LandingModal({ isOpen, onClose}: LandingModalProps) {
    const [modalKey, setModalKey] = useState(0);
    const { state, dispatch } = useEditor();
    const elements = state.editor.elements;

    console.log("state.editor.elements", state.editor.elements);
    
    // Filter out __body and get actual content elements
    const contentElements = elements.filter(element => element.type !== '__body');
    
    // Update modal key when modal opens to force re-render
    useEffect(() => {
        if (isOpen) {
            console.log("Modal opened, updating modalKey...");
            setModalKey(prev => prev + 1);
            
            // Enable live mode when modal opens
            dispatch({ type: "TOGGLE_LIVE_MODE", payload: { value: true } });
        } else {
            // Disable live mode when modal closes
            dispatch({ type: "TOGGLE_LIVE_MODE", payload: { value: false } });
        }
    }, [isOpen, dispatch]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden p-0">
                <div className="flex flex-col h-full" key={modalKey}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                        <h2 className="text-lg font-semibold">Landing Modal Preview</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    
                    {/* Preview Area */}
                    <div className="flex-1 p-6 bg-gray-100">
                        <div className="max-w-md mx-auto">
                            {/* Modal Container */}
                            <div className="bg-white rounded-lg shadow-xl border overflow-hidden">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                                    <h3 className="font-medium">Modal Title</h3>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                {/* Modal Content */}
                                <div className="p-6 min-h-[300px]">
                                    {contentElements.length > 0 ? (
                                        <div>
                                            {contentElements.map((element, index) => {
                                                console.log(`Rendering content element ${index}:`, element);
                                                return (
                                                    <Recursive key={`${element.id}-${modalKey}`} element={element} />
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-48 text-gray-500 text-center">
                                            <div>
                                                <p className="mb-2">No content added yet</p>
                                                <p className="text-sm">Add some elements to see how your modal will look</p>
                                                <p className="text-xs mt-2 text-gray-400">
                                                    Debug: {elements.length} total elements, {contentElements.length} content elements
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Instructions */}
                            <div className="mt-4 text-center text-sm text-gray-600">
                                <p>This is how your landing modal will appear to visitors</p>
                                <p className="mt-1">Make changes in the editor and click "Preview Modal" again to see updates</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 