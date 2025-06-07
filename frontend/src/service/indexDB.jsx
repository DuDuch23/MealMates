import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_CRYPTO_KEY || "default-key";

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
      if (!db.objectStoreNames.contains("utilisateurs")) {
        const store = db.createObjectStore("utilisateurs", { keyPath: "id" });
        store.createIndex("nom", "nom", { unique: false });
        store.createIndex("prenom", "prenom", { unique: false });
        store.createIndex("email", "email", { unique: true });
        store.createIndex("iconUser", "iconUser", { unique: false });
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
    const tx = db.transaction("utilisateurs", "readwrite");
    const store = tx.objectStore("utilisateurs");

    const request = store.put({ id: utilisateur.id, encrypted });

    request.onsuccess = () => resolve("Utilisateur ajouté avec succès");
    request.onerror = (event) => reject(`Erreur ajout utilisateur : ${event.target.error}`);
  });
};

// Récupérer un utilisateur par ID
export const getUserIndexDB = async (id) => {
  console.log("getUserIndexDB id reçu :", id, typeof id);

  if (id === undefined || id === null || (typeof id !== "string" && typeof id !== "number")) {
    return Promise.reject("ID utilisateur invalide ou non fourni");
  }

  const db = await getDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("utilisateurs", "readonly");
    const store = tx.objectStore("utilisateurs");

    const request = store.get(id);

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
    const tx = db.transaction("utilisateurs", "readwrite");
    const store = tx.objectStore("utilisateurs");

    const getRequest = store.get(userId);

    getRequest.onsuccess = () => {
      const existing = getRequest.result;

      if (!existing) return reject("Utilisateur introuvable");

      try {
        const decrypted = JSON.parse(
          CryptoJS.AES.decrypt(existing.encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8)
        );

        const merged = { ...decrypted, ...newUserData };
        const reEncrypted = CryptoJS.AES.encrypt(JSON.stringify(merged), SECRET_KEY).toString();

        const updateRequest = store.put({ id: userId, encrypted: reEncrypted });

        updateRequest.onsuccess = () => resolve("Utilisateur mis à jour");
        updateRequest.onerror = (event) => reject(`Erreur mise à jour : ${event.target.error}`);
      } catch (e) {
        console.error("Déchiffrement impossible lors de la mise à jour :", e);
        reject("Données utilisateur corrompues");
      }
    };

    getRequest.onerror = (event) => reject(`Erreur récupération utilisateur : ${event.target.error}`);
  });
};

// Supprimer la base de données
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
};
