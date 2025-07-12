import React from 'react'
import { NavDocuments } from './nav-documents'
import { NavMain } from './nav-main'
import { NavSecondary } from './nav-secondary'
import { NavAdmin } from './nav-admin'
import { getAuthUserDetails } from '@/actions/auth'

type Props = {}

const SidebarContentWrapper = async (props: Props) => {
    const user = await getAuthUserDetails();

    const baseNavMain = [
        {
            title: "Dashboard",
            url: "/admin/dashboard",
            icon: "dashboard",
        },
        {
            title: "Pages",
            url: "/admin/sites",
            icon: "file",
        },
        {
            title: "Domains",
            url: "/admin/domains",
            icon: "world",
        },
       
        {
            title: "Live Stream Cards",
            url: "/admin/live-stream-cards",
            icon: "video",
        },
        {
            title: "Overlays",
            url: "/admin/overlay",
            icon: "layers",
        }
    ];

    const adminNavMain = [
        {
            title: "All Users Pages",
            url: "/admin/all-pages",
            icon: "users",
        },
        {
            title: "All Domains",
            url: "/admin/all-domains",
            icon: "world",
        },
        {
            title: "All Overlays",
            url: "/admin/all-overlays",
            icon: "layers",
        },
        {
            title: "All Live Stream Cards",
            url: "/admin/all-live-stream-cards",
            icon: "video",
        }
    ];

    const data = {
        navMain: baseNavMain,
        navSecondary: [
            {
                title: "Settings",
                url: "/admin/settings",
                icon: "settings",
            },
        ],
        documents: [
            {
                name: "Medya",
                url: "/admin/media",
                icon: "database",
            },
        ],
    }

    return (
        <>
            <NavMain items={data.navMain} />

            {user && user.role === "ADMIN" && (
                <NavAdmin items={adminNavMain} />
            )}

            <NavDocuments items={data.documents} />
            <NavSecondary items={data.navSecondary} className="mt-auto" />
        </>
    )
}

export default SidebarContentWrapper