# MealMates

Install du site sur le serveur : 
```
cd /data/mealmates
git fetch
git pull mealmates preprod
cd backend
mv .env.example .env
nano .env #ajouter les logins bdd, ...
composer install
symfony server:start -d 
cd ../frontend
npm install 
find src -name "*.scss" -exec bash -c 'sass {} ${0%.scss}.css' {} \;
npm run build
```