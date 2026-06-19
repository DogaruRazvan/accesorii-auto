"use client"

import { createProductReview } from "@lib/data/reviews"
import { clx } from "@modules/common/components/ui"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

export default function ReviewForm({ productId }: { productId: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [authorName, setAuthorName] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (rating < 1) {
      setError("Te rugăm să alegi o notă (de la 1 la 5 stele).")
      return
    }
    if (authorName.trim().length < 2) {
      setError("Te rugăm să completezi numele.")
      return
    }
    if (content.trim().length < 3) {
      setError("Te rugăm să scrii câteva cuvinte despre produs.")
      return
    }

    startTransition(async () => {
      const res = await createProductReview(productId, {
        rating,
        author_name: authorName.trim(),
        title: title.trim() || undefined,
        content: content.trim(),
      })

      if (!res.success) {
        setError(res.error || "A apărut o eroare. Încearcă din nou.")
        return
      }

      setDone(true)
      setRating(0)
      setAuthorName("")
      setTitle("")
      setContent("")
      router.refresh()
    })
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-cta/40 bg-cta/5 p-6 text-center">
        <p className="font-semibold text-content">Mulțumim pentru recenzie!</p>
        <p className="mt-1 text-sm text-subtle">
          Recenzia ta a fost publicată.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-4 text-sm font-semibold text-cta hover:underline"
        >
          Scrie altă recenzie
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-card p-5 small:p-6"
    >
      <h3 className="text-base font-semibold text-content">Lasă o recenzie</h3>

      {/* Selector stele */}
      <div className="mt-4 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} stele`}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={clx(
                (hover || rating) >= n ? "text-amber-400" : "text-content/15"
              )}
            >
              <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.77l-5.8 3.05 1.1-6.46-4.69-4.58 6.49-.94L12 2.5z" />
            </svg>
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4">
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Numele tău"
          maxLength={80}
          className="w-full rounded-xl border border-line bg-page px-4 py-2.5 text-sm text-content placeholder:text-subtle focus:border-cta focus:outline-none"
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titlu (opțional)"
          maxLength={120}
          className="w-full rounded-xl border border-line bg-page px-4 py-2.5 text-sm text-content placeholder:text-subtle focus:border-cta focus:outline-none"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Părerea ta despre produs..."
          rows={4}
          maxLength={2000}
          className="w-full resize-y rounded-xl border border-line bg-page px-4 py-2.5 text-sm text-content placeholder:text-subtle focus:border-cta focus:outline-none"
        />
      </div>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 inline-flex items-center justify-center rounded-full bg-cta px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover disabled:opacity-60"
      >
        {pending ? "Se trimite..." : "Trimite recenzia"}
      </button>
    </form>
  )
}
