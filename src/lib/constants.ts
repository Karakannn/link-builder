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
  | "gridLayout"
  | "column"
  | "gif"
  | null;

export const defaultStyles: React.CSSProperties = {
  backgroundPosition: "center",
  objectFit: "cover",
  backgroundRepeat: "no-repeat",
  textAlign: "left",
  opacity: "100%",
  // Add default margin and padding
  margin: "0px",
  padding: "20px",
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
  paddingTop: "20px",
  paddingRight: "20px",
  paddingBottom: "20px",
  paddingLeft: "20px",
};
