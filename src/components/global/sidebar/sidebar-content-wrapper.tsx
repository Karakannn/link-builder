"use client"

import React from 'react'
import { NavDocuments } from './nav-documents'
import { NavMain } from './nav-main'
import { NavSecondary } from './nav-secondary'
import {
    IconDashboard,
    IconDatabase,
    IconSettings,
    IconWorld,
} from "@tabler/icons-react"
import { Building2, File } from 'lucide-react'

type Props = {}

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/admin/dashboard",
            icon: IconDashboard,
        },
        {
            title: "Pages",
            url: "/admin/sites",
            icon: File,
        },
        {
            title: "Domains",
            url: "/admin/domains",
            icon: IconWorld,
        },
    ],

    navSecondary: [
        {
            title: "Settings",
            url: "/admin/settings",
            icon: IconSettings,
        },
    ],
    documents: [
        {
            name: "Media",
            url: "/admin/media",
            icon: IconDatabase,
        },
    ],
}

const SidebarContentWrapper = (props: Props) => {
    return (
        <>
            <NavMain items={data.navMain} />
            <NavDocuments items={data.documents} />
            <NavSecondary items={data.navSecondary} className="mt-auto" />
        </>
    )
}

export default SidebarContentWrapper