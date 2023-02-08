import type { ColorScheme } from "@mantine/core";
import { setCookie } from "cookies-next";

export function toggleTheme(value?: ColorScheme | undefined): ColorScheme {
  if (typeof window === "undefined") return "light";
  const theme = localStorage.getItem("theme") || "light";
  const newColor = theme === "dark" ? "light" : "dark";
  if (value === "dark" || newColor === "dark") {
    document.querySelector("html")?.classList.add("dark");
  } else if (value === "light" || newColor === "light") {
    document.querySelector("html")?.classList.remove("dark");
  }
  setCookie("theme", value || newColor);
  localStorage.setItem("theme", value || newColor);
  return value || newColor;
}
