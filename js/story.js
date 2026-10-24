const STORY = {
    // --- FASE 1: El bot pregunta ---
    "inicio": {
        texto: "Hola... ¿estás ahí? Acabo de verte conectado y me ha llamado la atención tu perfil.",
        opciones: [
            { texto: "Sí, aquí estoy. ¿Qué te llamó la atención?", next: "pregunta_1" },
            { texto: "Depende de quién pregunte. ¿Tienes nombre?", next: "pregunta_1" },
            { texto: "Hola. La verdad es que no suelo hablar con desconocidos.", next: "pregunta_1" }
        ]
    },
    
    // --- FASE 2: Pregunta para ambos ---
    "pregunta_1": {
        texto: "Me gusta tu estilo. Vamos a romper el hielo. ¿Cuál es la última cosa que te ha quitado el sueño? (No vale decir 'el trabajo').",
        opciones: [
            { texto: "Un pensamiento. Algo que me gustaría hacer pero no me atrevo.", next: "fin_demo" },
            { texto: "Alguien. Pero no está aquí, así que no cuenta.", next: "fin_demo" },
            { texto: "Una serie. Me quedé hasta las 4 de la mañana.", next: "fin_demo" }
        ]
    },

     "fin_demo": {
        texto: "Interesante... Me gustaría saber más. ¿De dónde eres?",
        opciones: [
            { texto: "Soy de Madrid. ¿Y tú?", next: "chat_libre" },
            { texto: "Prefiero no decirlo aún. ¿Qué te gusta hacer?", next: "chat_libre" }
        ]
    },
    
    // Este nodo será el que active el chat libre
    "chat_libre": {
        texto: "¡Vaya! Genial. Bueno, ya hemos roto el hielo. A partir de aquí, el chat es libre. Escríbeme lo que quieras.",
        opciones: [] // Sin opciones, porque usaremos la caja de texto
    }
};