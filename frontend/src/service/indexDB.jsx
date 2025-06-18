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

export const getUserIndexDB = () => {};
export const deleteUserIndexDB = () => {};
export const addUserIndexDB = () => {};