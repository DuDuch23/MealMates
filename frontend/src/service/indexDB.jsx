import CryptoJS from "crypto-js";
const SECRET_KEY = import.meta.env.VITE_CRYPTO_KEY || "default-key";

// Ouvre (ou crée) la base de données
export const getDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('mealmates', 1);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = () => {
      reject("Erreur d'ouverture de la base de données");
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('utilisateurs')) {
        const objectStore = db.createObjectStore('utilisateurs', { keyPath: 'id' });
        objectStore.createIndex('nom', 'nom', { unique: false });
        objectStore.createIndex('prenom', 'prenom', { unique: false });
        objectStore.createIndex('email', 'email', { unique: true });
        objectStore.createIndex('iconUser', 'iconUser', { unique: false });
        // Aucune indexation nécessaire pour "preferences" (stocké tel quel)
      }
    };
  });
};

// Ajouter un utilisateur
export const addUserIndexDB = async (utilisateur) => {
  const db = await getDatabase();
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(utilisateur), SECRET_KEY).toString();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['utilisateurs'], 'readwrite');
    const objectStore = transaction.objectStore('utilisateurs');
    const request = objectStore.put({ id: utilisateur.id, encrypted });

    request.onsuccess = () => resolve('Utilisateur ajouté avec succès');
    request.onerror = (event) => reject(`Erreur ajout utilisateur : ${event.target.error}`);
  });
};

export const updateUserIndexDB = async (userId, updatedUserData) => {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['utilisateurs'], 'readwrite');
    const objectStore = transaction.objectStore('utilisateurs');

    const getRequest = objectStore.get(userId);

    getRequest.onsuccess = () => {
      const existingUser = getRequest.result;
      if (!existingUser) {
        return reject("Utilisateur non trouvé");
      }

      // Fusionne les anciennes données avec les nouvelles
      const updatedUser = { ...existingUser, ...updatedUserData };

      const updateRequest = objectStore.put(updatedUser);

      updateRequest.onsuccess = () => resolve('Utilisateur mis à jour');
      updateRequest.onerror = (event) => reject(`Erreur mise à jour : ${event.target.error}`);
    };

    getRequest.onerror = (event) => reject(`Erreur récupération utilisateur : ${event.target.error}`);
  });
};

// Récupérer un utilisateur par ID
export const getUserIndexDB = async (id) => {
  const db = await getDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['utilisateurs'], 'readonly');
    const objectStore = transaction.objectStore('utilisateurs');
    const request = objectStore.get(id);

    request.onsuccess = (event) => {
      const result = event.target.result;
      if (!result) return resolve(null);

      const decrypted = JSON.parse(CryptoJS.AES.decrypt(result.encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8));
      resolve(decrypted);
    };
    request.onerror = (event) => reject(`Erreur récupération utilisateur : ${event.target.error}`);
  });
};

// Supprimer un utilisateur par ID
export const deleteUserIndexDB = async (id) => {
  return new Promise((resolve, reject) => {
    const deleteRequest = indexedDB.deleteDatabase("mealmates");

    deleteRequest.onsuccess = () => {
      console.log("Base de données supprimée avec succès");
      resolve();
    };

    deleteRequest.onerror = (event) => {
      console.error("Erreur suppression base de données :", event.target.error);
      reject(event.target.error);
    };

    deleteRequest.onblocked = () => {
      console.warn("Suppression bloquée : l'onglet utilise encore la base");
    };
  });
};
