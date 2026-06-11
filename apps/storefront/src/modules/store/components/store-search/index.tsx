"use client"

import { useRouter, useParams } from "next/navigation"
import { useState } from "react"

const StoreSearch = ({ defaultValue = "" }: { defaultValue?: string }) => {
  const [value, setValue] = useState(defaultValue)
  const router = useRouter()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || ""

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    const base = `/${countryCode}/store?view=all`
    router.push(q ? `${base}&q=${encodeURIComponent(q)}` : base)
  }

  return (
    <form onSubmit={submit} className="w-full max-w-xl mx-auto">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Caută produse..."
          className="w-full py-3.5 pl-12 pr-28 rounded-full border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 shadow-sm outline-none transition-all focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-5 py-2 rounded-full bg-brand-primary text-white text-sm font-medium transition-all hover:bg-brand-secondary active:scale-95"
        >
          Caută
        </button>
      </div>
    </form>
  )
}

export default StoreSearch
