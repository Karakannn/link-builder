import { onAuthenticatedUser } from "@/actions/auth"
import BackdropGradient from "@/components/global/backdrop-gradient"
import GlassCard from "@/components/global/glass-card"
import { GalleryVerticalEnd, Link, User } from "lucide-react"
import { redirect } from "next/navigation"

type Props = {
  children: React.ReactNode
}

const AuthLayout = async ({ children }: Props) => {
  const user = await onAuthenticatedUser()

  if (user.status === 200) redirect("/callback/sign-in")

  return (

    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Link className="size-4" />
            </div>
            LinkBuilder.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {children}
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

export default AuthLayout
