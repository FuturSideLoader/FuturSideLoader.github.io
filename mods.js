import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// 🔥 Config Firebase (remplace par la tienne)
const firebaseConfig = {
  apiKey: "TA_CLE_API",
  authDomain: "TON_PROJET.firebaseapp.com",
  projectId: "TON_PROJET",
  storageBucket: "TON_PROJET.appspot.com",
  messagingSenderId: "ID",
  appId: "ID"
};

// 🔥 Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 🔥 Vérifier l’authentification
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadMods();
  } else {
    document.getElementById("mods-container").innerHTML = "<p>You must be logged in to see the mods.</p>";
  }
});

// 📥 Charger les mods depuis Firestore
async function loadMods() {
  const modsContainer = document.getElementById("mods-container");
  modsContainer.innerHTML = ""; // Vide le container

  const querySnapshot = await getDocs(collection(db, "mods"));
  querySnapshot.forEach((doc) => {
    const mod = doc.data();
    const modElement = document.createElement("div");
    modElement.classList.add("mod-item");

    modElement.innerHTML = `
      <h2>${mod.name}</h2>
      <p>${mod.description}</p>
      <a href="${mod.download}" class="btn" ${mod.premium ? "style='background-color: #ffc107;'" : ""}>Download</a>
    `;

    modsContainer.appendChild(modElement);
  });
}
