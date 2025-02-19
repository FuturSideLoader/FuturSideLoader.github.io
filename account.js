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

window.onload = function () {
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

                // Affichage du bouton selon le statut
                if (subscriptionStatus === "Premium") {
                    document.getElementById("pay-for-premium").style.display = "none";
                    document.getElementById("confirm-premium").style.display = "none";
                } else {
                    document.getElementById("pay-for-premium").style.display = "inline-block";
                    document.getElementById("confirm-premium").style.display = "inline-block";
                }
            }
        } else {
            document.getElementById("email").innerText = "Not logged in";
            document.getElementById("subscription-status").innerText = "N/A";
            document.getElementById("pay-for-premium").style.display = "none";
            document.getElementById("confirm-premium").style.display = "none";
        }
    });

    // Attacher l'événement de déconnexion
    document.getElementById("logout-btn").addEventListener("click", logout);
    document.getElementById("pay-for-premium").addEventListener("click", payForPremium);
    document.getElementById("confirm-premium").addEventListener("click", confirmPremium);
};

// Déconnexion
function logout() {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Erreur de déconnexion: ", error);
    });
}

// Redirige vers Stripe
function payForPremium() {
    window.location.href = "https://buy.stripe.com/test_8wMbJP7wn0oB58YaEE";
}

// Confirme le Premium après le paiement
async function confirmPremium() {
    const user = auth.currentUser;
    if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            subscriptionStatus: "Premium"
        });
        document.getElementById("subscription-status").innerText = "Premium";
        document.getElementById("pay-for-premium").style.display = "none";
        document.getElementById("confirm-premium").style.display = "none";
    }
}
