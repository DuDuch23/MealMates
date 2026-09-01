import avatarIcons from "./avatarIcons"

/** Affiche l'avatar d'un utilisateur à partir de son id d'icône. */
export default function UserAvatar({ iconId, className = "size-12" }) {
  const icon = avatarIcons.find((avatarIcon) => avatarIcon.id === iconId)

  if (!icon) {
    return null
  }

  return (
    <div className={`shrink-0 [&_svg]:h-full [&_svg]:w-full ${className}`}>
      {icon.img}
    </div>
  )
}
