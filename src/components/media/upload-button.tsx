"use client";
import React from "react";
import { Button } from "../ui/button";
/* import UploadMediaForm from "../forms/upload-media";
 */import { useModal } from "@/providers/modal-provider";
import CustomModal from "@/global/custom-modal";

type Props = {
    subaccountId: string;
};

const UploadButton = ({ subaccountId }: Props) => {
    const { setOpen } = useModal();

    return (
        <Button
            onClick={() => {
                setOpen(
                    <CustomModal title="Upload Media" subheading="Upload a file to your media bucket">
                        {/* <UploadMediaForm subaccountId={subaccountId}></UploadMediaForm> */}
                        <>sa</>
                    </CustomModal>
                );
            }}
        >
            Upload
        </Button>
    );
};

export default UploadButton;
