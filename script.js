async function loadGames() {
    try {
        const response = await fetch("games.json");
        if (!response.ok) {
            throw new Error("Erreur avec le fichier JSON");
        }

        const games = await response.json();
        const container = document.getElementById("game-container");

        // Assurer que le statut premium est récupéré avant de continuer
        const isPremiumUser = await getPremiumStatusFromLocalStorage();

        games.forEach(game => {
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
        console.error("Erreur lors du chargement des jeux", error);
    }
}

// Fonction pour récupérer le statut premium depuis localStorage (attente)
async function getPremiumStatusFromLocalStorage() {
    return new Promise(resolve => {
        // Attends quelques millisecondes pour être sûr que Firebase a récupéré les données
        setTimeout(() => {
            resolve(localStorage.getItem("premium") === "true");
        }, 500);
    });
}

function downloadGame(url, isPremiumGame) {
    const isPremiumUser = localStorage.getItem("premium") === "true";

    if (isPremiumGame && !isPremiumUser) {
        alert("You must have a paid plan to download.");
    } else {
        window.location.href = url; // Redirige vers le lien de téléchargement
    }
}

// Ajoute la fonction downloadGame à window pour qu'elle soit accessible globalement
window.downloadGame = downloadGame;

// Charge les jeux au chargement de la page
window.onload = loadGames;