import { AuthFormProps, SIGN_UP_FORM, SIGN_IN_FORM } from "./forms";
import { MenuProps, LANDING_PAGE_MENU } from "./menus";

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

export const ELEMENT_TYPE_INFO: Record<string, { name: string; color: string }> = {
    __body: { name: "Page", color: "bg-gray-600" },
    container: { name: "Container", color: "bg-blue-600" },
    closableContainer: { name: "Closable", color: "bg-purple-600" },
    "2Col": { name: "2 Columns", color: "bg-purple-600" },
    "3Col": { name: "3 Columns", color: "bg-purple-600" },
    text: { name: "Text", color: "bg-green-600" },
    link: { name: "Link", color: "bg-amber-600" },
    video: { name: "Video", color: "bg-red-600" },
    image: { name: "Image", color: "bg-orange-600" },
    gif: { name: "GIF", color: "bg-pink-600" },
    sponsorNeonCard: { name: "Sponsor Card", color: "bg-indigo-600" },
    gridLayout: { name: "Grid", color: "bg-teal-600" },
    column: { name: "Column", color: "bg-cyan-600" },
    marquee: { name: "Marquee", color: "bg-violet-600" },
};
