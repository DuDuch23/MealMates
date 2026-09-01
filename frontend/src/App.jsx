import React, { Suspense, useEffect } from "react"
import { Routes, Route, useNavigate } from "react-router"
import NavLayout from "./layouts/NavLayout"
import logo from "./assets/logo-mealmates.png"
import { getSessionUser, isSessionExpired, logOut } from "./services/authApi"

// Pages chargées à la demande pour alléger le bundle initial
const Home = React.lazy(() => import("./pages/Home"))
const Offer = React.lazy(() => import("./pages/Offer"))
const AddOffer = React.lazy(() => import("./pages/AddOffer"))
const ModifyOffer = React.lazy(() => import("./pages/ModifyOffer"))
const SingleOffer = React.lazy(() => import("./pages/SingleOffer"))
const Connexion = React.lazy(() => import("./pages/Connexion"))
const Inscription = React.lazy(() => import("./pages/Inscription"))
const Deconnexion = React.lazy(() => import("./pages/Deconnexion"))
const UserProfile = React.lazy(() => import("./pages/UserProfile"))
const UserModify = React.lazy(() => import("./pages/UserModify"))
const UserMealCard = React.lazy(() => import("./pages/UserMealCard"))
const UserDashboard = React.lazy(() => import("./pages/UserDashboard"))
const Chat = React.lazy(() => import("./pages/Chat"))
const ChooseChat = React.lazy(() => import("./pages/ChooseChat"))
const QrCode = React.lazy(() => import("./pages/QrCode"))
const Confirmation = React.lazy(() => import("./pages/Confirmation"))
const NotFound = React.lazy(() => import("./pages/NotFound"))

/** La racine dépend de la session : offres pour un connecté, landing sinon. */
function RootPage() {
  return getSessionUser() !== null ? <Offer /> : <Home />
}

export default function App() {
  const navigate = useNavigate()

  // Déconnecte automatiquement l'utilisateur dont le token a expiré
  useEffect(() => {
    const checkSession = async () => {
      if (!isSessionExpired()) {
        return
      }

      try {
        await logOut()
      } catch (error) {
        console.error("Erreur pendant la déconnexion :", error)
      } finally {
        navigate("/connexion")
      }
    }

    checkSession()
    // Vérification unique au chargement de l'application
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <img src={logo} alt="Logo MealMates" className="size-32 animate-pulse" />
        </div>
      }
    >
      <Routes>
        <Route element={<NavLayout />}>
          <Route path="/" element={<RootPage />} />

          <Route path="/offer" element={<Offer />} />
          <Route path="/offer/:id" element={<SingleOffer />} />
          <Route path="/addOffer" element={<AddOffer />} />
          <Route path="/modifyOffer/:id" element={<ModifyOffer />} />

          <Route path="/chat" element={<Chat />} />
          <Route path="/chooseChat" element={<ChooseChat />} />

          <Route path="/userProfile/:id" element={<UserProfile />} />
          <Route path="/userMealCard/:id" element={<UserMealCard />} />
          <Route path="/userModify/:id" element={<UserModify />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Route>

        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/deconnexion" element={<Deconnexion />} />

        <Route path="/qrcode/:id" element={<QrCode />} />
        <Route path="/confirmation" element={<Confirmation />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
