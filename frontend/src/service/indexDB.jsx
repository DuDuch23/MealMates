// src/utils/indexedDB.js

export const getDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('mealmates', 1);
  
      request.onsuccess = event => {
        resolve(event.target.result);
      };
  
      request.onerror = event => {
        reject('Erreur d\'ouverture de la base de données');
      };
  
      request.onupgradeneeded = event => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('utilisateurs')) {
          const objectStore = db.createObjectStore('utilisateurs', { keyPath: 'id' });
          objectStore.createIndex('nom', 'nom', { unique: false });
          objectStore.createIndex('prenom','prenom',{unique: false});
          objectStore.createIndex('email', 'email', { unique: true });
          objectStore.createIndex('iconUser', 'iconUser', {unique: false});
        }
      };
    });
};
  
export const addUser = (db, utilisateur) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['utilisateurs'], 'readwrite');
    const objectStore = transaction.objectStore('utilisateurs');
    const request = objectStore.add(utilisateur);

    request.onsuccess = () => resolve('Utilisateur ajouté');
    request.onerror = (event) => reject(event.target.error);
  });
};
  
export const getUser = (db, id) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['utilisateurs'], 'readonly');
      const objectStore = transaction.objectStore('utilisateurs');
      const request = objectStore.get(id);
  
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
};

export const deleteUser = (db, id) => {
    return new Promise((resolve,reject) => {
        const transaction = db.transaction([`utilisateurs`], 'readonly');
        const objectStore = transaction.createObjectStore('utilisateurs');
    });
}
  