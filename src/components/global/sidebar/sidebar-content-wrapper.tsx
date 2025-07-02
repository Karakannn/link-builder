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
            title: "Landing Modal",
            url: "/admin/landing-modal",
            icon: "database",
        },
    ];

    const adminNavMain = [
        {
            title: "All Users Pages",
            url: "/admin/all-pages",
            icon: "users",
        },
        {
            title: "All Modals",
            url: "/admin/all-modals",
            icon: "database",
        },
        {
            title: "All Domains",
            url: "/admin/all-domains",
            icon: "world",
        },
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