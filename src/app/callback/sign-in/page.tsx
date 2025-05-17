import { onSignInUser } from "@/actions/auth"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const CompleteSigIn = async () => {
  const user = await currentUser()
  if (!user) return redirect("/sign-in")

  const authenticated = await onSignInUser(user.id)

  if (authenticated.status === 200) return redirect(`/admin/dashboard`)

  if (authenticated.status !== 200) {
    redirect("/sign-in")
  }
}

export default CompleteSigIn
