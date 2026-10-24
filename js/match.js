const MatchModule = {
    // 1. Registrarnos en el muro de espera
    entrarAlMuro: function () {
        if (!GameEngine.miIdUnico) {
            GameEngine.miIdUnico = Math.random().toString(36).substring(2, 9);
        }

        const miPerfilRef = window.db.ref('usuarios_conectados/' + GameEngine.miIdUnico);
        miPerfilRef.set({
            alias: GameEngine.miAlias,
            genero: GameEngine.miGenero,
            foto: GameEngine.miFoto,
            busqueda: GameEngine.miBusqueda || "todos"
        });

        miPerfilRef.onDisconnect().remove(); // Si cierro la pestaña, desaparezco del muro

        // Escuchar a los demás usuarios conectados
        window.db.ref('usuarios_conectados').on('value', (snapshot) => {
            const usuarios = snapshot.val();
            const contenedor = document.getElementById('lista-usuarios');
            if (!contenedor) return; // Si no estamos en la pantalla del lobby, no hace nada

            contenedor.innerHTML = '';

            if (usuarios) {
                for (let id in usuarios) {
                    if (id !== GameEngine.miIdUnico) { // No mostrarme a mí mismo
                        const user = usuarios[id];

                        // Filtro de compatibilidad mutua
                        const meGustaAmi = (GameEngine.miBusqueda === "todos" || GameEngine.miBusqueda === user.genero);
                        const leGustoYo = (user.busqueda === "todos" || user.busqueda === GameEngine.miGenero);

                        if (meGustaAmi && leGustoYo) {
                            // Pintamos la tarjeta del usuario
                            const card = document.createElement('div');
                            card.style = "background: #2a2a2a; padding: 20px; border-radius: 15px; text-align: center; cursor: pointer; border: 2px solid transparent; width: 150px; transition: border 0.3s;";
                            card.onmouseover = () => card.style.borderColor = "#ff69b4";
                            card.onmouseout = () => card.style.borderColor = "transparent";

                            card.innerHTML = `
                                <img src="${user.foto}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 10px; border: 2px solid #555;">
                                <h3 style="margin: 0; color: white;">${user.alias}</h3>
                                <p style="margin: 5px 0 0 0; color: #aaa; font-size: 0.8em;">${user.genero}</p>
                            `;

                            card.onclick = () => this.proponerMatch(id, user.alias);
                            contenedor.appendChild(card);
                        }
                    }
                }
            }
        });
    },

    // 2. Enviar la invitación
    proponerMatch: function (idDestino, aliasDestino) {
        if (!confirm(`¿Quieres invitar a ${aliasDestino} a hablar?`)) return;

        const nuevaSala = "SALA-" + Math.random().toString(36).substring(2, 6).toUpperCase();

        // Mandamos la propuesta a la bandeja de entrada del otro
        window.db.ref('propuestas/' + idDestino + '/' + nuevaSala).set({
            de: GameEngine.miAlias,
            deGenero: GameEngine.miGenero,
            deFoto: GameEngine.miFoto,
            salaId: nuevaSala
        });

        document.getElementById('texto-match').innerText = "Esperando a que " + aliasDestino + " acepte...";
        document.getElementById('notificacion-match').style.display = 'block';

        // NUEVO: Eladio se queda escuchando si Noelia acepta la propuesta
        window.db.ref('propuestas/' + idDestino + '/' + nuevaSala).on('value', (snapshot) => {
            if (snapshot.val() === null) {
                // Si el valor se vuelve null, significa que Noelia ha aceptado y ha borrado la propuesta
                window.db.ref('propuestas/' + idDestino + '/' + nuevaSala).off(); // Dejamos de escuchar
                GameEngine.iniciarJuego(nuevaSala, false); // Entramos como Jugador B
            }
        });
    },

    // 3. Escuchar si nos llega una invitación
    escucharPropuestas: function () {
        if (!GameEngine.miIdUnico) return;

        window.db.ref('propuestas/' + GameEngine.miIdUnico).on('child_added', (snapshot) => {
            const propuesta = snapshot.val();
            const salaId = snapshot.key;

            const noti = document.getElementById('notificacion-match');
            if (!noti) return;

            document.getElementById('texto-match').innerText = `¡A ${propuesta.de} le gustaría hablar contigo!`;
            noti.style.display = 'block';

            // Qué pasa si le damos a Aceptar
            document.getElementById('btn-aceptar-match').onclick = () => {
                noti.style.display = 'none';
                window.db.ref('propuestas/' + GameEngine.miIdUnico + '/' + salaId).remove();
                GameEngine.iniciarJuego(salaId, true); // Entramos a la sala
            };
        });
    }
};