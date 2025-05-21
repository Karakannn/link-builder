import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Badge, Trash } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Recursive from "./recursive";
import { defaultStyles, EditorBtns } from "@/lib/constants";
import { v4 } from "uuid";

type Props = { element: EditorElement };

const Container = ({ element }: Props) => {
    
    const { id, name, type, styles, content } = element;
    const { dispatch, state } = useEditor();
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [elementBeingDragged, setElementBeingDragged] = useState<EditorElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Debug log when this component renders
    useEffect(() => {
        console.log(`Container rendered: id=${id}, type=${type}, name=${name}`);
    }, [id, type, name]);

    const handleOnDrop = (e: React.DragEvent, containerId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);

        console.log("=== DROP EVENT DETAILS ===");
        console.log("Target Container ID:", containerId);
        console.log("Target Container Type:", type);
        console.log("Target Container Name:", name);
        console.log("DataTransfer effectAllowed:", e.dataTransfer.effectAllowed);
        console.log("DataTransfer dropEffect:", e.dataTransfer.dropEffect);
        
        // Log all available data in dataTransfer
        console.log("DataTransfer types available:", e.dataTransfer.types);
        
        // Try to get the element ID if it exists
        const elementId = e.dataTransfer.getData("elementId");
        console.log("elementId from dataTransfer:", elementId);
        
        // Get component type
        const componentType = e.dataTransfer.getData("type") as EditorBtns;
        console.log("Component Type from dataTransfer:", componentType);
        
        // Try to get element details as JSON if it exists
        let elementDetails = null;
        try {
            const elementDetailsStr = e.dataTransfer.getData("elementDetails");
            if (elementDetailsStr) {
                elementDetails = JSON.parse(elementDetailsStr);
                console.log("elementDetails from dataTransfer:", elementDetails);
            }
        } catch (error) {
            console.log("No valid elementDetails in dataTransfer");
        }

        if (!componentType) {
            console.log("No component type found in dataTransfer");
            return;
        }

        // If we have an elementId, this might be a move operation not a create
        if (elementId) {
            console.log("This appears to be a MOVE operation for element:", elementId);
            
            // Skip if trying to move element to itself
            if (elementId === containerId) {
                console.log("Cannot move element to itself, skipping");
                return;
            }
            
            // Skip if trying to move a parent into its child
            if (isChildOf(state.editor.elements, containerId, elementId)) {
                console.log("Cannot move a parent into its child, skipping");
                return;
            }
            
            // Using the MOVE_ELEMENT action
            dispatch({
                type: "MOVE_ELEMENT",
                payload: {
                    elementId,
                    targetContainerId: containerId,
                }
            });
            
            console.log("Move operation dispatched");
            return;
        } else {
            console.log("This appears to be a CREATE operation for type:", componentType);
        }

        switch (componentType) {
            case "text":
                console.log("Adding TEXT element to container:", id);
                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {
                            id: v4(),
                            name: "Text",
                            content: {
                                innerText: "Text Element",
                            },
                            styles: {
                                ...defaultStyles,
                            },
                            type: "text",
                        },
                    },
                });
                break;
            case "container":
                console.log("Adding CONTAINER element to container:", id);
                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {
                            id: v4(),
                            name: "Container",
                            content: [],
                            styles: {
                                ...defaultStyles,
                            },
                            type: "container",
                        },
                    },
                });
                break;
            case "contactForm":
                console.log("Adding CONTACT FORM element to container:", id);
                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {
                            id: v4(),
                            name: "Contact Form",
                            content: [],
                            styles: {},
                            type: "contactForm",
                        },
                    },
                });
                break;
            case "paymentForm":
                console.log("Adding PAYMENT FORM element to container:", id);
                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: [],
                            id: v4(),
                            name: "Contact Form",
                            styles: {},
                            type: "paymentForm",
                        },
                    },
                });
                break;
            case "video":
                console.log("Adding VIDEO element to container:", id);
                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: {
                                src: "https://www.youtube.com/embed/A3l6YYkXzzg?si=zbcCeWcpq7Cwf8W1",
                            },
                            id: v4(),
                            name: "Video",
                            styles: {
                                width: "560px",
                                height: "315px",
                                ...defaultStyles,
                            },
                            type: "video",
                        },
                    },
                });
                break;
            case "shimmerButton":
                console.log("Adding SHIMMER BUTTON element to container:", id);
                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: {
                                innerText: "Tıkla",
                                shimmerColor: "#ffffff",
                                shimmerSize: "0.1em",
                                shimmerDuration: "2s",
                                borderRadius: "10px",
                                background: "rgba(99, 102, 241, 1)",
                            },
                            id: v4(),
                            name: "Shimmer Button",
                            styles: {
                                width: "200px",
                                textAlign: "center",
                                margin: "10px auto",
                                ...defaultStyles,
                            },
                            type: "shimmerButton",
                        },
                    },
                });
                break;
            case "link":
                console.log("Adding LINK element to container:", id);
                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {
                            id: v4(),
                            name: "Link",
                            content: {
                                href: "#",
                                innerText: "Link Element",
                            },
                            styles: {
                                ...defaultStyles,
                            },
                            type: "link",
                        },
                    },
                });
                break;

            case "2Col":
                console.log("Adding 2COL element to container:", id);
                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: [
                                {
                                    content: [],
                                    id: v4(),
                                    name: "Container",
                                    styles: {
                                        width: "1-0%",
                                        ...defaultStyles,
                                    },
                                    type: "container",
                                },
                                {
                                    content: [],
                                    id: v4(),
                                    name: "Container",
                                    styles: {
                                        width: "1-0%",
                                        ...defaultStyles,
                                    },
                                    type: "container",
                                },
                            ],
                            id: v4(),
                            name: "Two Columns",
                            styles: {
                                display: "flex",
                                ...defaultStyles,
                            },
                            type: "2Col",
                        },
                    },
                });
                break;
            default:
                console.log("Unknown component type:", componentType);
                break;
        }
    };

    // Helper function to check if targetId is a child of potentialParentId
    const isChildOf = (elements: EditorElement[], targetId: string, potentialParentId: string): boolean => {
        const findElement = (elements: EditorElement[], id: string): EditorElement | null => {
            for (const element of elements) {
                if (element.id === id) {
                    return element;
                }
                if (Array.isArray(element.content)) {
                    const found = findElement(element.content, id);
                    if (found) return found;
                }
            }
            return null;
        };
        
        const parent = findElement(elements, potentialParentId);
        if (!parent || !Array.isArray(parent.content)) return false;
        
        return parent.content.some(child => 
            child.id === targetId || 
            (Array.isArray(child.content) && isChildOf(elements, targetId, child.id))
        );
    };

    // Helper function to find an element by ID in the editor tree
    const findElementById = (elements: EditorElement[], targetId: string): EditorElement | null => {
        for (const element of elements) {
            if (element.id === targetId) {
                return element;
            }
            
            // Check children if this is a container
            if (Array.isArray(element.content)) {
                const found = findElementById(element.content, targetId);
                if (found) return found;
            }
        }
        
        return null;
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDraggingOver) setIsDraggingOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
    };
    
    const handleDragEnd = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setElementBeingDragged(null);
        setIsDraggingOver(false);
    };

    const handleDragStart = (e: React.DragEvent, elementType: EditorBtns) => {
        e.stopPropagation();
        if (!elementType || elementType === "__body") return;
        
        console.log("=== DRAG START DETAILS ===");
        console.log("Element being dragged - ID:", id);
        console.log("Element being dragged - Type:", elementType);
        console.log("Element being dragged - Name:", name);
        
        // Create a custom drag image for just this element
        if (containerRef.current) {
            // Create a clone of the element for the drag image
            const rect = containerRef.current.getBoundingClientRect();
            const ghostElement = containerRef.current.cloneNode(true) as HTMLElement;
            
            // Remove all child content for a cleaner drag image
            ghostElement.querySelectorAll('*').forEach(child => {
                if (child.classList.contains('pointer-events-none')) return;
                if (child.tagName === 'SPAN' || child.tagName === 'DIV') {
                    child.textContent = '';
                    if (child.childNodes.length > 0) {
                        while (child.firstChild) {
                            child.removeChild(child.firstChild);
                        }
                    }
                }
            });
            
            // Style the ghost element
            ghostElement.style.width = `${rect.width}px`;
            ghostElement.style.height = `${rect.height}px`; 
            ghostElement.style.transform = 'translateX(-999px)';
            ghostElement.style.position = 'absolute';
            ghostElement.style.top = '0';
            ghostElement.style.left = '0';
            ghostElement.style.zIndex = '-1';
            ghostElement.style.opacity = '0.8';
            ghostElement.style.border = '2px dashed #333';
            ghostElement.style.background = '#f5f5f5';
            ghostElement.style.pointerEvents = 'none';
            
            // Add it to the document temporarily
            document.body.appendChild(ghostElement);
            
            // Set as drag image - offset by half width/height for better positioning
            e.dataTransfer.setDragImage(ghostElement, rect.width / 2, rect.height / 2);
            
            // Remove after a short delay
            setTimeout(() => {
                document.body.removeChild(ghostElement);
            }, 100);
        }
        
        // Store more information about the element being dragged
        e.dataTransfer.setData("type", elementType);
        e.dataTransfer.setData("elementId", id);
        
        // Also store the whole element for reference
        try {
            // Strip circular references before serializing
            const elementForTransfer = {
                id,
                name,
                type: elementType,
                // Don't include the full styles/content to avoid circular refs
            };
            e.dataTransfer.setData("elementDetails", JSON.stringify(elementForTransfer));
            console.log("Element details stored in dataTransfer:", elementForTransfer);
        } catch (error) {
            console.log("Error storing element details:", error);
        }
        
        // Set the drag effect to move to indicate this is a reordering operation
        e.dataTransfer.effectAllowed = "move";
        
        // For debugging - may not work in all browsers
        try {
            console.log("Verification - type set:", e.dataTransfer.getData("type"));
            console.log("Verification - elementId set:", e.dataTransfer.getData("elementId"));
        } catch (error) {
            console.log("Cannot read dataTransfer during dragStart in some browsers");
        }
        
        // Remember what element is being dragged
        setElementBeingDragged(element);
    };

    const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch({
            type: "CHANGE_CLICKED_ELEMENT",
            payload: {
                elementDetails: element,
            },
        });
    };

    const handleDeleteElement = () => {
        dispatch({
            type: "DELETE_ELEMENT",
            payload: {
                elementDetails: element,
            },
        });
    };

    return (
        <div
            ref={containerRef}
            style={styles}
            className={clsx("relative p-6 transition-all group", {
                "max-w-full w-full": type === "container" || type === "2Col",
                "h-fit": type === "container",
                "h-full": type === "__body",
                "overflow-y-auto ": type === "__body",
                "flex flex-col md:!flex-row": type === "2Col",
                "!border-blue-500": state.editor.selectedElement.id === id && !state.editor.liveMode && state.editor.selectedElement.type !== "__body",
                "!border-yellow-400 !border-4": state.editor.selectedElement.id === id && !state.editor.liveMode && state.editor.selectedElement.type === "__body",
                "!border-solid": state.editor.selectedElement.id === id && !state.editor.liveMode,
                "border-dashed border-[1px] border-slate-300": !state.editor.liveMode,
                "!border-green-500 !border-2 !bg-green-50/50": isDraggingOver && !state.editor.liveMode,
            })}
            onDrop={(e) => handleOnDrop(e, id)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDragEnd={handleDragEnd}
            draggable={type !== "__body"}
            onClick={handleOnClickBody}
            onDragStart={(e) => handleDragStart(e, type)}
        >
            <Badge
                className={clsx("absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden", {
                    block: state.editor.selectedElement.id === element.id && !state.editor.liveMode,
                })}
            >
                {element.name}
            </Badge>

            {isDraggingOver && !state.editor.liveMode && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-md text-sm font-medium z-10">
                        Drop Here
                    </span>
                </div>
            )}

            {Array.isArray(content) && content.map((childElement) => <Recursive key={childElement.id} element={childElement} />)}

            {state.editor.selectedElement.id === element.id && !state.editor.liveMode && state.editor.selectedElement.type !== "__body" && (
                <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg ">
                    <Trash size={16} onClick={handleDeleteElement} />
                </div>
            )}
        </div>
    );
};

export default Container;
