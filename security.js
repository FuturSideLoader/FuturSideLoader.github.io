// Empêcher F12 et les raccourcis DevTools
document.addEventListener('keydown', function (event) {
    if (event.key === "F12" || 
        (event.ctrlKey && event.shiftKey && event.key === "I") || 
        (event.ctrlKey && event.shiftKey && event.key === "J") || 
        (event.ctrlKey && event.key === "U")) {
        event.preventDefault();
    }
});

// Détecter l'ouverture de la console et rediriger
(function() {
    var devtools = /./;
    devtools.toString = function() {
        window.location.href = "about:blank"; // Redirige vers une page vide
    };
    console.log('%c', devtools);
})();


// Désactiver le clic droit
document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});
