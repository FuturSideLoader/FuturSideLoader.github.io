// Ne pas inclure Firebase ici, on l'a déjà fait dans index.html

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
        window.open(url, '_blank');
    }
}

// Ajoute la fonction downloadGame à window pour qu'elle soit accessible globalement
window.downloadGame = downloadGame;

// Charge les jeux depuis Firestore au chargement de la page
window.onload = loadGames;
