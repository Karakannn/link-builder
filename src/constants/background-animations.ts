export const BACKGROUND_ANIMATIONS = [
  {
    id: "none",
    name: "None",
    className: "",
  },
  {
    id: "animated-grid",
    name: "Animated Grid",
    className: "bg-animated-grid",
  },
  {
    id: "dot-pattern",
    name: "Dot Pattern",
    className: "bg-dot-pattern",
  },
  {
    id: "interactive-grid",
    name: "Interactive Grid",
    className: "bg-interactive-grid",
  },
  {
    id: "retro-grid",
    name: "Retro Grid",
    className: "bg-retro-grid",
  },
] as const

export type BackgroundAnimation = string 