import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// ?? Initialisation Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDVibu5Mv4R_RGwueA-hRG_7D889FXqWR8",
    authDomain: "futursideloader.firebaseapp.com",
    projectId: "futursideloader",
    storageBucket: "futursideloader.firebasestorage.app",
    messagingSenderId: "426216859785",
    appId: "1:426216859785:web:2e8aca2b6f38a0856ffe58",
    measurementId: "G-WT4H922PQW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ? Vérification de Firestore
if (!db) {
    console.error("Firestore n'a pas pu être initialisé !");
} else {
    console.log("Firestore initialisé avec succès !");
}

// ?? Variable pour stocker le statut premium
let isPremiumUser = false;

// ??? Vérifier l'état de l'utilisateur et son statut premium
onAuthStateChanged(auth, async (user) => {
    console.log("Checking authentication status...");

    if (!user) {
        console.log("User not logged in. Redirecting...");
        alert("You must be logged in to access mods.");
        window.location.href = "index.html";
        return;
    }

    console.log("User logged in:", user.email);

    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            console.log("User document not found in Firestore.");
            alert("User document not found.");
            window.location.href = "index.html";
            return;
        }

        isPremiumUser = userSnap.data().premium;
        console.log("Premium status:", isPremiumUser);

        if (!isPremiumUser) {
            console.log("User is not premium. Redirecting...");
            alert("You need a premium account to access mods.");
            window.location.href = "index.html";
            return;
        }

        console.log("? User is premium. Loading mods...");
        loadMods();

    } catch (error) {
        console.error("? Error checking premium status:", error);
        alert("An error occurred. Please try again later.");
        window.location.href = "index.html";
    }
});

// ?? Charger les mods depuis le fichier JSON
async function loadMods() {
    console.log("?? Starting loadMods()...");

    try {
        console.log("Fetching mods.json...");
        const response = await fetch("mods.json");

        if (!response.ok) {
            throw new Error("Failed to load mods.json. Status: " + response.status);
        }

        const mods = await response.json();
        console.log("? Mods loaded successfully:", mods);

        // ?? Vérification de l'élément mods-container
        const modsContainer = document.getElementById("mods-container");
        if (!modsContainer) {
            throw new Error("? Element #mods-container not found in the DOM.");
        }

        modsContainer.innerHTML = ""; // Nettoyer avant d'ajouter les mods

        mods.forEach(mod => {
            const modElement = document.createElement("div");
            modElement.classList.add("mod-item");

            if (mod.premium && !isPremiumUser) {
                modElement.innerHTML = `
                    <h2>${mod.name}</h2>
                    <p>${mod.description}</p>
                    <button class="btn" disabled>Premium Access Required</button>
                `;
            } else {
                modElement.innerHTML = `
                    <h2>${mod.name}</h2>
                    <p>${mod.description}</p>
                    <a href="${mod.download}" class="btn">Download</a>
                `;
            }

            modsContainer.appendChild(modElement);
        });

        console.log("? Mods successfully loaded and displayed.");

    } catch (error) {
        console.error("? Error loading mods:", error);
        alert("Failed to load mods. Please try again later.");
    }
}