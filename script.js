let isPremiumUser = false; // Variable globale pour stocker le statut premium

// Fonction principale pour charger les jeux
async function loadGames() {
    try {
        // Récupérer et stocker le statut premium
        isPremiumUser = await getPremiumStatus();

        // Charger les jeux uniquement après avoir récupéré le statut premium
        const response = await fetch("games.json");
        if (!response.ok) {
            throw new Error("Erreur avec le fichier JSON");
        }

        const games = await response.json();
        const container = document.getElementById("game-container");

        // Vider le conteneur pour éviter les doublons
        container.innerHTML = "";

        // Générer la carte de chaque jeu
        games.forEach(game => {
            const gameCard = document.createElement("div");
            gameCard.classList.add("game-card");

            // Vérifier le statut premium et afficher le bon texte pour le bouton
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
        console.error("Erreur lors du chargement des jeux", error);
    }
}

// Fonction pour récupérer le statut premium depuis le localStorage
async function getPremiumStatus() {
    return new Promise(resolve => {
        const premium = localStorage.getItem("premium") === "true"; // Vérifier si l'utilisateur est premium
        resolve(premium);
    });
}

// Fonction pour télécharger un jeu
function downloadGame(url, isPremiumGame) {
    if (isPremiumGame && !isPremiumUser) {
        alert("You must have a paid plan to download.");
    } else {
        window.location.href = url;
    }
}

// Ajoute la fonction downloadGame à window pour qu'elle soit accessible globalement
window.downloadGame = downloadGame;

// Charge les jeux au chargement de la page
window.onload = loadGames;
