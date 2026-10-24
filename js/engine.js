const GameEngine = {
    currentState: "inicio",
    variables: { confianza: 0, curiosidad: 0, tension: 0, misterio: 0 },
    miGenero: "chico",
    miAlias: "Tú",
    miFoto: "assets/avatar.jpg",
    salaId: null,
    esCreador: false,

    initLobby() {
        if (this.miGenero === "chica") {
            document.documentElement.style.setProperty('--mi-color', '#ff69b4');
        } else {
            document.documentElement.style.setProperty('--mi-color', '#3a7bd5');
        }
    },

    iniciarJuego(codigoSala, soyCreador) {
        this.salaId = codigoSala;
        this.esCreador = soyCreador;

        document.getElementById('lobby-container').style.display = 'none';
        document.getElementById('game-container').style.display = 'flex';
        document.getElementById('estado-sala').innerText = "Sala: " + this.salaId;
        // Ocultar el cartel de match si estaba visible al entrar al chat
        const notiMatch = document.getElementById('notificacion-match');
        if (notiMatch) {
            notiMatch.style.display = 'none';
        }

        // Pintar TUS datos en la cabecera
        document.getElementById('nombre-yo').innerText = this.miAlias;
        document.getElementById('avatar-yo').src = this.miFoto;
        const colorBorde = this.miGenero === "chica" ? "#ff69b4" : "#3a7bd5";
        document.getElementById('avatar-yo').style.borderColor = colorBorde;
        document.getElementById('nombre-yo').style.color = colorBorde;

        if (soyCreador) {
            window.db.ref('salas/' + this.salaId).set({
                estado: "esperando",
                mensajes: [],
                jugadorA: { alias: this.miAlias, foto: this.miFoto },
                jugadorB: null
            });

            // Mostramos el código de la sala en grande
            document.getElementById('estado-sala').innerText = "Código: " + this.salaId;
            document.getElementById('estado-sala').style.color = "#ff9800"; // Naranja para que destaque
            document.getElementById('estado-sala').style.fontWeight = "bold";

            // Vigilar si el Jugador B entra
            window.db.ref('salas/' + this.salaId + '/estado').on('value', (snapshot) => {
                if (snapshot.val() === "conectado") {
                    document.getElementById('estado-sala').innerText = "¡Conectado!";
                    document.getElementById('estado-sala').style.color = "#4CAF50"; // Verde
                }
            });
            // -------------------------------------------

            this.escucharMensajes();
            this.renderizarEstado();
        } else {
            window.db.ref('salas/' + this.salaId + '/estado').set("conectado");
            window.db.ref('salas/' + this.salaId + '/jugadorB').set({
                alias: this.miAlias,
                foto: this.miFoto
            });

            // El jugador B ya está conectado por defecto
            document.getElementById('estado-sala').innerText = "¡Conectado!";
            document.getElementById('estado-sala').style.color = "#4CAF50";

            this.escucharMensajes();
        }
    },

    escucharMensajes() {
        const chatContainer = document.getElementById('chat-container');
        chatContainer.innerHTML = '';

        window.db.ref('salas/' + this.salaId + '/mensajes').on('child_added', (snapshot) => {
            const msg = snapshot.val();
            this.pintarMensaje(msg.texto, msg.autor);
        });

        window.db.ref('salas/' + this.salaId + '/estadoJuego').on('value', (snapshot) => {
            const estado = snapshot.val();
            if (estado) {
                if (estado.nodo === "chat_libre") {
                    document.getElementById('opciones-container').style.display = 'none';
                    document.getElementById('chat-libre-container').style.display = 'block';
                } else if (!this.esCreador) {
                    this.pintarOpciones(estado.opciones, estado.nodo);
                }
            }
        });
    },

    renderizarEstado() {
        const nodo = STORY[this.currentState];
        if (!nodo) return;

        if (nodo.texto) {
            window.db.ref('salas/' + this.salaId + '/mensajes').push({
                texto: nodo.texto,
                autor: "bot"
            });
        }

        if (this.currentState === "chat_libre") {
            if (this.esCreador) {
                window.db.ref('salas/' + this.salaId + '/estadoJuego').set({ nodo: "chat_libre", opciones: [] });
            }
            document.getElementById('opciones-container').style.display = 'none';
            document.getElementById('chat-libre-container').style.display = 'block';
        } else {
            this.pintarOpciones(nodo.opciones.map(o => o.texto), this.currentState);
            if (this.esCreador) {
                window.db.ref('salas/' + this.salaId + '/estadoJuego').set({
                    nodo: this.currentState,
                    opciones: nodo.opciones.map(o => o.texto)
                });
            }
        }
    },

    pintarOpciones(opcionesTexto, nodoActual) {
        const opcionesContainer = document.getElementById('opciones-container');
        opcionesContainer.innerHTML = '';
        if (!opcionesTexto || opcionesTexto.length === 0) return;

        opcionesTexto.forEach((texto, index) => {
            const btn = document.createElement('button');
            btn.className = 'opcion-btn';
            btn.innerText = texto;
            btn.onclick = () => {
                const miId = this.esCreador ? "A" : "B";
                window.db.ref('salas/' + this.salaId + '/mensajes').push({ texto: texto, autor: miId });
                opcionesContainer.innerHTML = '';
                if (this.esCreador) {
                    const opcionReal = STORY[nodoActual].opciones[index];
                    this.enviarMensaje(opcionReal.texto, opcionReal.next);
                }
            };
            opcionesContainer.appendChild(btn);
        });
    },

    enviarMensaje(texto, siguienteEstado) {
        this.currentState = siguienteEstado;
        document.getElementById('opciones-container').innerHTML = `
            <div class="escribiendo"><span></span><span></span><span></span></div>
        `;
        setTimeout(() => { this.renderizarEstado(); }, 1500);
    },

    pintarMensaje(texto, autor) {
        const chatContainer = document.getElementById('chat-container');
        const ultimoMsg = chatContainer.lastElementChild;
        if (ultimoMsg && ultimoMsg.innerText === texto) return;

        const msgDiv = document.createElement('div');
        const soyYo = (this.esCreador && autor === "A") || (!this.esCreador && autor === "B");
        msgDiv.className = soyYo ? 'mensaje yo' : 'mensaje otro';
        msgDiv.innerText = texto;
        chatContainer.appendChild(msgDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    },

    enviarMensajeLibre() {
        const input = document.getElementById('input-mensaje-libre');
        const texto = input.value.trim();
        if (texto === "") return;
        const miId = this.esCreador ? "A" : "B";
        window.db.ref('salas/' + this.salaId + '/mensajes').push({ texto: texto, autor: miId });
        input.value = "";
    },
};