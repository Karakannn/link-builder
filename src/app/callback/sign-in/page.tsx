import { onSignInUser, syncCurrentUserToDatabase } from "@/actions/auth"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const CompleteSigIn = async () => {
  const user = await currentUser()
  if (!user) return redirect("/sign-in")

  const authenticated = await onSignInUser(user.id)

  // If user doesn't exist in database, sync from Clerk
  if (authenticated.status !== 200) {
    console.log("User not found in database, syncing from Clerk...")
    const syncResult = await syncCurrentUserToDatabase()
    
    if (syncResult.status === 200) {
      console.log("User successfully synced, redirecting to dashboard")
      return redirect(`/admin/dashboard`)
    } else {
      console.error("Failed to sync user:", syncResult.message)
      return redirect("/sign-in")
    }
  }

  if (authenticated.status === 200) return redirect(`/admin/dashboard`)

  return redirect("/sign-in")
}

export default CompleteSigIn
