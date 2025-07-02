"use client"

import {
  type Icon,
} from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { getIcon } from "@/lib/utils"

export function NavAdmin({
  items,
}: {
  items: {
    title: string
    url: string
    icon: Icon | string
  }[]
}) {

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Admin Yönetimi</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const IconComponent: any = typeof item.icon === 'string' ? getIcon(item.icon) : item.icon
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <IconComponent />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
} 