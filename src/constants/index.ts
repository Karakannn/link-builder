import { AuthFormProps, SIGN_UP_FORM, SIGN_IN_FORM } from "./forms";
import { MenuProps,  LANDING_PAGE_MENU } from "./menus";

type ConstantsProps = {
  landingPageMenu: MenuProps[];
  signUpForm: AuthFormProps[];
  signInForm: AuthFormProps[];
};

export const CONSTANTS: ConstantsProps = {
  landingPageMenu: LANDING_PAGE_MENU,
  signUpForm: SIGN_UP_FORM,
  signInForm: SIGN_IN_FORM,

};
