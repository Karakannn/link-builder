"use client"
import { FormGenerator } from "@/components/global/form-generator"
import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { CONSTANTS } from "@/constants"
import { useAuthSignUp } from "@/hooks/use-authentication"
import dynamic from "next/dynamic"

type Props = {}

const OtpInput = dynamic(
  () =>
    import("@/components/global/otp-input").then(
      (component) => component.default,
    ),
  { ssr: false },
)

const SignUpForm = (props: Props) => {
  const {
    register,
    errors,
    verifying,
    creating,
    generatingCode,
    onGenerateCode,
    onInitiateUserRegistration,
    code,
    setCode,
    getValues,
    otpError,
    otpErrors,
  } = useAuthSignUp()

  const isOtpValid = code && code.trim() !== ''
  const hasOtpError = otpError || (otpErrors && otpErrors.code)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (verifying && !isOtpValid) {
          return
        }
        onInitiateUserRegistration()
      }}
      className="flex flex-col gap-3 mt-10"
    >
      {verifying ? (
        <div className="flex flex-col items-center gap-4 mb-5">
          <OtpInput otp={code} setOtp={setCode as any} />

          {hasOtpError && (
            <div className="text-red-500 text-sm my-1">
              {otpError || otpErrors?.code?.message}
            </div>
          )}
        </div>
      ) : (
        CONSTANTS.signUpForm.map((field) => (
          <FormGenerator
            {...field}
            key={field.id}
            register={register}
            errors={errors}
          />
        ))
      )}

      {verifying ? (
        <Button
          type="submit"
          className="rounded-2xl"
          disabled={creating || !isOtpValid}
        >
          <Loader loading={creating}>Sign Up with Email</Loader>
        </Button>
      ) : (
        <Button
          type="button"
          disabled={generatingCode}
          onClick={() =>
            onGenerateCode(getValues("email"), getValues("password"))
          }
        >
          <Loader loading={generatingCode}>Generate Code</Loader>
        </Button>
      )}
    </form>
  )
}

export default SignUpForm