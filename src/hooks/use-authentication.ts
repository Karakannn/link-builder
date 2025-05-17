import { onSignUpUser } from "@/actions/auth"
import { SignInSchema } from "@/components/forms/sign-in/schema"
import { OtpVerificationSchema, SignUpSchema } from "@/components/forms/sign-up/schema"
import { useSignIn, useSignUp } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

export const useAuthSignIn = () => {

  const { isLoaded, setActive, signIn } = useSignIn()
  const [authError, setAuthError] = useState<string | null>(null)
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    setError,
  } = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    mode: "onBlur",
  })

  const router = useRouter();

  const onClerkAuth = async (email: string, password: string) => {
    // Clear any previous auth errors
    setAuthError(null)

    if (!isLoaded)
      return toast("Error", {
        description: "Oops! something went wrong",
      })
    try {

      const authenticated = await signIn.create({
        identifier: email,
        password: password,
      })

      if (authenticated.status === "complete") {
        reset()
        await setActive({ session: authenticated.createdSessionId })
        toast("Success", {
          description: "Welcome back!",
        })
        router.push("/callback/sign-in")
      } else if (authenticated.status === "needs_second_factor") {
        // Handle 2FA if implemented
        toast("2FA Required", {
          description: "Please complete the second factor authentication",
        })
      } else {
        // Handle other statuses
        toast("Authentication Error", {
          description: "Could not complete sign in process",
        })
      }
    } catch (error: any) {


      // Set the error for display in the form

      const errorMessage = getClerkErrorMessage(error);

      if (errorMessage.includes("password")) {
        setError("password", {
          type: "manual",
          message: errorMessage
        });
      } else if (errorMessage.includes("email") || errorMessage.includes("identifier")) {
        setError("email", {
          type: "manual",
          message: errorMessage
        });
      } else {
        // General error
        setAuthError(errorMessage);
        toast("Error", {
          description: errorMessage,
        });
      }
    }
  }

  // Helper function to extract meaningful error messages from Clerk errors
  const getClerkErrorMessage = (error: any): string => {
    if (!error || !error.errors || !error.errors.length) {
      return "An unknown error occurred";
    }

    const clerkError = error.errors[0];

    switch (clerkError.code) {
      case "form_password_incorrect":
        return "Email or password is incorrect";
      case "form_identifier_not_found":
        return "No account found with this email";
      case "form_param_format_invalid":
        return clerkError.message || "Invalid input format";
      case "network_error":
        return "Network error, please check your connection";
      case "rate_limit_exceeded":
        return "Too many attempts, please try again later";
      default:
        return clerkError.message || "An unexpected error occurred";
    }
  }

  const { mutate: InitiateLoginFlow, isPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      onClerkAuth(email, password),
  })

  const onAuthenticateUser = handleSubmit(async (values) => {
    InitiateLoginFlow({ email: values.email, password: values.password })
  })

  return {
    onAuthenticateUser,
    isPending,
    register,
    errors,
    authError,
  }
}

export const useAuthSignUp = () => {
  const { setActive, isLoaded, signUp } = useSignUp()
  const [creating, setCreating] = useState<boolean>(false)
  const [verifying, setVerifying] = useState<boolean>(false)
  const [generatingCode, setGeneratingCode] = useState<boolean>(false)
  const [code, setCode] = useState<string>("")
  const [otpError, setOtpError] = useState<string | null>(null)

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    getValues,
  } = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    mode: "onBlur",
  })

  const {
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    register: registerOtp,
    setValue: setOtpValue,
  } = useForm<z.infer<typeof OtpVerificationSchema>>({
    resolver: zodResolver(OtpVerificationSchema),
    mode: "onChange",
  })

  const router = useRouter()

  const onGenerateCode = async (email: string, password: string) => {
    if (!isLoaded)
      return toast("Error", {
        description: "Oops! something went wrong",
      })
    try {
      if (email && password) {
        setGeneratingCode(true) 
        
        await signUp.create({
          emailAddress: email,
          password: password,
        })

        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        })

        setVerifying(true)
        setGeneratingCode(false)
        // Reset any previous OTP errors
        setOtpError(null)
      } else {
        return toast("Error", {
          description: "No fields must be empty",
        })
      }
    } catch (error: any) {
      setGeneratingCode(false)
      // Handle Clerk errors for the sign-up step
      const errorMessage = getClerkErrorMessage(error)
      toast("Error", {
        description: errorMessage,
      })
      console.log("error", error)
      console.error(JSON.stringify(error, null, 2))
    }
  }

  // Helper function for Clerk error messages
  const getClerkErrorMessage = (error: any): string => {
    if (!error || !error.errors || !error.errors.length) {
      return "An unknown error occurred";
    }

    const clerkError = error.errors[0];

    switch (clerkError.code) {
      case "form_identifier_exists":
        return "An account with this email already exists";
      case "form_password_pwned":
        return "This password has been compromised in a data breach. Please use a more secure password";
      case "form_param_format_invalid":
        return clerkError.message || "Invalid input format";
      case "verification_code_incorrect":
        return "The verification code is incorrect";
      case "verification_expired":
        return "The verification code has expired. Please request a new one";
      case "network_error":
        return "Network error, please check your connection";
      case "rate_limit_exceeded":
        return "Too many attempts, please try again later";
      default:
        return clerkError.message || "An unexpected error occurred";
    }
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    setOtpValue('code', newCode)
    if (otpError) {
      setOtpError(null)
    }
  }

  const onInitiateUserRegistration = handleOtpSubmit(async () => {
    if (!isLoaded)
      return toast("Error", {
        description: "Oops! something went wrong",
      })

    if (!code || code.trim() === '') {
      setOtpError("Verification code is required")
      return
    }

    try {
      setCreating(true)
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status !== "complete") {
        setCreating(false)
        setOtpError("Verification failed. Please check your code and try again")
        return toast("Error", {
          description: "Oops! something went wrong, verification incomplete",
        })
      }

      if (completeSignUp.status === "complete") {
        if (!signUp.createdUserId) {
          setCreating(false)
          setOtpError("User ID not found. Please try again")
          return
        }
        
        const user = await onSignUpUser({
          firstname: getValues("firstname"),
          lastname: getValues("lastname"),
          clerkId: signUp.createdUserId,
          image: "",
        })

        reset()

        if (user.status === 200) {
          toast("Success", {
            description: user.message,
          })
          await setActive({
            session: completeSignUp.createdSessionId,
          })
          router.push(`/builder`)
        }
        if (user.status !== 200) {
          toast("Error", {
            description: user.message + " - action failed",
          })
          router.refresh()
        }
        setCreating(false)
        setVerifying(false)
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2))
      }
    } catch (error: any) {
      setCreating(false)
      const errorMessage = getClerkErrorMessage(error)
      setOtpError(errorMessage)
      toast("Error", {
        description: errorMessage,
      })
      console.error(JSON.stringify(error, null, 2))
    }
  })

  return {
    register,
    errors,
    onGenerateCode,
    onInitiateUserRegistration,
    verifying,
    creating,
    generatingCode,
    code,
    setCode: handleCodeChange,
    getValues,
    otpError,
    otpErrors,
    registerOtp,
  }
}

