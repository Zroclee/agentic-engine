import { colors } from "./colors";
import { shadows } from "./shadows";

export const themeTokens = {
  colors,
  shadows,
  gradients: {
    "ai-gradient": "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)",
    "ai-gradient-soft":
      "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(6,182,212,0.2))",
  },
  animations: {
    glowPulse: "glowPulse 2s infinite ease-in-out",
    gradientMove: "gradientMove 3s linear infinite",
  },
  blur: {
    xs: "2px",
  },
};
