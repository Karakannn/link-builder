export type AuthFormProps = {
  id: string;
  type: "email" | "text" | "password";
  inputType: "select" | "input";
  options?: { value: string; label: string; id: string }[];
  label?: string;
  placeholder: string;
  name: string;
};
export const SIGN_UP_FORM: AuthFormProps[] = [
  {
    id: "1",
    inputType: "input",
    label:"First Name",
    placeholder: "First name",
    name: "firstname",
    type: "text",
  },
  {
    id: "2",
    inputType: "input",
    label: "Last Name",
    placeholder: "Last name",
    name: "lastname",
    type: "text",
  },
  {
    id: "3",
    inputType: "input",
    label: "Email",
    placeholder: "Email",
    name: "email",
    type: "email",
  },
  {
    id: "4",
    label:"Password",
    inputType: "input",
    placeholder: "Password",
    name: "password",
    type: "password",
  },
];

export const SIGN_IN_FORM: AuthFormProps[] = [
  {
    id: "1",
    label: "Email",
    inputType: "input",
    placeholder: "Email",
    name: "email",
    type: "email",
  },
  {
    id: "4",
    label: "Password",
    inputType: "input",
    placeholder: "Password",
    name: "password",
    type: "password",
  },
];
