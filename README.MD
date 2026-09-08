# MealMates

Plateforme anti-gaspillage alimentaire entre particuliers : publication de surplus (vente ou don), réservation, chat entre acheteur et vendeur, paiement Stripe et confirmation d'échange par QR code.

- `backend/` — API REST Symfony 7.2 (PHP ≥ 8.2, MySQL/MariaDB, JWT)
- `frontend/` — React 18 + Vite + Tailwind CSS v4

Règles de code, architecture détaillée : voir [CLAUDE.md](CLAUDE.MD).

## Prérequis

| Outil | Version | Notes |
|---|---|---|
| PHP | ≥ 8.2 | avec les extensions `pdo_mysql`, `intl`, `zip` |
| Composer | 2.x | |
| Node.js | ≥ 18 | avec npm |
| MySQL / MariaDB | ≥ 10.4 | XAMPP fonctionne très bien sur Windows |
| Symfony CLI | recommandé | pour `symfony server:start` (sinon `php -S` ou un vhost Apache/Nginx) |

## Installation

### 1. Base de données

Démarrer MySQL/MariaDB (sous XAMPP : `mysql_start.bat`, ou via le panneau de contrôle XAMPP) et créer une base vide :

```sql
CREATE DATABASE mealmates CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd backend
cp .env.example .env
```

Renseigner dans `.env` au minimum `DATABASE_URL` (voir [Variables d'environnement](#variables-denvironnement)), puis :

```bash
composer install

# Génère backend/config/jwt/{private,public}.pem (nécessaire à l'auth JWT)
php bin/console lexik:jwt:generate-keypair

# Crée le schéma à partir des entités Doctrine (voir note ci-dessous)
php bin/console doctrine:schema:update --force
php bin/console doctrine:migrations:version --add --all --no-interaction

php bin/console doctrine:fixtures:load   # optionnel, données de démo (voir plus bas)
symfony server:start                     # https://127.0.0.1:8000
```

> **Pourquoi `schema:update` plutôt que `doctrine:migrations:migrate` ?**
> L'historique de migrations du projet a été réinitialisé à un moment donné sans repartir d'un schéma vide : la plus ancienne migration (`Version20250627095802`) suppose des tables déjà existantes et échoue sur une base neuve (`Table 'notification' doesn't exist`). La séquence ci-dessus construit le schéma directement depuis les entités (source de vérité actuelle, validée par `doctrine:schema:validate`) puis marque les migrations existantes comme déjà appliquées, pour que les migrations futures s'enchaînent normalement. Si ce projet évolue vers un vrai historique de migrations propre, cette étape pourra être remplacée par un simple `doctrine:migrations:migrate`.

### 3. Frontend

```bash
cd frontend
cp .env.example .env
```

Renseigner les variables `VITE_*` (voir plus bas), puis :

```bash
npm install
npm run dev   # http://localhost:5173
```

### 4. Lancer les deux en même temps (Windows)

`start.bat` (à la racine) ouvre le frontend et le backend chacun dans sa propre fenêtre :

```bat
start.bat
```

## Variables d'environnement

### Backend (`backend/.env`)

| Variable | Requis | Description |
|---|---|---|
| `APP_ENV` | oui | `dev` en local, `prod` en production |
| `APP_SECRET` | oui | chaîne aléatoire longue (32+ car.) |
| `DATABASE_URL` | oui | ex. `mysql://root@127.0.0.1:3306/mealmates?serverVersion=10.4.32-MariaDB&charset=utf8mb4` |
| `CORS_ALLOW_ORIGIN` | oui | regex des origines front autorisées, ex. `'^https?://(localhost\|127\.0\.0\.1)(:[0-9]+)?$'` |
| `MAILER_DSN` | oui | `null://null` en dev (aucun mail envoyé) ; DSN SMTP/Brevo réel en prod |
| `JWT_SECRET_KEY` / `JWT_PUBLIC_KEY` | oui | chemins vers `config/jwt/*.pem`, générés par `lexik:jwt:generate-keypair` |
| `JWT_PASSPHRASE` | oui | peut rester vide en dev ; définir une passphrase si les clés sont protégées |
| `CLIENT_ID_GOOGLE` | pour le SSO Google | Client ID OAuth Google — **doit être identique** à `VITE_APP_GOOGLE_CLIENT_ID` côté frontend. Utilisé par `ApiUserController::ssoUsers()` pour vérifier l'ID token Google reçu du frontend. |
| `STRIPE_SECRET_KEY` | pour le paiement | clé secrète Stripe (mode test recommandé en dev) |
| `FRONT_LINK` | pour le paiement | URL du frontend utilisée dans les redirections Stripe, ex. `http://localhost:5173` |
| `DEFAULT_URI` | non | URI par défaut pour la génération d'URL absolues hors requête HTTP |

> Le `.env` de développement existant peut encore contenir `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `FRONTEND_SSO_SUCCESS_URL`, `FRONTEND_SSO_ERROR_URL`, `FRONTEND_URL` : ce sont des reliquats d'un ancien flux OAuth serveur jamais branché à une route, **non lus par le code actuel** (ni présents dans `.env.example`). À supprimer sans risque, ou à re-brancher si un flux OAuth serveur est réintroduit.

### Frontend (`frontend/.env`)

| Variable | Requis | Description |
|---|---|---|
| `VITE_API_BASE_URL` | oui | URL de l'API Symfony, ex. `https://127.0.0.1:8000` (le slash final est toléré) |
| `VITE_APP_GOOGLE_CLIENT_ID` | pour le SSO Google | même Client ID OAuth Google que `CLIENT_ID_GOOGLE` côté backend |
| `VITE_GOOGLE_MAP` | pour la carte des offres | clé API Google Maps (Maps JavaScript API + Geocoding API activées) |
| `VITE_CRYPTO_KEY` | oui | clé AES utilisée pour chiffrer le cache IndexedDB du profil utilisateur ; générer une valeur aléatoire longue par environnement |

> Sans `VITE_GOOGLE_MAP`, la carte et le géocodage d'adresse sont simplement indisponibles ; le reste de l'application fonctionne normalement.

Jamais de secret commité ; `.env` reste dans `.gitignore`.

## Obtenir les identifiants des services externes

Trois fonctionnalités dépendent d'un service tiers et ne marcheront pas tant que la clé correspondante n'est pas renseignée. Le reste de l'application (offres, chat, réservation) fonctionne sans elles.

### SSO Google (`CLIENT_ID_GOOGLE` + `VITE_APP_GOOGLE_CLIENT_ID`)

1. Aller sur la [Google Cloud Console](https://console.cloud.google.com/apis/credentials) et créer un projet (ou en réutiliser un existant).
2. **API et services → Identifiants → Créer des identifiants → ID client OAuth**.
3. Type d'application : **Application Web**.
4. Dans **"Origines JavaScript autorisées"**, ajouter chaque URL depuis laquelle le frontend sera ouvert en dev, ex. `http://localhost:5173` et `http://localhost:5174` (Vite peut basculer de port si 5173 est déjà pris). Aucune "URI de redirection" n'est nécessaire — le flux utilisé (`@react-oauth/google`, Google Identity Services) est entièrement côté client.
5. Copier le **Client ID** généré (le "Client secret" n'est pas utilisé par ce flux) et le mettre **tel quel dans les deux fichiers** : `CLIENT_ID_GOOGLE` (`backend/.env`) et `VITE_APP_GOOGLE_CLIENT_ID` (`frontend/.env`) — c'est la même valeur des deux côtés, le backend l'utilise pour vérifier que l'ID token reçu du frontend a bien été émis pour cette application.
6. Si l'URL de dev change (autre port, déploiement sur un nouveau domaine), il faut retourner ajouter la nouvelle origine à l'étape 4 — sinon Google répond `403` / `origin not allowed` (voir [Dépannage](#dépannage)).

### Carte des offres et géocodage (`VITE_GOOGLE_MAP`)

1. Dans le même projet Google Cloud (ou un autre), aller dans **API et services → Bibliothèque**.
2. Activer **Maps JavaScript API** et **Geocoding API**.
3. **API et services → Identifiants → Créer des identifiants → Clé API**.
4. Restreindre la clé (recommandé, surtout en prod) : dans **Restrictions de l'application**, limiter aux domaines/referrers du site ; dans **Restrictions relatives aux API**, limiter aux deux API activées à l'étape 2.
5. Copier la clé dans `VITE_GOOGLE_MAP`.
6. Google facture au-delà d'un quota gratuit mensuel assez large pour du dev/démo — pas de carte bancaire requise pour rester dans ce quota, mais Google peut en demander une pour activer le projet.

### Paiement Stripe (`STRIPE_SECRET_KEY`)

1. Créer un compte sur [dashboard.stripe.com/register](https://dashboard.stripe.com/register) (gratuit, aucune vérification d'entreprise nécessaire pour tester).
2. Rester en **mode Test** (bascule en haut à droite du dashboard) pour tout le développement — ne jamais utiliser de clé "live" en local.
3. **Développeurs → Clés API** → copier la **clé secrète** (commence par `sk_test_...`).
4. La coller dans `STRIPE_SECRET_KEY` (`backend/.env`).
5. Pour tester un paiement de bout en bout, Stripe fournit des numéros de carte de test, ex. `4242 4242 4242 4242`, n'importe quelle date d'expiration future, n'importe quel CVC à 3 chiffres.

### Emails (`MAILER_DSN`, optionnel en dev)

`MAILER_DSN=null://null` suffit en développement (aucun mail n'est réellement envoyé, l'app fonctionne normalement). Pour un envoi réel : créer un compte SMTP (ex. [Brevo](https://www.brevo.com/), gratuit jusqu'à 300 emails/jour), récupérer les identifiants SMTP dans son dashboard, et construire le DSN au format `smtp://USERNAME:PASSWORD@HOST:PORT`.

## Comptes de démonstration

Après `doctrine:fixtures:load`, ces comptes (parmi d'autres, voir `backend/src/DataFixtures/UserFixtures.php`) sont disponibles :

| Email | Mot de passe | Rôle |
|---|---|---|
| `user@example.com` | `password123` | Utilisateur |
| `admin@example.com` | `adminpass` | Admin |

## Dépannage

- **`SQLSTATE[HY000] [2002] ... refusée`** : MySQL/MariaDB n'est pas démarré, ou `DATABASE_URL` pointe vers le mauvais host/port.
- **`Table 'notification' doesn't exist` lors des migrations** : voir la note sur `schema:update` plus haut — la base est neuve, suivre la procédure d'installation telle quelle.
- **`Environment variable not found: "MAILER_DSN"`** : la ligne `MAILER_DSN` est absente ou commentée dans `.env` ; mettre `MAILER_DSN=null://null` en dev.
- **CORS bloqué en dev** : vérifier que l'origine du frontend correspond à la regex `CORS_ALLOW_ORIGIN`, et que l'URL appelée ne déclenche pas de redirection 301 (Symfony redirige `/api/offers` → `/api/offers/` par ex. ; un 301 mis en cache par le navigateur avec un mauvais port peut rejouer un mauvais header CORS après un changement de port du frontend — dans ce cas, un rechargement normal suffit une fois le port stabilisé).
- **Google SSO : `403` / `origin not allowed`** : l'origine du frontend n'est pas dans les "Origines JavaScript autorisées" du client OAuth — voir [Obtenir les identifiants des services externes](#obtenir-les-identifiants-des-services-externes).
- **Paiement Stripe indisponible** : `STRIPE_SECRET_KEY` manquante ou invalide dans `backend/.env` — voir [Obtenir les identifiants des services externes](#obtenir-les-identifiants-des-services-externes).
- **Carte des offres vide / géocodage d'adresse ne fonctionne pas** : `VITE_GOOGLE_MAP` manquante, ou Maps JavaScript API / Geocoding API non activées sur le projet Google Cloud — voir [Obtenir les identifiants des services externes](#obtenir-les-identifiants-des-services-externes).

## Checklist avant déploiement

- `cd frontend && npm run build && npm run lint` passent sans erreur
- `cd backend && composer validate && php bin/console lint:container` passent
- `composer audit` et `npm audit` sans vulnérabilité high/critical
- Toutes les valeurs de `.env` serveur remplacées (aucun placeholder restant)
- Migrations testées sur staging avant une migration destructive (backup DB d'abord)
