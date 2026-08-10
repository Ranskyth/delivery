"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"

const ThemeContext = React.createContext<{
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
}>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
})

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setThemeState] = React.useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] = React.useState<"light" | "dark">("light")

  React.useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null
    if (stored) setThemeState(stored)

    function applyTheme(t: Theme) {
      const resolved = t === "system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : t
      setResolvedTheme(resolved)
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(resolved)
    }

    applyTheme(stored || "system")

    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => {
      if (theme === "system") applyTheme("system")
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [theme])

  function setTheme(t: Theme) {
    setThemeState(t)
    localStorage.setItem("theme", t)
    const resolved = t === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : t
    setResolvedTheme(resolved)
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(resolved)
  }

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key.toLowerCase() !== "d") return

      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")
      ) {
        return
      }

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [resolvedTheme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return React.useContext(ThemeContext)
}
