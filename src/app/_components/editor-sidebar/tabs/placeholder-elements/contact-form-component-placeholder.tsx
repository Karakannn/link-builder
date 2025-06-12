import { useDraggable } from "@dnd-kit/core";
import { Contact2Icon } from "lucide-react";
import React from "react";

const ContactFormComponentPlaceholder = () => {
    const draggable = useDraggable({
        id: "contact-form-draggable",
        data: {
            type: "contactForm",
            name: "Contact Form",
            isSidebarElement: true,
            isEditorElement: false,
        },
    });

    return (
        <div
            ref={draggable.setNodeRef}
            {...draggable.listeners}
            {...draggable.attributes}
            className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
            <Contact2Icon size={40} className="text-muted-foreground" />
        </div>
    );
};

export default ContactFormComponentPlaceholder;