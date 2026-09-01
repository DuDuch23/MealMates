import { useState } from "react"
import avatarIcons from "./avatarIcons"
import UserAvatar from "./UserAvatar"

/** Sélecteur d'avatar : affiche l'avatar courant et une grille de choix. */
export default function AvatarPicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (iconId) => {
    onChange(iconId)
    setIsOpen(false)
  }

  return (
    <div className="relative flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="cursor-pointer rounded-full transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Changer d'avatar"
      >
        <UserAvatar iconId={value} className="size-24" />
      </button>
      <span className="text-sm text-gray-400">Cliquer pour changer d'avatar</span>

      {isOpen && (
        <div
          role="listbox"
          className="absolute top-full z-30 mt-2 grid max-h-80 w-72 grid-cols-4 gap-2 overflow-y-auto rounded-xl border border-gray-700 bg-surface-sunken p-3 shadow-xl"
        >
          {avatarIcons.map((icon) => (
            <button
              key={icon.id}
              type="button"
              role="option"
              aria-selected={icon.id === value}
              onClick={() => handleSelect(icon.id)}
              className={`cursor-pointer rounded-lg p-1 transition-colors hover:bg-surface-raised ${
                icon.id === value ? "ring-2 ring-primary" : ""
              }`}
            >
              <UserAvatar iconId={icon.id} className="size-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
