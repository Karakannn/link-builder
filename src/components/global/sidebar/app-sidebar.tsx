
import * as React from "react"
import {
  IconInnerShadowTop,
} from "@tabler/icons-react"

import { NavUser } from "@/components/global/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { getAuthUserDetails } from "@/actions/auth"
import SidebarContentWrapper from "./sidebar-content-wrapper"


export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const userData = await getAuthUserDetails();

  if (!userData) return <>loading...</>

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Link Builder.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarContentWrapper />
      </SidebarContent>
      <SidebarFooter>
        <NavUser userData={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
