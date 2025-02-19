import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDVibu5Mv4R_RGwueA-hRG_7D889FXqWR8",
    authDomain: "futursideloader.firebaseapp.com",
    projectId: "futursideloader",
    storageBucket: "futursideloader.firebasestorage.app",
    messagingSenderId: "426216859785",
    appId: "1:426216859785:web:2e8aca2b6f38a0856ffe58"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Attendre que le DOM soit complètement chargé avant d'exécuter le code
document.addEventListener("DOMContentLoaded", function () {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            document.getElementById("email").innerText = user.email;

            // Récupérer le statut de l'utilisateur
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                const subscriptionStatus = userData.subscriptionStatus || "Free";
                document.getElementById("subscription-status").innerText = subscriptionStatus;

                // Affichage du bouton en fonction du statut d'abonnement
                const payForPremiumBtn = document.getElementById("pay-for-premium");
                const confirmPremiumBtn = document.getElementById("confirm-premium");

                if (payForPremiumBtn && confirmPremiumBtn) {
                    if (subscriptionStatus === "Premium") {
                        payForPremiumBtn.style.display = "none";
                        confirmPremiumBtn.style.display = "none";
                    } else {
                        payForPremiumBtn.style.display = "inline-block";
                        confirmPremiumBtn.style.display = "inline-block";
                    }
                } else {
                    console.log("Les boutons 'pay-for-premium' ou 'confirm-premium' sont manquants dans le DOM");
                }
            }

            // Vérifier si le bouton "Logout" existe avant de manipuler son style
            const logoutButton = document.getElementById("logout-btn");
            if (logoutButton) {
                logoutButton.style.display = "inline-block"; // S'assurer qu'il est visible
                logoutButton.addEventListener("click", logout); // Ajouter l'événement de déconnexion
            } else {
                console.log("Le bouton Logout n'existe pas dans le DOM");
            }
        } else {
            // L'utilisateur n'est pas connecté
            document.getElementById("email").innerText = "Not logged in";
            document.getElementById("subscription-status").innerText = "N/A";

            const payForPremiumBtn = document.getElementById("pay-for-premium");
            const confirmPremiumBtn = document.getElementById("confirm-premium");

            // S'assurer que les boutons existent avant de les manipuler
            if (payForPremiumBtn && confirmPremiumBtn) {
                payForPremiumBtn.style.display = "none";
                confirmPremiumBtn.style.display = "none";
            }

            // Cacher le bouton "Logout"
            const logoutButton = document.getElementById("logout-btn");
            if (logoutButton) {
                logoutButton.style.display = "none"; // Cacher le bouton logout si l'utilisateur est déconnecté
            }
        }
    });

    // Attacher le clic pour payer pour Premium ici si nécessaire
    const payForPremiumBtn = document.getElementById("pay-for-premium");
    if (payForPremiumBtn) {
        payForPremiumBtn.addEventListener("click", payForPremium);
    }

    const confirmPremiumBtn = document.getElementById("confirm-premium");
    if (confirmPremiumBtn) {
        confirmPremiumBtn.addEventListener("click", confirmPremium);
    }
});

// Fonction de déconnexion
function logout() {
    signOut(auth).then(() => {
        window.location.href = "index.html"; // Rediriger vers la page d'accueil après la déconnexion
    }).catch((error) => {
        console.error("Erreur de déconnexion: ", error); // Log de l'erreur en cas de problème
    });
}

// Redirige vers Stripe pour le paiement
function payForPremium() {
    const successUrl = "https://futursideloader.github.io/success.html";
    const cancelUrl = "https://futursideloader.github.io/cancel.html";
    window.location.href = "https://buy.stripe.com/test_8wMbJP7wn0oB58YaEE";
}

// Fonction pour confirmer l'abonnement Premium (si nécessaire)
function confirmPremium() {
    // Actions à réaliser pour confirmer le statut Premium
    console.log("Abonnement Premium confirmé");
}
