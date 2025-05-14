"use client"

import EditorProvider from "@/providers/editor/editor-provider";
import Image from "next/image";
import FunnelEditorNavigation from "./_components/editor-navigation";
import FunnelEditor from "./_components/editor";
import FunnelEditorSidebar from "./_components/editor-sidebar";
import { ModalProvider } from "@/providers/modal-provider";

export default function Home() {
  return (
    <ModalProvider>
      <EditorProvider subaccountId={""} funnelId={""} pageDetails={{}}>
        <div className="flex flex-col h-full">
          <FunnelEditorNavigation subaccountId={""} funnelId={""} funnelPageDetails={""} />
          <div className="h-full flex justify-center">
            <FunnelEditor funnelPageId={""} />
          </div>
          <FunnelEditorSidebar subaccountId={""} />
        </div>
      </EditorProvider>
    </ModalProvider>
  );
}
