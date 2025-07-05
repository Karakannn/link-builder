"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CONSTANTS } from "@/constants"
import { useNavigation } from "@/hooks/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"

type MenuProps = {
  orientation: "mobile" | "desktop"
}

const Menu = ({ orientation }: MenuProps) => {
  const { section, onSetSection } = useNavigation()
  switch (orientation) {
    case "desktop":
      return (
        <Card className="backdrop--blur__safari backdrop-filter backdrop-blur-2xl bg-opacity-60 p-1 lg:flex hidden rounded-xl">
          <CardContent className="p-0 flex gap-2">
            {CONSTANTS.landingPageMenu.map((menuItem) => (
              <Link
                href={menuItem.path}
                {...(menuItem.section && {
                  onClick: () => onSetSection(menuItem.path),
                })}
                className={cn(
                  "rounded-xl flex gap-2 py-2 px-4 items-center",
                  section == menuItem.path
                    ? "bg-white/10 border-[#27272A]"
                    : "",
                )}
                key={menuItem.id}
              >
                {menuItem.icon}
                {menuItem.label}
              </Link>
            ))}
          </CardContent>
        </Card>
      )

    case "mobile":
      return (
        <div className="flex flex-col mt-10">
          {CONSTANTS.landingPageMenu.map((menuItem) => (
            <Link
              href={menuItem.path}
              {...(menuItem.section && {
                onClick: () => onSetSection(menuItem.path),
              })}
              className={cn(
                "rounded-xl flex gap-2 py-2 px-4 items-center",
                section == menuItem.path ? "bg-gray-100 border-[#27272A]" : "",
              )}
              key={menuItem.id}
            >
              {menuItem.icon}
              {menuItem.label}
            </Link>
          ))}
        </div>
      )
    default:
      return <></>
  }
}

export default Menu
