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

window.onload = function() {
    // Vérification de l'utilisateur connecté
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // L'utilisateur est connecté, afficher les infos et le bouton logout
            document.getElementById("email").innerText = user.email;

            // Récupérer le statut de l'abonnement de l'utilisateur depuis Firestore
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const userData = userSnap.data();
                const subscriptionStatus = userData.subscriptionStatus || "Free"; // Si l'abonnement est absent, statut par défaut "Free"
                document.getElementById("subscription-status").innerText = subscriptionStatus;

                // Si l'utilisateur est déjà premium, cacher le bouton "Pay for Premium"
                if (subscriptionStatus === "Premium") {
                    document.getElementById("pay-for-premium").style.display = "none";
                } else {
                    document.getElementById("pay-for-premium").style.display = "inline-block"; // Afficher le bouton Pay for Premium si l'utilisateur n'est pas premium
                }
            } else {
                console.log("Aucune donnée d'abonnement trouvée pour cet utilisateur.");
            }

            document.getElementById("toggle-subscription").style.display = "none"; // Cacher le bouton "Subscribe"
            document.getElementById("logout-btn").style.display = "inline-block"; // Afficher le bouton "Logout"
        } else {
            // L'utilisateur n'est pas connecté, afficher le bouton de connexion
            document.getElementById("email").innerText = "Not logged in";
            document.getElementById("subscription-status").innerText = "N/A";
            document.getElementById("toggle-subscription").style.display = "inline-block"; // Afficher le bouton "Subscribe"
            document.getElementById("logout-btn").style.display = "none"; // Cacher le bouton "Logout"
            document.getElementById("pay-for-premium").style.display = "none"; // Cacher le bouton Pay for Premium si l'utilisateur n'est pas connecté
        }
    });

    // Attacher l'événement de déconnexion après le chargement de la page
    const logoutButton = document.getElementById("logout-btn");
    logoutButton.addEventListener("click", logout);
};

// Fonction pour gérer la déconnexion
function logout() {
    signOut(auth).then(() => {
        // Rediriger vers la page d'accueil après la déconnexion
        window.location.href = "index.html";  // Rediriger l'utilisateur après la déconnexion
    }).catch((error) => {
        console.error("Erreur de déconnexion: ", error);  // Log l'erreur en cas de problème
    });
}

// Fonction pour gérer l'abonnement (exemple)
async function toggleSubscription() {
    const user = auth.currentUser;
    if (user) {
        // Logique d'abonnement (par exemple, passer au plan Premium)
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            subscriptionStatus: "Premium" // Exemple, mettre à jour le statut d'abonnement
        });
        document.getElementById("subscription-status").innerText = "Premium"; // Mettre à jour l'affichage
    }
}

// Fonction pour gérer l'achat du plan Premium
async function payForPremium() {
    const user = auth.currentUser;
    if (user) {
        // Logique pour passer au plan Premium
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            subscriptionStatus: "Premium" // Mise à jour du statut d'abonnement
        });
        document.getElementById("subscription-status").innerText = "Premium"; // Mettre à jour l'affichage
        document.getElementById("pay-for-premium").style.display = "none"; // Cacher le bouton Pay for Premium
    }
}