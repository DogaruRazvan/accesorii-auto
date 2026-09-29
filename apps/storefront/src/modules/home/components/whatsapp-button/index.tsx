import styles from "./styles.module.css"

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/40737502873"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Scrie-ne pe WhatsApp la 0737 502 873 (se deschide într-o fereastră nouă)"
      className={styles.button}
    >
      <span className={styles.label}>Scrie-ne pe WhatsApp</span>
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M21 11.5a9 9 0 0 1-13.4 7.9L3 21l1.6-4.6A9 9 0 1 1 21 11.5Z" />
        <path d="m8 7 2 3-1.2 1.2a10 10 0 0 0 4 4L14 14l3 2c-1 2-3 2-5 1a12 12 0 0 1-5-5c-1-2-1-4 1-5Z" />
      </svg>
    </a>
  )
}
