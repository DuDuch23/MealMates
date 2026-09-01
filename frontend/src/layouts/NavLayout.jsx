import { useState } from "react"
import { Outlet } from "react-router"
import Header from "../components/Header"
import BurgerMenu from "../components/BurgerMenu"
import Footer from "../components/Footer"
import { getSessionUser } from "../services/authApi"

export default function NavLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const user = getSessionUser()

  return (
    <div className="flex min-h-screen flex-col">
      <Header onProfileClick={() => setIsMenuOpen((open) => !open)} />
      {user !== null && isMenuOpen && (
        <BurgerMenu onClose={() => setIsMenuOpen(false)} />
      )}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
