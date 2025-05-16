"use client"

import { FormGenerator } from "@/components/global/form-generator"
import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { CONSTANTS } from "@/constants"
import { useAuthSignIn } from "@/hooks/use-authentication"

type Props = {}

const SignInForm = (props: Props) => {
  const { isPending, onAuthenticateUser, register, errors, authError } = useAuthSignIn()

  return (
    <form className="flex flex-col gap-3 mt-10" onSubmit={onAuthenticateUser}>
      {CONSTANTS.signInForm.map((field) => (
        <FormGenerator
          {...field}
          key={field.id}
          register={register}
          errors={errors}
        />
      ))}
      
      {/* Display global authentication error */}
      {authError && (
        <div className="text-red-500 text-sm mt-1 mb-2">
          {authError}
        </div>
      )}
      
      <Button type="submit" className="rounded-2xl">
        <Loader loading={isPending}>Sign In with Email</Loader>
      </Button>
    </form>
  )
}

export default SignInForm
