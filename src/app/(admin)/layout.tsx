import React, { ReactNode } from 'react'
import { AppSidebar } from "@/components/global/sidebar/app-sidebar"
import { SiteHeader } from "@/components/global/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"


type Props = {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout