import { useState } from "react"

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()
    onSearch(query)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-2 rounded-lg border border-primary px-4 py-3"
    >
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Rechercher une offre..."
        aria-label="Rechercher une offre"
        className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
      />
      <button
        type="submit"
        className="cursor-pointer whitespace-nowrap font-medium text-white transition-colors hover:text-primary"
      >
        Rechercher
      </button>
    </form>
  )
}
