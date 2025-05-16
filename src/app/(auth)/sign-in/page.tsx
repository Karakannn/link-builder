import SignInForm from "@/components/forms/sign-in"

const SignInPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">Enter your email below to login to your account</p>
      </div>
      <SignInForm />
    </div>
  )
}

export default SignInPage
