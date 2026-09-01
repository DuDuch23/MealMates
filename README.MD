# MealMates

Plateforme anti-gaspillage alimentaire entre particuliers : publication de surplus (vente ou don), réservation, chat entre acheteur et vendeur, paiement Stripe et confirmation d'échange par QR code.

- `backend/` — API REST Symfony 7.2 (PHP ≥ 8.2, MySQL/MariaDB, JWT)
- `frontend/` — React 18 + Vite + Tailwind CSS v4

Instructions de lancement détaillées et variables d'environnement : voir [CLAUDE.md](CLAUDE.MD).

## Installation sur le serveur

```bash
cd /data/mealmates
git fetch
git pull mealmates preprod

# Backend
cd backend
cp .env.example .env   # renseigner DATABASE_URL, JWT_PASSPHRASE, MAILER_DSN...
composer install
php bin/console doctrine:migrations:migrate
symfony server:start -d

# Frontend
cd ../frontend
cp .env.example .env   # renseigner les variables VITE_*
npm install
npm run build
```
