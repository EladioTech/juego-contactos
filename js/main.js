// 1. Tus claves de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBP0K5w6uPkeebCW838FL_W7nVe8wFm_h0",
    authDomain: "juego-contactos.firebaseapp.com",
    databaseURL: "https://juego-contactos-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "juego-contactos",
    storageBucket: "juego-contactos.firebasestorage.app",
    messagingSenderId: "1000259187347",
    appId: "1:1000259187347:web:82773247332dceb83bd366"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
window.db = database;

window.onload = () => {
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('lobby-container').style.display = 'none';

    document.getElementById('btn-guardar-perfil').onclick = () => {
        const alias = document.getElementById('input-alias').value;
        const genero = document.getElementById('select-genero').value;
        const foto = document.getElementById('input-foto').value;

        if (alias.trim() === "") { alert("Por favor, escribe un alias."); return; }

        GameEngine.miGenero = genero;
        GameEngine.miAlias = alias;
        GameEngine.miFoto = foto || "assets/avatar.jpg";

        document.getElementById('perfil-container').style.display = 'none';
        document.getElementById('lobby-container').style.display = 'flex';
        GameEngine.initLobby();
    };

    document.getElementById('btn-crear-sala').onclick = () => {
        const codigo = Math.random().toString(36).substring(2, 6).toUpperCase();
        GameEngine.iniciarJuego(codigo, true);
    };

    document.getElementById('btn-unirse-sala').onclick = () => {
        const codigo = document.getElementById('input-codigo').value.toUpperCase();
        if (codigo.length > 2) { GameEngine.iniciarJuego(codigo, false); }
        else { alert("Escribe un código válido."); }
    };

    document.getElementById('btn-enviar-mensaje').onclick = () => { GameEngine.enviarMensajeLibre(); };
    document.getElementById('input-mensaje-libre').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') { GameEngine.enviarMensajeLibre(); }
    });
};