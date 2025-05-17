"use client"

import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthSignIn } from "@/hooks/use-authentication"
import { ErrorMessage } from "@hookform/error-message"
import Link from "next/link"

type Props = {}

const SignInForm = (props: Props) => {
  const { isPending, onAuthenticateUser, register, errors, authError } = useAuthSignIn()

  return (
    <form className="flex flex-col gap-4 mt-10" onSubmit={onAuthenticateUser}>


      <Label className="flex flex-col items-start gap-2" htmlFor={"input-email"}>
        <span>Email</span>
        <Input
          id={"input-email"}
          placeholder={"Enter Email"}
          {...register("email")}
        />
        <ErrorMessage
          errors={errors}
          name={"email"}
          render={({ message }) => (
            <p className="text-red-500 text-sm mt-1">
              {message}
            </p>
          )}
        />
      </Label>

      <Label className="flex flex-col items-start gap-2" htmlFor={"input-password"}>
        <span>Password</span>
        <Input
          id={"input-password"}
          type="password"
          placeholder={"Enter password"}
          {...register("password")}
        />
        <ErrorMessage
          errors={errors}
          name={"password"}
          render={({ message }) => (
            <p className="text-red-500 text-sm mt-1">
              {message}
            </p>
          )}
        />
      </Label>

      {/* Display global authentication error */}
      {authError && (
        <div className="text-red-500 text-sm mt-1 mb-2">
          {authError}
        </div>
      )}

      <Button type="submit">
        <Loader loading={isPending}>Sign In with Email</Loader>
      </Button>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>


    </form>
  )
}

export default SignInForm
