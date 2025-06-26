"use client";
import React from "react";
import { Button } from "../ui/button";
import { useModal } from "@/providers/modal-provider";
import CustomModal from "@/components/global/custom-modal";
import UploadMediaForm from "../forms/upload-media";

type Props = {
    userId: string;
    siteId?: string;
};

const UploadButton = ({ userId, siteId }: Props) => {
    const { setOpen } = useModal();

    return (
        <Button
            onClick={() => {
                setOpen(
                    <CustomModal title="Medya Yükle" subheading="Medya koleksiyonunuza bir dosya yükleyin">
                        <UploadMediaForm userId={userId} siteId={siteId}></UploadMediaForm>
                    </CustomModal>
                );
            }}
        >
            Yükle
        </Button>
    );
};

export default UploadButton;
