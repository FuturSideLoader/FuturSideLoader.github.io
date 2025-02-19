// Importation explicite des modules Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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
const auth = getAuth(app);
const firestore = getFirestore(app);

// Fonction d'inscription
function signUp(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            const user = userCredential.user;

            // Ajouter l'utilisateur dans Firestore
            return setDoc(doc(firestore, "users", user.uid), {
                email: user.email,
                premium: false // L'utilisateur est non premium par défaut
            });
        })
        .then(() => {
            alert("Compte créé avec succès !");
            window.location.href = "index.html"; // Redirection après inscription
        })
        .catch(error => {
            console.error("Erreur d'inscription:", error.message);
            alert("Erreur: " + error.message);
        });
}

// Fonction de connexion
function login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            window.location.href = "index.html"; // Redirection après connexion
        })
        .catch(error => {
            console.error("Erreur de connexion:", error.message);
            alert("Erreur: " + error.message);
        });
}

// Vérification du statut de l'utilisateur (premium ou non)
onAuthStateChanged(auth, user => {
    console.log("Utilisateur connecté ?", user); // Debug: Vérifie l'état de l'utilisateur
    if (user) {
        console.log("L'utilisateur est connecté");
        enableDownloadButtons(true); // Activer les boutons de téléchargement
    } else {
        console.log("Aucun utilisateur connecté");
        enableDownloadButtons(false); // Désactiver les boutons de téléchargement
    }
});

// Fonction pour activer ou désactiver les boutons de téléchargement
function enableDownloadButtons(isLoggedIn) {
    const downloadButtons = document.querySelectorAll('.download-btn');
    console.log("isLoggedIn: ", isLoggedIn); // Debug : Vérifie l'état de la connexion

    downloadButtons.forEach(button => {
        if (isLoggedIn) {
            button.disabled = false; // Activer le bouton de téléchargement si l'utilisateur est connecté
            button.style.cursor = "pointer"; // Curseur de souris normal
        } else {
            button.disabled = true; // Désactiver le bouton si l'utilisateur n'est pas connecté
            button.style.cursor = "not-allowed"; // Curseur de souris pour indiquer désactivation
        }
    });
}

// Fonction pour vérifier si l'utilisateur est connecté avant un téléchargement
function checkLoginBeforeDownload(event) {
    const user = auth.currentUser;

    if (!user) {
        alert("You must be logged in to download games.");
        window.location.href = "login.html"; // Rediriger vers la page de connexion
    } else {
        const downloadButton = event.target;
        downloadButton.textContent = "Downloading..."; // Afficher "Downloading..."
        downloadButton.disabled = true; // Désactiver le bouton

        // Lancer la fonction de téléchargement
        downloadGame();

        // Réactiver le bouton après un délai
        setTimeout(() => {
            downloadButton.textContent = "Download"; // Réinitialiser le texte du bouton
            downloadButton.disabled = false; // Réactiver le bouton
        }, 3000); // Délai de 3 secondes pour l'exemple
    }
}

// Fonction de téléchargement (exemple de téléchargement)
function downloadGame() {
    console.log("Game downloaded!");
}

// Ajouter un gestionnaire d'événements pour les boutons de téléchargement
document.querySelectorAll('.download-btn').forEach(button => {
    button.addEventListener('click', checkLoginBeforeDownload);
});

// Gestion du formulaire d'inscription et de connexion
document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");

    if (signupForm) {
        signupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            signUp(email, password);
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            login(email, password);
        });
    }
});