import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
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
                const premiumStatus = userData.subscriptionStatus || "Free"; // Remplacer par 'subscriptionStatus' dans Firestore

                // Affichage du statut d'abonnement
                document.getElementById("subscription-status").innerText = premiumStatus;

                // Afficher/Masquer les boutons en fonction du statut
                if (premiumStatus === "Premium") {
                    document.getElementById("pay-for-premium").style.display = "none"; // Masquer si Premium
                } else {
                    document.getElementById("pay-for-premium").style.display = "inline-block"; // Afficher si Free
                }
            }

            // Afficher le bouton logout
            const logoutButton = document.getElementById("logout-btn");
            if (logoutButton) {
                logoutButton.style.display = "inline-block"; // Afficher le bouton logout
                logoutButton.addEventListener("click", logout); // Ajouter l'événement de déconnexion
            }
        } else {
            // L'utilisateur n'est pas connecté
            document.getElementById("email").innerText = "Not logged in";
            document.getElementById("subscription-status").innerText = "N/A";
            document.getElementById("pay-for-premium").style.display = "none"; // Masquer si pas connecté
            document.getElementById("logout-btn").style.display = "none"; // Masquer le bouton logout
        }
    });

    // Attacher le clic pour payer pour Premium ici si nécessaire
    document.getElementById("pay-for-premium").addEventListener("click", payForPremium);

    // Attacher l'événement de redirection "Home"
    document.getElementById("home-btn").addEventListener("click", function() {
        window.location.href = "index.html"; // Redirection vers index.html
    });
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
    window.location.href = "https://buy.stripe.com/8wM4hnc95exIfDO288";
}
