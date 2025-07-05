import { Home, Star, CreditCard, MessageCircle } from "lucide-react"
import { JSX } from "react"


export type MenuProps = {
  id: number
  label: string
  icon: JSX.Element
  path: string
  section?: boolean
  integration?: boolean
}


export const LANDING_PAGE_MENU: MenuProps[] = [
  {
    id: 0,
    label: "Ana Sayfa",
    icon: <Home />,
    path: "/",
    section: true,
  },
  {
    id: 1,
    label: "Özellikler",
    icon: <Star />,
    path: "#features",
    section: true,
  },
  {
    id: 2,
    label: "Fiyatlandırma",
    icon: <CreditCard />,
    path: "#pricing",
    section: true,
  },
  {
    id: 3,
    label: "İletişim",
    icon: <MessageCircle />,
    path: "#contact",
    section: true,
  },
]
