import logo from "../assets/logo-mealmates.png"

const footerLinks = [
  {
    href: "#",
    label: "Mentions légales",
  },
  {
    href: "#",
    label: "Politique de confidentialité",
  },
  {
    href: "#",
    label: "Contact",
  },
]

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-6 px-6 py-8 md:flex-row md:justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo MealMates" className="h-20 w-20 object-contain" />
          <p className="text-2xl font-bold">MealMates</p>
        </div>

        <nav className="flex flex-wrap justify-center gap-4">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-gray-300 transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <p className="pb-4 text-center text-xs text-gray-400">
        © MealMates 2025 — Mangeons mieux, ensemble.
      </p>
    </footer>
  )
}
