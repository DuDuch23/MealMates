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

      const decrypted = JSON.parse(CryptoJS.AES.decrypt(result.encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8));
      resolve(decrypted);
    };
    request.onerror = (event) => reject(`Erreur récupération utilisateur : ${event.target.error}`);
  });
};

// ajouter une recherche
export const addSearchIndexDB = async (rechereche,user) => {

    if (!user?.id) {
      throw new Error("L'utilisateur doit avoir un ID valide");
    }

    const db = await getDatabase();
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(rechereche), SECRET_KEY).toString();

    return new Promise((resolve, reject) => {
      const dbRequest = db.transaction("rechereche", "readwrite");
      const store = dbRequest.objectStore("rechereche");

      const request = store.put({ id: rechereche.id, encrypted });

      request.onsuccess = () => resolve("Recherche sauvegarder avec succès");
      request.onerror = (event) => reject(`Erreur lors de la sauvegarde de la recherche : ${event.target.error}`);
  });

}

export const getAllSearch = async () => {
  const db = await getDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("rechereche", "readonly");
    const store = transaction.objectStore("rechereche");

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
}
