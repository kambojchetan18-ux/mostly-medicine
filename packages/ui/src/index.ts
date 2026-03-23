// Shared UI tokens and utilities
// Components are defined per-platform (web uses Tailwind, mobile uses NativeWind)

export const colors = {
  brand: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    900: "#0c4a6e",
  },
  success: "#16a34a",
  warning: "#d97706",
  danger: "#dc2626",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  heading1: { fontSize: 28, fontWeight: "700" as const },
  heading2: { fontSize: 22, fontWeight: "700" as const },
  heading3: { fontSize: 18, fontWeight: "600" as const },
  body: { fontSize: 15, fontWeight: "400" as const },
  caption: { fontSize: 12, fontWeight: "400" as const },
};
