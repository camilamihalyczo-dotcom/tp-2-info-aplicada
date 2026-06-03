// ============================================================
//  AVENTURA GRÁFICA — Inspirada en Ratatouille
//  Informática Aplicada — 2026
//
//  MAPA DE ESCENAS:
//    0  → Pantalla de inicio
//    1  → Alcantarillas
//    2  → Mercado (con diálogo obligatorio con la rata)
//    3  → Exterior del restaurante
//    4  → Cocina (ayudar o ignorar a Linguini)
//    5  → Reinicio (atrapado)
//    6  → Alianza con Linguini
//    7  → Preparación del plato (drag & drop)
//    8  → Anton Ego prueba el plato
//    9  → Final Bueno
//    10 → Final Neutro
//    11 → Final Malo
//    12 → Créditos
//
//  REGLAS PARA MODIFICAR EL CÓDIGO:
//    - Los textos de cada escena están en el objeto ESCENAS (abajo).
//    - Para cambiar a qué escena va cada botón, buscar el objeto NAV.
//    - Para agregar imágenes, ver el bloque "CÓMO CARGAR IMÁGENES" al final.
//    - Buscar 👉 para encontrar los lugares donde agregar cosas.
// ============================================================


// ============================================================
//  ESTADO GLOBAL — la variable más importante
//
//  "escenaActual" decide qué pantalla se muestra.
//  Cambiar este número = cambiar de pantalla.
//  Siempre usar irAEscena() para cambiar, no cambiar directo.
// ============================================================
let escenaActual = 0;


// ============================================================
//  TEXTOS DE CADA ESCENA
//
//  👉 Editen solo los campos "titulo" y "texto" de cada escena.
//     No cambien los números (son los IDs de cada escena).
// ============================================================
const ESCENAS = {
  0:  { titulo: "Remy: el sueño de cocinar",
        texto:  "Una pequeña rata sueña con convertirse en chef..." },
  1:  { titulo: "Las alcantarillas de París",
        texto:  "Remy siempre sintió una fascinación especial por la cocina.\nHoy, un aroma irresistible llega desde la ciudad..." },
  2:  { titulo: "El mercado",
        texto:  "Puestos coloridos, frutas exóticas y aromas increíbles.\nRemy explora... y nota que alguien lo observa." },
  3:  { titulo: "Exterior del restaurante",
        texto:  "Frente a él, el restaurante de Gusteau. Elegante, imponente.\n¿Cómo va a entrar una rata?" },
  4:  { titulo: "La cocina",
        texto:  "El cocinero Linguini está en problemas.\nRemy lo observa desde las sombras... ¿lo ayuda?" },
  5:  { titulo: "¡Descubierto!",
        texto:  "Los cocineros vieron a Remy. El caos se desató.\nParece que todavía no era el momento..." },
  6:  { titulo: "La alianza secreta",
        texto:  "Juntos forman un equipo inesperado.\nLinguini cocina. Remy, escondido bajo su gorro, lo guía." },
  7:  { titulo: "Preparación del plato",
        texto:  "Arrastrá los ingredientes al bowl. Necesitás al menos 3.\nCuando estés listo, presioná SERVIR PLATO." },
  8:  { titulo: "Anton Ego lo prueba...",
        texto:  "Anton Ego observa cuidadosamente la preparación.\nParece estar evaluando cada detalle..." },
  9:  { titulo: "¡Éxito en París!",
        texto:  "La creatividad de Remy conquistó París.\nAnton Ego quedó impresionado. El restaurante alcanzó el éxito." },
  10: { titulo: "Un buen comienzo",
        texto:  "Remy siguió la receta clásica de Gusteau.\nAnton Ego consideró el plato correcto y bien preparado." },
  11: { titulo: "El plato fue rechazado",
        texto:  "La sal arruinó el postre. Anton Ego lo rechazó.\nNo todas las recetas terminan bien..." },
  12: { titulo: "Créditos", texto: "" }
};


// ============================================================
//  SISTEMA DE DIÁLOGO — escena del mercado
//
//  Funciona con un array de frases y un índice que avanza
//  cada vez que el jugador hace clic en "Continuar".
//  Cuando se termina el array, habloConRata pasa a true
//  y se habilita el botón para avanzar.
// ============================================================

// Frases que dice la rata del mercado, una por una
// 👉 Pueden editar estas frases con su historia
const FRASES_RATA = [
  "¿Eres Remy, verdad?",
  "He oído hablar de una rata que sueña con cocinar.",
  "Si realmente querés demostrar tu talento,",
  "deberías visitar el restaurante de Gusteau.",
  "Hay un joven cocinero llamado Linguini.",
  "Dicen que necesita ayuda.",
  "Quizás allí encuentres tu oportunidad."
];

let dialogoVisible  = false; // ¿se está mostrando la ventana de diálogo?
let fraseActual     = 0;     // índice de la frase actual
let habloConRata    = false; // ¿ya terminó la conversación?
let remyPausado     = false; // mientras hay diálogo, Remy no se mueve


// ============================================================
//  INGREDIENTES — escena 7 (drag & drop)
//
//  Cada ingrediente es un objeto con:
//    nombre:     clave interna, usada en evaluarReceta()
//    etiqueta:   texto visible para el jugador
//    x, y:       posición actual en pantalla
//    xInicial, yInicial: posición de origen (para resetear)
//    color:      color del círculo placeholder
//    enBowl:     true cuando fue soltado adentro del bowl
//
//  👉 Para agregar imágenes: buscar "👉 imagen ingrediente" abajo
// ============================================================
let ingredientes = [];

// Posiciones iniciales de cada ingrediente en la mesa
const POS_INGREDIENTES = [
  { x: 60,  y: 155 },
  { x: 140, y: 155 },
  { x: 220, y: 155 },
  { x: 300, y: 155 },
  { x: 380, y: 155 }
];

function resetearIngredientes() {
  ingredientes = [
    { nombre: "frutilla",  etiqueta: "Frutilla",  xInicial: 60,  yInicial: 155, x: 60,  y: 155, color: [220, 60,  80],  enBowl: false },
    { nombre: "chocolate", etiqueta: "Chocolate", xInicial: 140, yInicial: 155, x: 140, y: 155, color: [100, 55,  30],  enBowl: false },
    { nombre: "crema",     etiqueta: "Crema",     xInicial: 220, yInicial: 155, x: 220, y: 155, color: [245, 235, 200], enBowl: false },
    { nombre: "menta",     etiqueta: "Menta ✨",  xInicial: 300, yInicial: 155, x: 300, y: 155, color: [50,  180, 90],  enBowl: false },
    { nombre: "sal",       etiqueta: "Sal ⚠",     xInicial: 380, yInicial: 155, x: 380, y: 155, color: [200, 200, 220], enBowl: false }
  ];
  ingredientesEnBowl = []; // también vaciamos la lista del bowl
}

// El bowl — zona donde se sueltan los ingredientes
const BOWL = { x: 490, y: 140, radio: 52 };

// Array con los NOMBRES de los ingredientes que están en el bowl.
// Se usa en evaluarReceta(). Solo contiene strings como "frutilla", "sal", etc.
let ingredientesEnBowl = [];

// Ingrediente que se está arrastrando ahora mismo
let ingredienteActivo = null;
let offsetArrastre    = { x: 0, y: 0 };


// ============================================================
//  VARIABLES GENERALES
// ============================================================
let botones      = [];  // botones visibles en la escena actual
let botonHover   = -1;  // índice del botón que tiene el mouse encima

// Transición (fundido a negro entre escenas)
let enTransicion      = false;
let alphaTransicion   = 0;
let destinoTransicion = 0;

// Animación de título en pantalla de inicio
let contadorParpadeo = 0;

// Posición de Remy en escenas con movimiento
let remyX = 300;
let remyDir = 1;        // dirección: 1 = derecha, -1 = izquierda
let remyMoviendo = false;

// Temporizador para la escena de Anton Ego
let timerAntonEgo = 0;
const ESPERA_ANTON = 180; // ~3 segundos a 60fps


// ============================================================
//  SETUP — se ejecuta una sola vez al arrancar
// ============================================================
function setup() {
  createCanvas(600, 400);
  textFont("monospace");
  resetearIngredientes();
  generarBotones();
}


// ============================================================
//  DRAW — loop principal, ~60 veces por segundo
//
//  Miramos "escenaActual" y llamamos a la función
//  de dibujo correspondiente.
// ============================================================
function draw() {
  background(20, 18, 28);
  actualizarHover();

  // Seleccionamos qué pantalla dibujar
  if      (escenaActual === 0)  dibujarInicio();
  else if (escenaActual === 2)  dibujarMercado();
  else if (escenaActual === 7)  dibujarCocina();
  else if (escenaActual === 8)  dibujarAntonEgo();
  else if (escenaActual === 12) dibujarCreditos();
  else                          dibujarEscenaEstandar(escenaActual);

  // Los botones van siempre encima (excepto escenas 7 y 8)
  if (escenaActual !== 7 && escenaActual !== 8) {
    dibujarBotones();
  }

  // El diálogo va encima de absolutamente todo
  if (dialogoVisible) dibujarDialogo();

  // El fundido de transición va último, tapa todo
  if (enTransicion) manejarTransicion();
}


// ====================================================================
//  ESCENA 0 — INICIO
// ====================================================================
function dibujarInicio() {
  // 👉 Reemplazar fondo por: image(imgPortada, 0, 0, 600, 400)
  dibujarFondoNocturno();

  contadorParpadeo += 0.04;
  let brillo = map(sin(contadorParpadeo), -1, 1, 170, 255);
  textAlign(CENTER, CENTER);
  textSize(28);
  textStyle(BOLD);
  fill(255, 200, brillo);
  text("RATATOUILLE", width / 2, 90);
  textStyle(NORMAL);
  textSize(13);
  fill(180, 160, 200);
  text("La aventura de Remy", width / 2, 122);

  // Placeholder imagen de portada
  // 👉 Reemplazar por: image(imgPortada, 150, 145, 300, 160)
  fill(30, 28, 50);
  noStroke();
  rect(150, 145, 300, 160, 6);
  fill(60, 55, 90);
  textSize(11);
  textAlign(CENTER, CENTER);
  text("[ imagen de portada ]", 300, 215);
  dibujarRemy(300, 270);
}


// ====================================================================
//  ESCENA ESTÁNDAR — escenas 1, 3, 4, 5, 6, 9, 10, 11
//
//  Zona superior (y 0-222): imagen de fondo + personaje
//  Zona inferior (y 222-400): texto narrativo + botones
// ====================================================================
function dibujarEscenaEstandar(id) {
  // Zona superior
  fill(25, 22, 40);
  noStroke();
  rect(0, 0, width, 222);

  // 👉 Reemplazar por: image(imgFondos[id], 0, 0, 600, 222)
  noFill();
  stroke(55, 50, 85);
  strokeWeight(1);
  rect(8, 8, width - 16, 206, 5);
  noStroke();
  fill(50, 45, 75);
  textAlign(CENTER, CENTER);
  textSize(11);
  text("[ fondo escena " + id + " ]", width / 2, 30);

  dibujarFondoColor(id);

  // 👉 Reemplazar por: image(imgRemy, remyX - 20, 140, 40, 60)
  dibujarRemy(remyX, 185);

  // Zona inferior
  fill(22, 20, 38);
  noStroke();
  rect(0, 222, width, 178);
  stroke(55, 50, 90);
  strokeWeight(1);
  line(0, 223, width, 223);
  noStroke();

  fill(70, 65, 100);
  textSize(10);
  textAlign(LEFT, TOP);
  text("escena " + id, 14, 229);

  fill(255, 210, 80);
  textSize(15);
  textAlign(LEFT, TOP);
  text(ESCENAS[id].titulo.toUpperCase(), 14, 244);

  // 👉 El texto narrativo se edita en el objeto ESCENAS arriba
  fill(185, 190, 220);
  textSize(11);
  textLeading(17);
  textAlign(LEFT, TOP);
  text(ESCENAS[id].texto, 14, 268);
}


// ====================================================================
//  ESCENA 2 — MERCADO
//
//  Igual a la escena estándar pero con:
//    - Remy que se mueve solo de lado a lado
//    - La rata NPC que el jugador debe clickear para hablar
//    - El botón "Buscar a Linguini" aparece SOLO después del diálogo
// ====================================================================
function dibujarMercado() {
  // Zona superior (igual que escena estándar)
  fill(25, 22, 40);
  noStroke();
  rect(0, 0, width, 222);

  // 👉 Reemplazar por: image(imgFondos[2], 0, 0, 600, 222)
  noFill();
  stroke(55, 50, 85);
  strokeWeight(1);
  rect(8, 8, width - 16, 206, 5);
  noStroke();
  dibujarFondoColor(2);

  // Mover a Remy de lado a lado (solo si no hay diálogo activo)
  if (!remyPausado) {
    remyX += remyDir * 1.2;
    if (remyX > 420) remyDir = -1;
    if (remyX < 80)  remyDir = 1;
  }

  // 👉 Reemplazar por: image(imgRemy, remyX - 20, 140, 40, 60)
  dibujarRemy(remyX, 185);

  // Rata NPC — se puede clickear para hablar
  dibujarRataMercado();

  // Indicador visual: si no habló, muestra un indicador sobre la rata
  if (!habloConRata) {
    fill(255, 220, 50);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14);
    text("!", 490, 148);
  }

  // Zona inferior
  fill(22, 20, 38);
  noStroke();
  rect(0, 222, width, 178);
  stroke(55, 50, 90);
  strokeWeight(1);
  line(0, 223, width, 223);
  noStroke();

  fill(70, 65, 100);
  textSize(10);
  textAlign(LEFT, TOP);
  text("escena 2", 14, 229);

  fill(255, 210, 80);
  textSize(15);
  textAlign(LEFT, TOP);
  text(ESCENAS[2].titulo.toUpperCase(), 14, 244);

  fill(185, 190, 220);
  textSize(11);
  textLeading(17);
  textAlign(LEFT, TOP);

  // El texto cambia según si ya habló o no
  if (!habloConRata) {
    text("Remy explora el mercado...\nHay una rata que parece querer decirle algo. ¡Hacé clic en ella!", 14, 268);
  } else {
    text(ESCENAS[2].texto, 14, 268);
  }
}


// ====================================================================
//  ESCENA 7 — COCINA (drag & drop)
//
//  El jugador arrastra ingredientes al bowl.
//  No puede servir el plato con menos de 3 ingredientes.
//  La receta visible le da pistas al jugador.
// ====================================================================
function dibujarCocina() {
  // Fondo de cocina
  // 👉 Reemplazar por: image(imgCocina, 0, 0, 600, 400)
  fill(40, 30, 20);
  noStroke();
  rect(0, 0, width, 400);
  fill(55, 42, 28);
  rect(0, 0, width, 28);
  fill(35, 25, 15);
  rect(0, 192, width, 14);

  // Título
  fill(255, 210, 80);
  textAlign(LEFT, TOP);
  textSize(13);
  text(ESCENAS[7].titulo.toUpperCase(), 14, 6);

  // Instrucción dinámica: indica cuántos ingredientes faltan
  let cantEnBowl = ingredientesEnBowl.length;
  fill(185, 190, 220);
  textSize(9);
  textAlign(LEFT, TOP);
  if (cantEnBowl < 3) {
    fill(255, 180, 80);
    text("Necesitás al menos " + (3 - cantEnBowl) + " ingrediente(s) más para poder servir.", 14, 207);
  } else {
    fill(130, 220, 130);
    text("¡Listo! Ya podés servir el plato.", 14, 207);
  }

  // ---- RECETA VISIBLE (tarjeta en la esquina) ----
  // Es el Objetivo 3 del documento: una tarjeta permanente con la receta
  dibujarTarjetaReceta();

  // ---- EL BOWL ----
  // 👉 Reemplazar por: image(imgBowl, BOWL.x - 55, BOWL.y - 55, 110, 110)
  fill(240, 230, 200);
  noStroke();
  ellipse(BOWL.x, BOWL.y, BOWL.radio * 2, BOWL.radio * 1.3);
  fill(220, 210, 175);
  ellipse(BOWL.x, BOWL.y - 6, BOWL.radio * 1.7, BOWL.radio * 1.0);
  fill(150, 130, 100);
  textAlign(CENTER, CENTER);
  textSize(10);
  text("bowl", BOWL.x, BOWL.y + 42);

  // Ingredientes dentro del bowl (lista visual)
  textSize(9);
  fill(70, 50, 30);
  for (let i = 0; i < ingredientesEnBowl.length; i++) {
    text("✓ " + ingredientesEnBowl[i], BOWL.x, BOWL.y - 18 + i * 12);
  }

  // ---- INGREDIENTES DISPONIBLES ----
  for (let ing of ingredientes) {
    if (!ing.enBowl) {
      // Sombra
      fill(0, 0, 0, 60);
      noStroke();
      ellipse(ing.x + 2, ing.y + 2, 48, 48);
      // Círculo de color
      // 👉 imagen ingrediente: image(imgIng[ing.nombre], ing.x-24, ing.y-24, 48, 48)
      fill(ing.color[0], ing.color[1], ing.color[2]);
      stroke(255, 255, 255, 80);
      strokeWeight(1);
      ellipse(ing.x, ing.y, 48, 48);
      // Etiqueta
      noStroke();
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(9);
      text(ing.etiqueta, ing.x, ing.y + 34);
    }
  }

  // ---- BOTÓN SERVIR PLATO ----
  // Solo se activa si hay 3 o más ingredientes en el bowl
  let puedeServir = (cantEnBowl >= 3);
  let bx = 160, by = 355, bw = 240, bh = 32;
  let hServir = mouseX > bx && mouseX < bx + bw && mouseY > by && mouseY < by + bh;

  // Color distinto según esté habilitado o no
  if (!puedeServir) {
    fill(60, 50, 40); // apagado
    stroke(90, 80, 60, 80);
  } else if (hServir) {
    fill(200, 130, 30);
    stroke(255, 200, 100, 80);
  } else {
    fill(160, 95, 20);
    stroke(255, 200, 100, 80);
  }
  strokeWeight(1);
  rect(bx, by, bw, bh, 6);
  fill(puedeServir ? color(255, 230, 150) : color(110, 100, 80));
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  text("SERVIR PLATO", bx + bw / 2, by + bh / 2);
  textStyle(NORMAL);
  if (hServir && puedeServir) cursor(HAND); else cursor(ARROW);

  // ---- BOTÓN LIMPIAR BOWL ----
  let rx = 420, ry = 355, rw = 150, rh = 32;
  let hReset = mouseX > rx && mouseX < rx + rw && mouseY > ry && mouseY < ry + rh;
  if (hReset) fill(100, 40, 40); else fill(70, 30, 30);
  stroke(200, 80, 80, 60);
  strokeWeight(1);
  rect(rx, ry, rw, rh, 6);
  fill(220, 120, 120);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(11);
  text("Limpiar bowl", rx + rw / 2, ry + rh / 2);
  if (hReset) cursor(HAND);
}


// ====================================================================
//  TARJETA DE RECETA — aparece siempre en la escena de cocina
//
//  Objetivo 3 del documento: el jugador siempre puede ver
//  cuáles son los ingredientes de la receta de Gusteau.
//  La menta no está listada porque es el ingrediente secreto.
// ====================================================================
function dibujarTarjetaReceta() {
  let tx = 10, ty = 32, tw = 115, th = 108;

  // Sombra de la tarjeta
  fill(0, 0, 0, 60);
  noStroke();
  rect(tx + 3, ty + 3, tw, th, 5);

  // Fondo papel (color crema envejecida)
  fill(245, 235, 195);
  stroke(200, 180, 120);
  strokeWeight(1);
  rect(tx, ty, tw, th, 5);

  // Título de la tarjeta
  fill(100, 70, 30);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(8);
  textStyle(BOLD);
  text("RECETA DE GUSTEAU", tx + tw / 2, ty + 7);
  textStyle(NORMAL);

  // Línea divisoria
  stroke(190, 165, 110);
  strokeWeight(0.5);
  line(tx + 8, ty + 20, tx + tw - 8, ty + 20);
  noStroke();

  // Ingredientes de la receta base (la menta es el secreto, no aparece)
  fill(80, 55, 25);
  textAlign(LEFT, TOP);
  textSize(9);
  text("✓ Frutilla",   tx + 10, ty + 26);
  text("✓ Chocolate",  tx + 10, ty + 41);
  text("✓ Crema",      tx + 10, ty + 56);

  // Nota al pie de la tarjeta
  fill(140, 110, 60);
  textSize(7.5);
  textAlign(CENTER, TOP);
  text("¿Habrá un ingrediente\nsecreto que la mejore?", tx + tw / 2, ty + 76);
}


// ====================================================================
//  ESCENA 8 — ANTON EGO (automática, sin botones)
//
//  Espera ~3 segundos y salta sola al final que corresponda
//  según lo que quedó en el bowl.
// ====================================================================
function dibujarAntonEgo() {
  // 👉 Reemplazar por: image(imgAntonEgo, 0, 0, 600, 400)
  background(15, 12, 20);

  fill(30, 25, 40);
  noStroke();
  rect(200, 50, 200, 210, 8);
  fill(55, 50, 75);
  textAlign(CENTER, CENTER);
  textSize(11);
  text("[ imagen Anton Ego ]", 300, 155);

  fill(200, 190, 210);
  textSize(14);
  textAlign(CENTER, CENTER);
  text(ESCENAS[8].titulo, width / 2, 285);
  fill(150, 140, 165);
  textSize(11);
  text(ESCENAS[8].texto, width / 2, 312);

  // Barra de suspenso
  let progreso = map(timerAntonEgo, 0, ESPERA_ANTON, 0, 340);
  fill(40, 35, 55);
  noStroke();
  rect(130, 345, 340, 8, 4);
  fill(200, 170, 80);
  rect(130, 345, progreso, 8, 4);

  timerAntonEgo++;
  if (timerAntonEgo >= ESPERA_ANTON) {
    timerAntonEgo = 0;
    irAEscena(evaluarReceta()); // Evaluamos la receta y saltamos al final
  }
}


// ====================================================================
//  CRÉDITOS — escena 12
// ====================================================================
function dibujarCreditos() {
  // 👉 Reemplazar por: image(imgCreditos, 0, 0, 600, 400)
  dibujarFondoNocturno();

  fill(255, 210, 80);
  textAlign(CENTER, CENTER);
  textSize(20);
  textStyle(BOLD);
  text("CRÉDITOS", width / 2, 60);
  textStyle(NORMAL);

  fill(185, 190, 220);
  textSize(13);
  textLeading(22);

  // 👉 Editar con los nombres reales del grupo
  text(
    "Aventura Gráfica — Inspirada en Ratatouille\n\n" +
    "Autores:\n" +
    "Ana Robledo\n" +
    "Álvaro\n" +
    "Camila Mihalyczo\n\n" +
    "Materia: Informática Aplicada\n" +
    "Año: 2026",
    width / 2, 215
  );
}


// ====================================================================
//  DIÁLOGO DE LA RATA — se dibuja encima de todo (escena 2)
//
//  Muestra una ventana emergente con las frases de la rata.
//  El jugador hace clic en "Continuar" para avanzar frase a frase.
//  Al terminar: habloConRata = true → se habilita el botón de avanzar.
// ====================================================================
function dibujarDialogo() {
  // Fondo semitransparente que oscurece la escena (efecto modal)
  fill(0, 0, 0, 160);
  noStroke();
  rect(0, 0, width, height);

  // Ventana del diálogo
  let dx = 60, dy = 90, dw = 480, dh = 160;
  fill(30, 28, 50);
  stroke(150, 130, 200);
  strokeWeight(1.5);
  rect(dx, dy, dw, dh, 8);

  // Nombre del personaje que habla
  fill(255, 200, 80);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(11);
  textStyle(BOLD);
  text("Rata del mercado:", dx + 16, dy + 14);
  textStyle(NORMAL);

  // Texto de la frase actual
  fill(210, 215, 240);
  textSize(13);
  textLeading(20);
  textAlign(LEFT, TOP);
  text('"' + FRASES_RATA[fraseActual] + '"', dx + 16, dy + 34);

  // Indicador de progreso (frase X de Y)
  fill(100, 95, 130);
  textSize(9);
  textAlign(LEFT, BOTTOM);
  text((fraseActual + 1) + " / " + FRASES_RATA.length, dx + 16, dy + dh - 10);

  // Botón "Continuar"
  let bx = dx + dw - 130, by = dy + dh - 38, bw = 114, bh = 26;
  let hBtn = mouseX > bx && mouseX < bx + bw && mouseY > by && mouseY < by + bh;
  if (hBtn) fill(90, 150, 255); else fill(60, 110, 210);
  stroke(150, 180, 255, 80);
  strokeWeight(1);
  rect(bx, by, bw, bh, 5);
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(11);
  textStyle(BOLD);

  // En la última frase dice "Entendido" en vez de "Continuar"
  let esUltima = (fraseActual === FRASES_RATA.length - 1);
  text(esUltima ? "Entendido" : "Continuar →", bx + bw / 2, by + bh / 2);
  textStyle(NORMAL);
  if (hBtn) cursor(HAND); else cursor(ARROW);
}


// ====================================================================
//  EVALUACIÓN DE LA RECETA — Objetivo 1 y 2 del documento
//
//  Esta es la función central que decide qué final se muestra.
//  Lee los nombres del array ingredientesEnBowl y devuelve
//  el número de escena del final correspondiente.
//
//  PRIORIDADES (en orden):
//    1. Si hay sal → Final Malo (siempre, sin excepción)
//    2. Si tiene frutilla + chocolate + crema + menta → Final Bueno
//    3. Cualquier otro caso con >= 3 ingredientes → Final Neutro
// ====================================================================
function evaluarReceta() {
  // Creamos un Set con los nombres del bowl para buscar sin errores
  // (evita duplicados y hace la búsqueda más confiable)
  let enBowl = new Set(ingredientesEnBowl);

  // PRIORIDAD 1: sal arruina todo
  if (enBowl.has("sal")) {
    return 11; // Final Malo
  }

  // PRIORIDAD 2: receta completa con el toque creativo (menta)
  if (enBowl.has("frutilla") && enBowl.has("chocolate") &&
      enBowl.has("crema")    && enBowl.has("menta")) {
    return 9; // Final Bueno
  }

  // PRIORIDAD 3: cualquier otra combinación válida
  return 10; // Final Neutro
}


// ====================================================================
//  FUNCIONES DE DIBUJO AUXILIARES (placeholders visuales)
// ====================================================================

// Remy — placeholder de forma simple
// 👉 Reemplazar por: image(imgRemy, x - 18, y - 38, 36, 52)
function dibujarRemy(x, y) {
  noStroke();
  fill(110, 105, 120); ellipse(x, y - 12, 26, 20);     // cuerpo
  fill(130, 125, 140); ellipse(x, y - 26, 20, 18);     // cabeza
  fill(190, 150, 155); ellipse(x - 8, y - 34, 10, 10); // oreja izq
  fill(190, 150, 155); ellipse(x + 8, y - 34, 10, 10); // oreja der
  fill(220, 100, 110); ellipse(x, y - 22, 5, 4);        // nariz
  fill(30, 20, 40);    ellipse(x - 5, y - 27, 4, 4);   // ojo izq
  fill(30, 20, 40);    ellipse(x + 5, y - 27, 4, 4);   // ojo der
  stroke(130, 120, 135); strokeWeight(2); noFill();
  arc(x + 16, y - 5, 20, 20, -HALF_PI, PI);             // cola
  noStroke();
}

// Rata del mercado
// 👉 Reemplazar por: image(imgRataMercado, 472, 148, 36, 50)
function dibujarRataMercado() {
  noStroke();
  fill(150, 110, 90);  ellipse(490, 176, 24, 18);
  fill(170, 130, 110); ellipse(490, 163, 18, 16);
  fill(210, 160, 160); ellipse(483, 155, 9, 9);
  fill(210, 160, 160); ellipse(497, 155, 9, 9);
  fill(150, 140, 165);
  textAlign(CENTER, CENTER);
  textSize(9);
  text("(clic)", 490, 192);
}

// Fondo de color diferente para cada escena (placeholder)
// 👉 Todo esto desaparece cuando carguen las imágenes reales
function dibujarFondoColor(id) {
  noStroke();
  let c;
  if      (id === 1)  c = [20, 30, 60];
  else if (id === 2)  c = [60, 80, 30];
  else if (id === 3)  c = [50, 40, 25];
  else if (id === 4)  c = [60, 45, 20];
  else if (id === 5)  c = [60, 20, 20];
  else if (id === 6)  c = [40, 50, 30];
  else if (id === 9)  c = [60, 50, 15];
  else if (id === 10) c = [35, 45, 60];
  else if (id === 11) c = [30, 20, 35];
  else c = [30, 28, 45];
  fill(c[0], c[1], c[2]);
  rect(0, 35, width, 185);
}

// Fondo nocturno de París — inicio y créditos
// 👉 Reemplazar por: image(imgParis, 0, 0, 600, 400)
function dibujarFondoNocturno() {
  for (let y = 0; y < height; y += 4) {
    let c = map(y, 0, height, 8, 30);
    fill(c, c * 0.8, c * 1.5);
    noStroke();
    rect(0, y, width, 4);
  }
  randomSeed(77);
  fill(255, 255, 255, 120);
  noStroke();
  for (let i = 0; i < 60; i++) {
    ellipse(random(width), random(height * 0.6), random(1, 3), random(1, 3));
  }
  fill(15, 12, 22);
  noStroke();
  beginShape();
  vertex(0, 400);   vertex(0, 280);
  vertex(40, 280);  vertex(40, 260);  vertex(60, 260);  vertex(60, 240);
  vertex(80, 240);  vertex(80, 255);  vertex(110, 255); vertex(110, 250);
  vertex(130, 250); vertex(130, 235); vertex(150, 235); vertex(150, 260);
  vertex(200, 260); vertex(200, 240); vertex(230, 220); vertex(260, 240);
  vertex(300, 240); vertex(300, 200); vertex(305, 190); vertex(310, 200);
  vertex(310, 240); vertex(360, 240); vertex(360, 255); vertex(400, 255);
  vertex(400, 265); vertex(450, 265); vertex(480, 255); vertex(510, 255);
  vertex(510, 270); vertex(560, 270); vertex(560, 280); vertex(600, 280);
  vertex(600, 400);
  endShape(CLOSE);
}


// ====================================================================
//  SISTEMA DE BOTONES DE NAVEGACIÓN
//
//  NAV define qué botones aparecen en cada escena y a dónde van.
//  La escena 2 tiene lógica especial: el segundo botón
//  solo se agrega si habloConRata === true.
//  Las escenas 7 y 8 manejan sus propios botones internamente.
// ====================================================================
const NAV = {
  0:  [{ txt: "COMENZAR",             dest: 1  }],
  1:  [{ txt: "Ir al mercado",        dest: 2  }, { txt: "Ir al restaurante", dest: 3 }],
  // Escena 2 se maneja en generarBotones() porque es condicional
  3:  [{ txt: "Entrar por la cocina", dest: 4  }],
  4:  [{ txt: "Ayudar a Linguini",    dest: 6  }, { txt: "Ignorarlo",         dest: 5 }],
  5:  [{ txt: "VOLVER A EMPEZAR",     dest: 0  }],
  6:  [{ txt: "Preparar el plato",    dest: 7  }],
  9:  [{ txt: "Ver créditos",         dest: 12 }],
  10: [{ txt: "Ver créditos",         dest: 12 }],
  11: [{ txt: "Intentar de nuevo",    dest: 0  }, { txt: "Ver créditos",      dest: 12 }],
  12: [{ txt: "Volver al inicio",     dest: 0  }]
};

function generarBotones() {
  botones = [];
  let opciones = [];

  if (escenaActual === 2) {
    // Escena 2 — el botón de avanzar aparece solo si habló con la rata
    if (habloConRata) {
      opciones = [{ txt: "Buscar a Linguini", dest: 3 }];
    }
    // Si no habló, opciones queda vacío y no hay botones
  } else {
    opciones = NAV[escenaActual] || [];
  }

  let anchoBoton = 220;
  let altoBoton  = 30;
  let separacion = 12;
  let anchoTotal = opciones.length * anchoBoton + (opciones.length - 1) * separacion;
  let inicioX    = (width - anchoTotal) / 2;

  for (let i = 0; i < opciones.length; i++) {
    botones.push({
      x:    inicioX + i * (anchoBoton + separacion),
      y:    height - 44,
      w:    anchoBoton,
      h:    altoBoton,
      texto: opciones[i].txt,
      dest:  opciones[i].dest,
      tipo:  i + 1
    });
  }
}

function dibujarBotones() {
  for (let i = 0; i < botones.length; i++) {
    let b = botones[i];
    let hover = (botonHover === i);
    let r, g, bl;
    if (b.tipo === 1) {
      r = hover ? 90  : 55;  g = hover ? 150 : 105; bl = hover ? 255 : 200;
    } else {
      r = hover ? 215 : 165; g = hover ? 80  : 50;  bl = hover ? 125 : 95;
    }
    fill(0, 0, 0, 70); noStroke();
    rect(b.x + 2, b.y + 2, b.w, b.h, 5);
    fill(r, g, bl);
    stroke(255, 255, 255, hover ? 90 : 25); strokeWeight(1);
    rect(b.x, b.y, b.w, b.h, 5);
    fill(255); noStroke();
    textAlign(CENTER, CENTER); textSize(12);
    textStyle(hover ? BOLD : NORMAL);
    text(b.texto, b.x + b.w / 2, b.y + b.h / 2);
    textStyle(NORMAL);
    if (hover) cursor(HAND);
  }
  if (botonHover === -1) cursor(ARROW);
}

function actualizarHover() {
  botonHover = -1;
  for (let i = 0; i < botones.length; i++) {
    let b = botones[i];
    if (mouseX >= b.x && mouseX <= b.x + b.w &&
        mouseY >= b.y && mouseY <= b.y + b.h) {
      botonHover = i;
      break;
    }
  }
}


// ====================================================================
//  EVENTOS DE MOUSE
// ====================================================================

function mousePressed() {
  // Iniciar drag de ingrediente — solo en escena 7
  if (escenaActual === 7) {
    for (let ing of ingredientes) {
      if (!ing.enBowl && dist(mouseX, mouseY, ing.x, ing.y) < 26) {
        ingredienteActivo = ing;
        offsetArrastre.x  = ing.x - mouseX;
        offsetArrastre.y  = ing.y - mouseY;
        break;
      }
    }
  }
}

function mouseDragged() {
  // Mover el ingrediente activo con el mouse
  if (ingredienteActivo) {
    ingredienteActivo.x = mouseX + offsetArrastre.x;
    ingredienteActivo.y = mouseY + offsetArrastre.y;
  }
}

function mouseReleased() {
  if (!ingredienteActivo) return;

  // ¿Cayó dentro del bowl?
  if (dist(ingredienteActivo.x, ingredienteActivo.y, BOWL.x, BOWL.y) < BOWL.radio) {
    // Solo lo agregamos si no estaba ya en el bowl (evita duplicados)
    if (!ingredientesEnBowl.includes(ingredienteActivo.nombre)) {
      ingredienteActivo.enBowl = true;
      ingredientesEnBowl.push(ingredienteActivo.nombre); // guardamos el NOMBRE (no la etiqueta)
    } else {
      // Ya estaba, lo devolvemos a su lugar
      ingredienteActivo.x = ingredienteActivo.xInicial;
      ingredienteActivo.y = ingredienteActivo.yInicial;
    }
  } else {
    // No llegó al bowl, vuelve a su posición inicial
    ingredienteActivo.x = ingredienteActivo.xInicial;
    ingredienteActivo.y = ingredienteActivo.yInicial;
  }

  ingredienteActivo = null;
}

function mouseClicked() {
  // ---- Clic en botón "Continuar" del diálogo ----
  if (dialogoVisible) {
    let dx = 60, dy = 90, dw = 480, dh = 160;
    let bx = dx + dw - 130, by = dy + dh - 38, bw = 114, bh = 26;
    if (mouseX > bx && mouseX < bx + bw && mouseY > by && mouseY < by + bh) {
      if (fraseActual < FRASES_RATA.length - 1) {
        fraseActual++; // avanzar a la siguiente frase
      } else {
        // Terminó el diálogo
        dialogoVisible = false;
        remyPausado    = false;
        habloConRata   = true;
        fraseActual    = 0;
        generarBotones(); // regeneramos para que aparezca el botón "Buscar a Linguini"
      }
    }
    return; // cuando hay diálogo, ignoramos todo lo demás
  }

  // ---- Clic en la rata del mercado (escena 2) ----
  if (escenaActual === 2 && dist(mouseX, mouseY, 490, 165) < 22) {
    dialogoVisible = true;
    remyPausado    = true;
    fraseActual    = 0;
    return;
  }

  // ---- Botones de navegación ----
  for (let b of botones) {
    if (mouseX >= b.x && mouseX <= b.x + b.w &&
        mouseY >= b.y && mouseY <= b.y + b.h) {
      irAEscena(b.dest);
      return;
    }
  }

  // ---- Escena 7: botón SERVIR PLATO ----
  if (escenaActual === 7) {
    let puedeServir = (ingredientesEnBowl.length >= 3);
    if (puedeServir && mouseX > 160 && mouseX < 400 && mouseY > 355 && mouseY < 387) {
      irAEscena(8);
      return;
    }
    // Botón limpiar bowl
    if (mouseX > 420 && mouseX < 570 && mouseY > 355 && mouseY < 387) {
      resetearIngredientes();
      return;
    }
  }
}


// ====================================================================
//  TRANSICIÓN ENTRE ESCENAS (fundido a negro)
//
//  Siempre usar irAEscena(numero) para cambiar de pantalla.
//  Nunca cambiar escenaActual directamente.
// ====================================================================
function irAEscena(destino) {
  if (enTransicion) return;
  destinoTransicion = destino;
  enTransicion      = true;
  alphaTransicion   = 0;
}

function manejarTransicion() {
  alphaTransicion += 10;
  noStroke();

  if (alphaTransicion < 256) {
    // Fase 1: se va poniendo negro
    fill(0, 0, 0, min(alphaTransicion, 255));
    rect(0, 0, width, height);

  } else if (alphaTransicion < 266) {
    // Punto más oscuro: cambiamos de escena acá
    escenaActual = destinoTransicion;
    generarBotones();
    remyX   = 300;
    remyDir = 1;
    // Resetear ingredientes si entramos a la cocina
    if (escenaActual === 7) {
      resetearIngredientes();
    }
    // Resetear estado del mercado si volvemos al inicio
    if (escenaActual === 0) {
      habloConRata   = false;
      dialogoVisible = false;
      fraseActual    = 0;
    }
    fill(0, 0, 0, 255);
    rect(0, 0, width, height);

  } else {
    // Fase 2: se va aclarando
    fill(0, 0, 0, max(0, 510 - alphaTransicion));
    rect(0, 0, width, height);
    if (alphaTransicion >= 510) enTransicion = false;
  }
}


// ====================================================================
//  CÓMO CARGAR IMÁGENES — para cuando el equipo las tenga listas
//
//  1. Poner los archivos de imagen en la misma carpeta que sketch.js
//  2. Descomentar el bloque preload() de abajo
//  3. En cada función de dibujo, reemplazar los placeholders
//     por la llamada a image() indicada con 👉
//
//  Nombres de archivo sugeridos (ya escritos en el código):
//    fondo_inicio.png  → París nocturna (pantalla de inicio y créditos)
//    fondo_1.png       → Alcantarillas           (600 × 222 px)
//    fondo_2.png       → Mercado                 (600 × 222 px)
//    fondo_3.png       → Exterior restaurante    (600 × 222 px)
//    fondo_4.png       → Cocina                  (600 × 222 px)
//    fondo_5.png       → Persecución / reinicio  (600 × 222 px)
//    fondo_6.png       → Alianza                 (600 × 222 px)
//    fondo_7.png       → Cocina interactiva      (600 × 400 px)
//    fondo_8.png       → Anton Ego               (600 × 400 px)
//    fondo_9.png       → Final Bueno             (600 × 222 px)
//    fondo_10.png      → Final Neutro            (600 × 222 px)
//    fondo_11.png      → Final Malo              (600 × 222 px)
//    fondo_12.png      → Créditos                (600 × 400 px)
//    remy.png          → Remy                    (36 × 52 px aprox)
//    rata_mercado.png  → Rata secundaria         (36 × 50 px aprox)
//    bowl.png          → El bowl vacío           (110 × 110 px)
//    ing_frutilla.png  → Ingrediente             (48 × 48 px)
//    ing_chocolate.png → Ingrediente             (48 × 48 px)
//    ing_crema.png     → Ingrediente             (48 × 48 px)
//    ing_menta.png     → Ingrediente             (48 × 48 px)
//    ing_sal.png       → Ingrediente             (48 × 48 px)
//
// ------------------------------------------------------------
//  let imgRemy, imgBowl, imgRataMercado;
//  let imgFondos = {};
//  let imgIng    = {};
//
//  function preload() {
//    imgRemy        = loadImage("remy.png");
//    imgBowl        = loadImage("bowl.png");
//    imgRataMercado = loadImage("rata_mercado.png");
//    imgFondos[0]   = loadImage("fondo_inicio.png");
//    imgFondos[12]  = loadImage("fondo_inicio.png"); // créditos usa el mismo
//    for (let i = 1; i <= 11; i++) {
//      imgFondos[i] = loadImage("fondo_" + i + ".png");
//    }
//    let nombres = ["frutilla","chocolate","crema","menta","sal"];
//    for (let n of nombres) {
//      imgIng[n] = loadImage("ing_" + n + ".png");
//    }
//  }
// ====================================================================
