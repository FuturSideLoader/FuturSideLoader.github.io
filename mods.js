import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// 🔥 Config Firebase (remplace par la tienne)
const firebaseConfig = {
  apiKey: "AIzaSyDVibu5Mv4R_RGwueA-hRG_7D889FXqWR8",
  authDomain: "futursideloader.firebaseapp.com",
  projectId: "futursideloader",
  storageBucket: "futursideloader.firebasestorage.app",
  messagingSenderId: "426216859785",
  appId: "1:426216859785:web:2e8aca2b6f38a0856ffe58"
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
