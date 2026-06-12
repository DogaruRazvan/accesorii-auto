"use client"

import { useEffect, useState } from "react"

// Comutator light/dark. La prima vizita urmeaza setarea device-ului
// (prefers-color-scheme); cand utilizatorul apasa, alegerea lui se salveaza
// in localStorage si are prioritate. Scriptul din app/layout.tsx aplica deja
// tema inainte de paint, deci aici doar sincronizam starea dupa montare.
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsDark(document.documentElement.classList.contains("dark"))

    // Daca utilizatorul nu a ales manual, urmarim schimbarile din OS.
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        apply(e.matches)
        setIsDark(e.matches)
      }
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const apply = (dark: boolean) => {
    const el = document.documentElement
    if (dark) {
      el.classList.add("dark")
      el.setAttribute("data-mode", "dark")
    } else {
      el.classList.remove("dark")
      el.setAttribute("data-mode", "light")
    }
  }

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    apply(next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Comută pe mod luminos" : "Comută pe mod întunecat"}
      className="relative flex items-center justify-center w-9 h-9 rounded-full text-content/70 hover:text-cta hover:bg-content/5 transition-all duration-200 active:scale-90"
    >
      {/* Soare (vizibil pe dark -> apasa pt light) / Luna (vizibil pe light) */}
      <span suppressHydrationWarning>
        {mounted && isDark ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </span>
    </button>
  )
}

export default ThemeToggle
