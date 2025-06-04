export type EditorBtns = 
  | "text" 
  | "container" 
  | "section" 
  | "contactForm" 
  | "paymentForm" 
  | "link" 
  | "2Col" 
  | "video" 
  | "__body" 
  | "image" 
  | "shimmerButton"
  | "animatedShinyButton"
  | "neonGradientButton"
  | "animatedBorderButton"
  | "animatedTextButton"
  | "animatedGridPattern"
  | "interactiveGridPattern"
  | "retroGrid"
  | "dotPattern"
  | "marquee"
  | "3Col"
  | null;

export const defaultStyles: React.CSSProperties = {
    backgroundPosition: "center",
    objectFit: "cover",
    backgroundRepeat: "no-repeat",
    textAlign: "left",
    opacity: "100%",
};