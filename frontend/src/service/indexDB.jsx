import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_CRYPTO_KEY;

// Ouvre (ou crée) la base de données
export const getDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("mealmates", 1);

    request.onerror = () => reject("Erreur d'ouverture de la base de données");

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      //  Table user
      if (!db.objectStoreNames.contains("utilisateurs")) {
        const userStore = db.createObjectStore("utilisateurs", { keyPath: "id" });
        userStore.createIndex("nom", "nom", { unique: false });
        userStore.createIndex("prenom", "prenom", { unique: false });
        userStore.createIndex("email", "email", { unique: true });
        userStore.createIndex("iconUser", "iconUser", { unique: false });
      }

      // Table search
      if (!db.objectStoreNames.contains("search")) {
        const searchStore = db.createObjectStore("search", { keyPath: "id" });
        searchStore.createIndex("userId", "userId", { unique: false });
        searchStore.createIndex("timestamp", "timestamp", { unique: false });
      }
    };
  });
};

// Ajouter un utilisateur (données chiffrées)
export const addUserIndexDB = async (utilisateur) => {
  if (!utilisateur?.id) {
    throw new Error("L'utilisateur doit avoir un ID valide");
  }

  const db = await getDatabase();
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(utilisateur), SECRET_KEY).toString();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("utilisateurs", "readwrite");
    const store = transaction.objectStore("utilisateurs");

    const request = store.put({ id: utilisateur.id, encrypted });

    request.onsuccess = () => resolve("Utilisateur ajouté avec succès");
    request.onerror = (event) => reject(`Erreur ajout utilisateur : ${event.target.error}`);
  });
};

// Récupérer un utilisateur par ID
export const getUserIndexDB = async (id) => {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) {
    return Promise.reject("ID utilisateur invalide : " + id);
  }

  const db = await getDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("utilisateurs", "readonly");
    const store = transaction.objectStore("utilisateurs");

    const request = store.get(numericId);

    request.onsuccess = () => {
      const record = request.result;
      if (!record) return resolve(null);

      try {
        const decrypted = JSON.parse(
          CryptoJS.AES.decrypt(record.encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8)
        );
        resolve(decrypted);
      } catch (e) {
        console.error("Erreur lors du déchiffrement :", e);
        reject("Impossible de déchiffrer les données utilisateur");
      }
    };

    request.onerror = (event) => reject(`Erreur lecture utilisateur : ${event.target.error}`);
  });
};

// Mettre à jour un utilisateur
export const updateUserIndexDB = async (userId, newUserData) => {
  if (!userId) throw new Error("ID utilisateur requis");

  const db = await getDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("utilisateurs", "readwrite");
    const store = transaction.objectStore("utilisateurs");

    const getRequest = store.get(userId);

    getRequest.onsuccess = () => {
      const existing = getRequest.result;

      if (!existing) return reject("Utilisateur introuvable");

      try {
        const decrypted = JSON.parse(
          CryptoJS.AES.decrypt(existing.encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8)
        );

        const updated = { ...decrypted, ...newUserData };
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(updated), SECRET_KEY).toString();

        const putRequest = store.put({ id: userId, encrypted });

        putRequest.onsuccess = () => resolve("Utilisateur mis à jour avec succès");
        putRequest.onerror = (event) => reject(`Erreur mise à jour utilisateur : ${event.target.error}`);
      } catch (e) {
        reject("Erreur lors du déchiffrement des données existantes");
      }
    };

    getRequest.onerror = (event) => reject(`Erreur récupération utilisateur : ${event.target.error}`);
  });
};


// ajouter une recherche
export const addSearchIndexDB = async (search,storedUser) => {
  const allSearch = await getAllSearch();

  const id = allSearch.length + 1;

  if (!storedUser.id) {
    throw new Error("L'utilisateur doit avoir un ID valide");
  }

  const db = await getDatabase();
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(search), SECRET_KEY).toString();

  console.log(allSearch);

  return new Promise((resolve, reject) => {
    const dbRequest = db.transaction("search", "readwrite");
    const store = dbRequest.objectStore("search");
    const request = store.put({ id: id, encrypted });
    request.onsuccess = () => resolve("Recherche sauvegarder avec succès");
    request.onerror = (event) => reject(`Erreur lors de la sauvegarde de la recherche : ${event.target.error}`);
  });
}

// tout l'historique des recherches
export const getAllSearch = async () => {
  const db = await getDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("search", "readonly");
    const store = transaction.objectStore("search");

    const request = store.getAll();

    request.onsuccess = () => {
      const results = request.result;
      try {
        const decryptedResults = results.map(record => {
          const decryptedData = CryptoJS.AES.decrypt(record.encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8);
          return JSON.parse(decryptedData);
        });
        resolve(decryptedResults);
      } catch (error) {
        console.error("Erreur de déchiffrement :", error);
        reject("Impossible de déchiffrer les données");
      }
    };

    request.onerror = (event) => reject(`Erreur lecture : ${event.target.error}`);
  });
};


export const deleteUserIndexDB = async () => {
  return new Promise((resolve, reject) => {
    const deleteRequest = indexedDB.deleteDatabase("mealmates");

    deleteRequest.onsuccess = () => {
      console.log("Base de données supprimée");
      resolve();
    };

    deleteRequest.onerror = (event) => {
      console.error("Erreur suppression DB :", event.target.error);
      reject(event.target.error);
    };

    deleteRequest.onblocked = () => {
      console.warn("Suppression bloquée : base utilisée par un autre onglet");
    };
  });
}
