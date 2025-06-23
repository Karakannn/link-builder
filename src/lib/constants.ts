export type EditorBtns =
  | "text"
  | "container"
  | "closableContainer"
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
  | "neonCard"
  | "animatedBorderButton"
  | "animatedTextButton"
  | "marquee"
  | "3Col"
  | "gridLayout"
  | "column"
  | "gif"
  | "animatedGridPattern"
  | "interactiveGridPattern"
  | "retroGrid"
  | "dotPattern"
  | null;

export const defaultStyles: React.CSSProperties = {
  backgroundPosition: "center",
  objectFit: "cover",
  backgroundRepeat: "no-repeat",
  textAlign: "left",
  opacity: "100%",
  // Default positioning
  position: "relative",
  // Default dimensions
  width: "100%",
  // Default spacing - no padding by default
  margin: "0px",
  padding: "0px",
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
  paddingTop: "0px",
  paddingRight: "0px",
  paddingBottom: "0px",
  paddingLeft: "0px",
  // Default typography
  fontSize: "16px",
};

// Specific default styles for text components
export const textDefaultStyles: React.CSSProperties = {
  ...defaultStyles,
  margin: "0px",
  padding: "0px",
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
  paddingTop: "0px",
  paddingRight: "0px",
  paddingBottom: "0px",
  paddingLeft: "0px",
  fontSize: "16px",
  color: "#000000",
};

// Specific default styles for link components
export const linkDefaultStyles: React.CSSProperties = {
  ...defaultStyles,
  margin: "0px",
  padding: "0px",
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
  paddingTop: "0px",
  paddingRight: "0px",
  paddingBottom: "0px",
  paddingLeft: "0px",
  fontSize: "16px",
  color: "#0066cc",
  textDecoration: "underline",
};

// Specific default styles for animated border button components
export const animatedBorderButtonDefaultStyles: React.CSSProperties = {
  ...defaultStyles,
  margin: "0px",
  padding: "1.3px",
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
  paddingTop: "1.3px",
  paddingRight: "1.3px",
  paddingBottom: "1.3px",
  paddingLeft: "1.3px",
  fontSize: "16px",
};

// Specific default styles for shimmer button components
export const shimmerButtonDefaultStyles: React.CSSProperties = {
  ...defaultStyles,
  margin: "0px",
  padding: "12px 24px",
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
  paddingTop: "12px",
  paddingRight: "24px",
  paddingBottom: "12px",
  paddingLeft: "24px",
  fontSize: "16px",
};



// Specific default styles for container components
export const containerDefaultStyles: React.CSSProperties = {
  ...defaultStyles,
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
  fontSize: "16px",
  minHeight: "100px",
};

// Specific default styles for closable container components
export const closableContainerDefaultStyles: React.CSSProperties = {
  ...defaultStyles,
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
  fontSize: "16px",
  minHeight: "100px",
};

// Specific default styles for neon card components
export const neonCardDefaultStyles: React.CSSProperties = {
  ...defaultStyles,
  margin: "0px",
  padding: "0px",
  marginTop: "0px",
  marginRight: "0px",
  marginBottom: "0px",
  marginLeft: "0px",
  paddingTop: "0px",
  paddingRight: "0px",
  paddingBottom: "0px",
  paddingLeft: "0px",
  fontSize: "16px",
  minHeight: "350px",
  maxWidth: "400px",
};
