export type EditorBtns =
  | "text"
  | "container"
  | "closableContainer"
  | "section"
  | "paymentForm"
  | "link"
  | "2Col"
  | "video"
  | "__body"
  | "image"
  | "sponsorNeonCard"
  | "marquee"
  | "3Col"
  | "gridLayout"
  | "column"
  | "gif"
  | "animatedGridPattern"
  | "interactiveGridPattern"
  | "retroGrid"
  | "dotPattern"
  | "pulsatingButton"
  | "animatedText"
  | null;

// Elements that support layout functionality (horizontal/vertical)
export const LAYOUT_SUPPORTED_ELEMENTS: EditorBtns[] = [
  "container",
  "closableContainer", 
  "2Col",
  "sponsorNeonCard",
  "marquee"
];

// Helper function to check if an element supports layout
export const supportsLayout = (elementType: EditorBtns): boolean => {
  return LAYOUT_SUPPORTED_ELEMENTS.includes(elementType);
};

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
  minHeight: "40px",
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
  minHeight: "40px",
};

// Specific default styles for sponsor neon card components
export const sponsorNeonCardDefaultStyles: React.CSSProperties = {
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

// Specific default styles for pulsating button components
export const pulsatingButtonDefaultStyles: React.CSSProperties = {
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
  minHeight: "40px",
  minWidth: "120px",
};

// Specific default styles for animated text components
export const animatedTextDefaultStyles: React.CSSProperties = {
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
  fontSize: "24px",
  minHeight: "60px",
  textAlign: "center",
  fontWeight: "600",
  fontStyle: "italic",
  textTransform: "uppercase",
  lineHeight: "1.2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
