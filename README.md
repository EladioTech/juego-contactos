# ⚪ CUADERNILLO GRIS

## Manual Técnico y Arquitectura Externa (Firebase y Estructura)

**Proyecto:** Juego-Contactos (Futura Red Social para el Gremio de la Discapacidad)
**Versión:** Prototipo Funcional (Multijugador)
**Fecha:** Octubre 2026
**Desarrollador:** Eladio
**Asistencia Técnica:** L-AURA

---

## 📑 ÍNDICE

1. [Visión General del Proyecto](#1-visión-general-del-proyecto)
2. [Estructura de Archivos](#2-estructura-de-archivos)
3. [El "Cerebro" Externo: Firebase](#3-el-cerebro-externo-firebase)
4. [La Base de Datos en Tiempo Real](#4-la-base-de-datos-en-tiempo-real)
5. [El Flujo del Juego (El viaje del usuario)](#5-el-flujo-del-juego-el-viaje-del-usuario)
6. [El Sistema de Salas y Códigos](#6-el-sistema-de-salas-y-códigos)
7. [Cómo probarlo en local (Live Server)](#7-cómo-probarlo-en-local-live-server)
8. [Próximos pasos (Tareas Pendientes)](#8-próximos-pasos-tareas-pendientes)
9. [Guía de Seguridad (Muy Importante)](#9-guía-de-seguridad-muy-importante)

---

## 1. VISIÓN GENERAL DEL PROYECTO

**Juego-Contactos** es una Web App (aplicación web) de chat en tiempo real diseñada para romper el hielo entre dos personas desconocidas. Aunque empezó como un juego de citas, el objetivo final es ser una red de contacto segura y accesible para personas con discapacidad (el "gremio DIS").

**Tecnologías usadas:**
*   **HTML5 y CSS3:** Para la interfaz visual (los chats, los colores, los botones).
*   **JavaScript Vanilla (Puro):** Para la lógica del juego y del chat. No usamos frameworks pesados como React o Angular para que sea ligero y fácil de mantener.
*   **Firebase (Google):** Para la base de datos en tiempo real y la conexión entre los dos jugadores.

---

## 2. ESTRUCTURA DE ARCHIVOS

El proyecto está dividido de forma modular para que no sea un caos:

```text
juego-contactos/
│
├── index.html       → La estructura de las pantallas (Perfil, Lobby, Chat).
│
├── css/
│   └── style.css    → Todo el diseño (colores, burbujas, animaciones).
│
├── js/
│   ├── story.js     → El guión del "Rompehielos" (las preguntas del bot).
│   ├── engine.js    → El motor. Controla los mensajes, Firebase y las variables.
│   └── main.js      → El arranque. Conecta Firebase y activa los botones.
│
└── assets/          → Imágenes por defecto (ej. avatar.jpg).
3. EL "CEREBRO" EXTERNO: FIREBASE
Para que dos personas puedan hablar en tiempo real sin necesidad de tener un servidor propio, usamos Firebase.

¿Qué es Firebase? Es una plataforma de Google. En nuestro caso, usamos Realtime Database (Base de Datos en Tiempo Real). Funciona como una nube donde guardamos los mensajes y los datos de los jugadores.

¿Cómo se conecta?
En el archivo js/main.js hay un objeto llamado firebaseConfig. Ahí están las llaves de acceso a tu proyecto en Firebase.

API Key: Es la contraseña de tu proyecto.

DatabaseURL: Es la dirección de internet donde se guardan los datos.

(Nota: Si alguien quiere clonar este proyecto, tendrá que crear su propio proyecto en Firebase y cambiar estas claves).

4. LA BASE DE DATOS EN TIEMPO REAL
Cuando creas una sala, en Firebase se crea una estructura de datos (un JSON) que se ve así:

json
salas/
  └── [CODIGO_DE_LA_SALA] (ej. X7F9)/
        ├── estado: "conectado"
        ├── mensajes/
        │     ├── [ID_MENSAJE_1]: { texto: "Hola", autor: "A" }
        │     └── [ID_MENSAJE_2]: { texto: "¿Qué tal?", autor: "B" }
        ├── jugadorA: { alias: "Eladio", foto: "http://..." }
        ├── jugadorB: { alias: "Noelia", foto: "http://..." }
        └── estadoJuego:
              ├── nodo: "pregunta_1"
              └── opciones: ["Opción 1", "Opción 2"]
¿Cómo funciona?

Cuando el Jugador A envía un mensaje, JavaScript hace un push() a la carpeta de mensajes.

El Jugador B tiene un "escuchador" (on('child_added')) que está atento a esa carpeta. En el mismo instante en que el A envía el mensaje, al B le salta la alarma y lo pinta en su pantalla. Por eso es en tiempo real.

5. EL FLUJO DEL JUEGO (El viaje del usuario)
Perfil: El usuario entra, pone su alias, su género (para el color azul o rosa) y el enlace a su foto. Esto se guarda en la memoria del navegador (en el objeto GameEngine).

Lobby: El usuario decide si crear una sala o unirse a una.

Crear Sala: Se genera un código aleatorio (ej. AB12) y se guarda en Firebase. El creador (Jugador A) se queda esperando.

Unirse: El otro jugador (Jugador B) pone el código. El sistema lo conecta a esa sala.

Rompehielos: El motor (engine.js) lee el archivo story.js y le hace preguntas al Jugador A. El Jugador B ve las respuestas en tiempo real.

Chat Libre: Cuando se acaban las preguntas del bot, el sistema oculta los botones y muestra una caja de texto para que ambos puedan hablar libremente.

6. EL SISTEMA DE SALAS Y CÓDIGOS
Para evitar que dos extraños se conecten al azar (lo cual requiere un servidor de emparejamiento muy complejo), usamos el Sistema de Códigos:

El creador genera un código de 4 letras.

Ese código es la "llave" de la sala.

El invitado debe introducirlo para entrar.

Es seguro, privado y no requiere que los dos estén conectados al mismo tiempo (si uno se va, el otro puede volver a entrar con el código).

7. CÓMO PROBARLO EN LOCAL (Live Server)
Para que tú y un amigo podáis probar el juego sin subirlo a internet:

Abre la carpeta del proyecto en Visual Studio Code.

Dale a "Go Live" (Live Server) en la parte inferior derecha.

Se abrirá una pestaña en tu navegador (ej. http://127.0.0.1:5500).

Para probar tú solo, abre una ventana de incógnito (Ctrl + Shift + N) y pega la misma dirección.

En la ventana normal, crea la sala y copia el código.

En la ventana de incógnito, pon el código y únete. ¡Ya puedes chatear contigo mismo!

8. PRÓXIMOS PASOS (TAREAS PENDIENTES)
Este es un prototipo funcional, pero para que sea una App real, faltan cosas:

□ Filtros de Match: Comprobar que si un chico busca chicas, no le empareje con otro chico (Opción C que hablamos).
□ Verificación de Discapacidad: Añadir un sistema para que los usuarios suban su tarjeta y se les verifique (Tick azul).
□ Chat de Voz: Implementar la API de síntesis de voz para personas invidentes (Web Speech API).
□ Subir a Internet: Usar Netlify o Vercel para que la app tenga una URL real y se pueda usar en móviles.
□ Base de datos de usuarios: Actualmente cada sala es aislada. Habría que crear un sistema de "registro" para que las personas tengan su perfil guardado.
9. GUÍA DE SEGURIDAD (MUY IMPORTANTE)
Las claves de Firebase: El archivo main.js contiene tus claves. Es normal en prototipos, pero si subes esto a GitHub, cualquiera podrá verlas.

Las Reglas de Firebase: Ahora mismo la base de datos está en "Modo de Prueba". Esto significa que cualquiera con el enlace puede leer y escribir. Para la versión final, habrá que configurar reglas de seguridad (Security Rules) para que solo los usuarios autenticados puedan escribir.

Datos Sensibles: NUNCA guardes fotos de tarjetas de discapacidad en la base de datos de texto. Para eso usaremos Firebase Storage (o servicios de terceros) y las borraremos tras la verificación.

Última actualización: 22 de Octubre de 2026.
Estado: Cuadernillo completado. El motor y el chat libre funcionan al 100%.