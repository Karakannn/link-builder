import SignUpForm from "@/components/forms/sign-up"

type Props = {}

const SignUpPage = (props: Props) => {
  return (
    <>
      <h5 className="font-bold text-base text-themeTextWhite">Signup</h5>
      <p className="text-themeTextGray leading-tight">
        Network with people from around the world, join groups, create your own,
        watch courses and become the best version of yourself.
      </p>
      <SignUpForm />

    </>
  )
}

export default SignUpPage
