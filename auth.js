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
                premium: false // L'utilisateur est non premium par d�faut
            });
        })
        .then(() => {
            alert("Compte cr�� avec succ�s !");
            window.location.href = "index.html"; // Redirection apr�s inscription
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
            window.location.href = "index.html"; // Redirection apr�s connexion
        })
        .catch(error => {
            console.error("Erreur de connexion:", error.message);
            alert("Erreur: " + error.message);
        });
}

// V�rification du statut de l'utilisateur (premium ou non)
onAuthStateChanged(auth, user => {
    console.log("Utilisateur connect� ?", user); // Debug: V�rifie l'�tat de l'utilisateur
    if (user) {
        console.log("L'utilisateur est connect�");
        enableDownloadButtons(true); // Activer les boutons de t�l�chargement
    } else {
        console.log("Aucun utilisateur connect�");
        enableDownloadButtons(false); // D�sactiver les boutons de t�l�chargement
    }
});

// Fonction pour activer ou d�sactiver les boutons de t�l�chargement
function enableDownloadButtons(isLoggedIn) {
    const downloadButtons = document.querySelectorAll('.download-btn');
    console.log("isLoggedIn: ", isLoggedIn); // Debug : V�rifie l'�tat de la connexion

    downloadButtons.forEach(button => {
        if (isLoggedIn) {
            button.disabled = false; // Activer le bouton de t�l�chargement si l'utilisateur est connect�
            button.style.cursor = "pointer"; // Curseur de souris normal
        } else {
            button.disabled = true; // D�sactiver le bouton si l'utilisateur n'est pas connect�
            button.style.cursor = "not-allowed"; // Curseur de souris pour indiquer d�sactivation
        }
    });
}

// Fonction pour v�rifier si l'utilisateur est connect� avant un t�l�chargement
function checkLoginBeforeDownload(event) {
    const user = auth.currentUser;

    if (!user) {
        alert("You must be logged in to download games.");
        window.location.href = "login.html"; // Rediriger vers la page de connexion
    } else {
        const downloadButton = event.target;
        downloadButton.textContent = "Downloading..."; // Afficher "Downloading..."
        downloadButton.disabled = true; // D�sactiver le bouton

        // Lancer la fonction de t�l�chargement
        downloadGame();

        // R�activer le bouton apr�s un d�lai
        setTimeout(() => {
            downloadButton.textContent = "Download"; // R�initialiser le texte du bouton
            downloadButton.disabled = false; // R�activer le bouton
        }, 3000); // D�lai de 3 secondes pour l'exemple
    }
}

// Fonction de t�l�chargement (exemple de t�l�chargement)
function downloadGame() {
    console.log("Game downloaded!");
}

// Ajouter un gestionnaire d'�v�nements pour les boutons de t�l�chargement
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