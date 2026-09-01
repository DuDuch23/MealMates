import CryptoJS from "crypto-js"

const DATABASE_NAME = "mealmates"
const DATABASE_VERSION = 1
const USER_STORE = "utilisateurs"
const SECRET_KEY = import.meta.env.VITE_CRYPTO_KEY

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

    request.onerror = () => {
      reject(new Error("Erreur d'ouverture de la base IndexedDB"))
    }

    request.onsuccess = (event) => {
      resolve(event.target.result)
    }

    request.onupgradeneeded = (event) => {
      const database = event.target.result
      if (!database.objectStoreNames.contains(USER_STORE)) {
        database.createObjectStore(USER_STORE, { keyPath: "id" })
      }
    }
  })
}

function encryptUser(user) {
  return CryptoJS.AES.encrypt(JSON.stringify(user), SECRET_KEY).toString()
}

function decryptUser(encrypted) {
  const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8)
  return JSON.parse(decrypted)
}

/** Stocke le profil utilisateur chiffré dans IndexedDB. */
export async function addUserIndexDb(user) {
  if (!user?.id) {
    throw new Error("L'utilisateur doit avoir un identifiant valide")
  }

  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const store = database.transaction(USER_STORE, "readwrite").objectStore(USER_STORE)
    const request = store.put({
      id: user.id,
      encrypted: encryptUser(user),
    })

    request.onsuccess = () => {
      resolve()
    }
    request.onerror = (event) => {
      reject(new Error(`Erreur d'ajout utilisateur : ${event.target.error}`))
    }
  })
}

export async function getUserIndexDb(id) {
  const numericId = Number(id)
  if (Number.isNaN(numericId)) {
    throw new Error(`Identifiant utilisateur invalide : ${id}`)
  }

  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const store = database.transaction(USER_STORE, "readonly").objectStore(USER_STORE)
    const request = store.get(numericId)

    request.onsuccess = () => {
      const record = request.result
      if (!record) {
        resolve(null)
        return
      }

      try {
        resolve(decryptUser(record.encrypted))
      } catch {
        reject(new Error("Impossible de déchiffrer les données utilisateur"))
      }
    }

    request.onerror = (event) => {
      reject(new Error(`Erreur de lecture utilisateur : ${event.target.error}`))
    }
  })
}

export async function updateUserIndexDb(id, newUserData) {
  const existingUser = await getUserIndexDb(id)
  if (!existingUser) {
    throw new Error("Utilisateur introuvable dans IndexedDB")
  }

  return addUserIndexDb({
    ...existingUser,
    ...newUserData,
    id: existingUser.id,
  })
}

/** Supprime toute la base locale (utilisé à la déconnexion). */
export function deleteUserIndexDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DATABASE_NAME)

    request.onsuccess = () => {
      resolve()
    }
    request.onerror = (event) => {
      reject(event.target.error)
    }
    request.onblocked = () => {
      // Un autre onglet garde la base ouverte : la suppression aura lieu
      // quand il la relâchera, on ne bloque pas la déconnexion pour ça.
      resolve()
    }
  })
}
