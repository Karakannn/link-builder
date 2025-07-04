import { onSignUpUser } from "@/actions/auth"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const CompleteOAuthAfterCallback = async () => {
  const user = await currentUser()
  if (!user) redirect("/sign-in")
  const complete = await onSignUpUser({
    email: user.emailAddresses[0].emailAddress as string,
    firstname: user.firstName as string,
    lastname: user.lastName as string,
    image: user.imageUrl,
    clerkId: user.id,
  })
  if (complete.status == 200) {
    redirect(`/buider`)
  }

  if (complete.status !== 200) {
    redirect("/sign-in")
  }
}

export default CompleteOAuthAfterCallback
