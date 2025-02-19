async function loadPremiumGames() {
    try {
        const response = await fetch("games.json");
        if (!response.ok) {
            throw new Error("Error with the JSON file");
        }

        const games = await response.json();
        const container = document.getElementById("premium-game-container");

        // Filtrer uniquement les jeux premium
        const premiumGames = games.filter(game => game.premium === true);

        premiumGames.forEach(game => {
            const gameCard = document.createElement("div");
            gameCard.classList.add("game-card");

            gameCard.innerHTML = `
                <img src="${game.cover}" alt="${game.name} Cover">
                <h2>${game.name}</h2>
                <button onclick="downloadGame('${game.download}')">Download</button>
            `;

            container.appendChild(gameCard);
        });

    } catch (error) {
        console.error("Error with premium games list", error);
    }
}

function downloadGame(url) {
    window.location.href = url; // Redirige vers le lien de téléchargement
}

// Charge uniquement les jeux premium au chargement de la page
window.onload = loadPremiumGames;