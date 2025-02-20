// Initialise Firebase (assure-toi que Firebase est bien importé dans index.html)
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

// Configuration de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDVibu5Mv4R_RGwueA-hRG_7D889FXqWR8",
    authDomain: "futursideloader.firebaseapp.com",
    projectId: "futursideloader",
    storageBucket: "futursideloader.firebasestorage.app",
    messagingSenderId: "426216859785",
    appId: "1:426216859785:web:2e8aca2b6f38a0856ffe58"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let isPremiumUser = false; // Variable globale pour stocker le statut premium

async function loadGames() {
    try {
        const container = document.getElementById("game-container");
        container.innerHTML = ""; // Vide le conteneur avant d'ajouter les jeux

        isPremiumUser = await getPremiumStatus(); // Vérifie si l'utilisateur est premium

        // Récupérer les jeux depuis Firestore
        const querySnapshot = await getDocs(collection(db, "games"));

        querySnapshot.forEach(doc => {
            const game = doc.data();
            const gameCard = document.createElement("div");
            gameCard.classList.add("game-card");

            const buttonText = game.premium && !isPremiumUser ? "Upgrade to a paid plan to download" : "Download";

            gameCard.innerHTML = `
                <img src="${game.cover}" alt="${game.name} Cover">
                <h2>${game.name}</h2>
                <button onclick="downloadGame('${game.download}', ${game.premium})">
                    ${isPremiumUser && game.premium ? "Download" : buttonText}
                </button>
            `;

            container.appendChild(gameCard);
        });

    } catch (error) {
        console.error("Erreur lors du chargement des jeux depuis Firestore", error);
    }
}

// Fonction pour récupérer le statut premium
async function getPremiumStatus() {
    return new Promise(resolve => {
        const premium = localStorage.getItem("premium") === "true";
        resolve(premium);
    });
}

function downloadGame(url, isPremiumGame) {
    if (isPremiumGame && !isPremiumUser) {
        alert("You must have a paid plan to download.");
    } else {
        window.location.href = url;
    }
}

// Ajoute la fonction downloadGame à window pour qu'elle soit accessible globalement
window.downloadGame = downloadGame;

// Charge les jeux depuis Firestore au chargement de la page
window.onload = loadGames;
