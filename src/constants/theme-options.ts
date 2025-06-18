export const THEME_OPTIONS = [
  {
    id: "blue",
    name: "Mavi",
    description: "Modern mavi tema",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    primaryColor: "#3b82f6",
    secondaryColor: "#1d4ed8",
    accentColor: "#60a5fa",
  },
  {
    id: "purple",
    name: "Mor",
    description: "Elegant mor tema",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    primaryColor: "#8b5cf6",
    secondaryColor: "#7c3aed",
    accentColor: "#a78bfa",
  },
  {
    id: "green",
    name: "Yeşil",
    description: "Doğal yeşil tema",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    primaryColor: "#10b981",
    secondaryColor: "#059669",
    accentColor: "#34d399",
  },
] as const;

export type ThemeOption = typeof THEME_OPTIONS[number]; 