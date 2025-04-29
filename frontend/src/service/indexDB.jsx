// src/utils/indexedDB.js

// Ouvre (ou crée) la base de données
export const getDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('mealmates', 1);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = () => {
      reject('Erreur d\'ouverture de la base de données');
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('utilisateurs')) {
        const objectStore = db.createObjectStore('utilisateurs', { keyPath: 'id' });
        objectStore.createIndex('nom', 'nom', { unique: false });
        objectStore.createIndex('prenom', 'prenom', { unique: false });
        objectStore.createIndex('email', 'email', { unique: true });
        objectStore.createIndex('iconUser', 'iconUser', { unique: false });
      }
    };
  });
};

// Ajouter un utilisateur
export const addUserIndexDB = async (utilisateur) => {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['utilisateurs'], 'readwrite');
    const objectStore = transaction.objectStore('utilisateurs');
    const request = objectStore.add(utilisateur);

    request.onsuccess = () => resolve('Utilisateur ajouté avec succès');
    request.onerror = (event) => reject(`Erreur ajout utilisateur : ${event.target.error}`);
  });
};

// Récupérer un utilisateur par ID
export const getUserIndexDB = async (id) => {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['utilisateurs'], 'readonly');
    const objectStore = transaction.objectStore('utilisateurs');
    const request = objectStore.get(id);

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(`Erreur récupération utilisateur : ${event.target.error}`);
  });
};

// Supprimer un utilisateur par ID
export const deleteUserIndexDB = async (id) => {
  const db = await getDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['utilisateurs'], 'readwrite');
    const objectStore = transaction.objectStore('utilisateurs');
    const request = objectStore.delete(id);

    request.onsuccess = () => resolve('Utilisateur supprimé');
    request.onerror = (event) => reject(`Erreur suppression utilisateur : ${event.target.error}`);
  });
};
