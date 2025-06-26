import { PlayCircle, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { UploadDropzone } from "@/lib/uploadthing";

type Props = {
    apiEndpoint: "agencyLogo" | "avatar" | "subaccountLogo" | "media";
    onChange: (url?: string) => void;
    value?: string;
};

const FileUpload = ({ apiEndpoint, onChange, value }: Props) => {
    const type = value?.split(".").pop()?.toLowerCase();

    if (value) {
        return (
            <div className="flex flex-col items-center justify-center">
                {/* Image files */}
                {type && ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(type) && (
                    <div className="relative w-40 h-40">
                        <Image 
                            src={value} 
                            className="object-contain" 
                            alt="uploaded-image" 
                            fill 
                        />
                    </div>
                )}

                {/* Video files */}
                {type && ["mp4", "avi", "mov", "wmv", "webm"].includes(type) && (
                    <div className="relative flex items-center p-4 mt-2 rounded-md bg-background/10">
                        <PlayCircle className="h-8 w-8 text-blue-500" />
                        <a 
                            href={value} 
                            target="_blank" 
                            rel="noopener_noreferrer" 
                            className="ml-2 text-sm text-blue-500 hover:underline"
                        >
                            View Video
                        </a>
                    </div>
                )}

                <Button onClick={() => onChange("")} type="button" variant="ghost" className="mt-2">
                    <X className="h-4 w-4 mr-2" />
                    Remove File
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full bg-muted/30">
            <UploadDropzone
                endpoint={apiEndpoint}
                onClientUploadComplete={(res: any) => {
                    onChange(res?.[0].url);
                }}
                onUploadError={(error: any) => {
                    console.log(error);
                }}
            />
        </div>
    );
};

export default FileUpload;