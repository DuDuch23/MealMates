# CLAUDE.md

**MealMates** — plateforme anti-gaspillage alimentaire entre particuliers : les utilisateurs publient leurs surplus (vente ou don), réservent des offres autour d'eux, discutent par chat et confirment les échanges par QR code (paiement Stripe).

Monorepo : **API REST Symfony 7.2** (`backend/`, PHP ≥ 8.2, MySQL/MariaDB) + **React 18 / Vite / Tailwind CSS v4** (`frontend/`, JavaScript JSX).

## Règles de style — OBLIGATOIRES dans tout le repo

Le code doit être lisible immédiatement par un développeur qui découvre le projet.

1. **Objets et tableaux littéraux toujours multi-lignes** (une propriété par ligne) :

   ```js
   // ✅ Correct
   {
     to: "/offer",
     label: "Offres",
   }

   // ❌ Interdit
   { to: "/offer", label: "Offres" }
   ```

2. **Toujours des accolades et des sauts de ligne** sur les conditions et boucles — jamais de one-liner :

   ```js
   // ✅ Correct
   if (user === null) {
     return
   }

   // ❌ Interdit
   if (user === null) return
   ```

   Même règle en PHP : jamais `if (isset($x)) $y->set($x);` sur une ligne.

3. **Nommage professionnel et explicite** : pas d'abréviations opaques, verbes pour les fonctions (`fetchOffers`, `handleSubmit`), noms pour les valeurs (`selectedCategoryIds`).

4. **Un commentaire n'explique que ce que le code ne peut pas dire** (contrainte, piège, décision) — pas de paraphrase du code.

5. Getters/setters PHP : corps sur plusieurs lignes, jamais compactés sur une ligne.

6. **Styles : Tailwind CSS uniquement.** Pas de SCSS, pas de CSS modules, pas de fichiers `.css` custom (seule exception : `src/index.css` qui contient l'import Tailwind et les tokens `@theme`). Les couleurs du thème sont `primary`, `primary-dark`, `surface`, `surface-raised`, `surface-sunken`.

## Architecture frontend (`frontend/src/`)

- `pages/` — un fichier par route (`Offer.jsx`, `SingleOffer.jsx`, …), chargées en lazy dans `App.jsx`
- `components/` — composants réutilisables ; `components/avatars/` contient le catalogue SVG des avatars
- `layouts/NavLayout.jsx` — Header + BurgerMenu + Footer autour des pages
- `services/` — couche API par domaine : `apiClient.js` (fetch générique + auth), `authApi.js`, `userApi.js`, `offerApi.js`, `chatApi.js`, `geocodingApi.js`, `indexDb.js` (cache local chiffré du profil)

Règles :
- Aucun appel `fetch` direct dans les composants — toujours passer par `services/`
- Le token JWT est lu depuis `sessionStorage` **à chaque requête** (jamais capturé au chargement d'un module)
- Session : `authApi.getSessionUser()` / `storeSession()` / `logOut()` — ne pas manipuler `sessionStorage` à la main dans les pages

## Architecture backend (`backend/src/`)

- `Controller/Api*Controller.php` — endpoints REST (`/api/...`), auth JWT via LexikJWTAuthenticationBundle
- `Entity/` + `Repository/` — Doctrine ORM, migrations dans `backend/migrations/`
- `DataFixtures/` — jeu de données de dev
- `Command/` — tâches planifiées (expiration des offres/commandes, notifications)

## Lancer le projet

```bash
# Backend (nécessite PHP ≥ 8.2, Composer, MySQL/MariaDB)
cd backend
cp .env.example .env        # renseigner DATABASE_URL, JWT_PASSPHRASE, MAILER_DSN
composer install
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load   # optionnel, données de dev
symfony server:start -d     # https://127.0.0.1:8000

# Frontend
cd frontend
cp .env.example .env        # renseigner les variables ci-dessous
npm install
npm run dev                 # http://localhost:5173
```

## Variables d'environnement

Frontend (`frontend/.env`) :
```
VITE_API_BASE_URL           # URL de l'API Symfony (ex: https://127.0.0.1:8000)
VITE_UPLOADS_URL            # chemin des photos d'offres (/uploads/offers-photos/)
VITE_APP_GOOGLE_CLIENT_ID   # OAuth Google (SSO)
VITE_GOOGLE_MAP             # clé Google Maps + Geocoding
VITE_CRYPTO_KEY             # clé AES du cache IndexedDB
```

Backend (`backend/.env`) : `DATABASE_URL`, `APP_SECRET`, `JWT_PASSPHRASE` (+ clés dans `config/jwt/`), `CORS_ALLOW_ORIGIN`, `MAILER_DSN`, clés Stripe.

Jamais de secret commité ; `.env` reste dans `.gitignore`.

## Checklist avant déploiement

- `cd frontend && npm run build && npm run lint` passent sans erreur
- `cd backend && composer validate && php bin/console lint:container` passent
- `composer audit` et `npm audit` sans vulnérabilité high/critical
- Toutes les valeurs de `.env` serveur remplacées (aucun placeholder restant)
- Migrations testées sur staging avant une migration destructive (backup DB d'abord)
