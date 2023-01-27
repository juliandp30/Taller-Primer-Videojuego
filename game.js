// Se crea el objeto del canvas
const canvas = document.querySelector("#game");

// Objetos de botones
const btnUp = document.querySelector("#up");
const btnDown = document.querySelector("#down");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");

// Se agregan listeneres de eventos cuando se de click en los botones
btnUp.addEventListener("click", moveUp);
btnDown.addEventListener("click", moveDown);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);

// Se agregan listeneres de eventos cuando se opriman teclas
// para presionar es 'keydown' y para liberar tecla 'keyup'
window.addEventListener("keydown", moveByKeys);

// Se crea contexto... que es como se acceden a los metodos
// para el canvas. En este caso se especifica cuantas dimensiones
// tendra el juego (2D)
const game = canvas.getContext("2d");

// Cuando se carge el html ('load') se ejecuta el codigo para empezar el juego
window.addEventListener("load", setCanvasSize);

// Variable para calcular el lado de cuadrado del canvas
let canvasSize;
// Variable para cada cuadrado interior del canvas
let elementSize;
// Variable que guarda el nivel
let level = 0;
// Variable que guarde las vigas
let lives = 3;

// Variable para guardar la posicion del jugador
let playerPosition = {
  x: undefined,
  y: undefined,
};

// Variable para guardar la posicion del objetivo
let giftPosition = {
  x: undefined,
  y: undefined,
};

// Lista para almacenar las posiciones de las bombas
let bombPosition = [];

// Cuando se modifique el tamaño de la ventana ('load') se ejecuta la funcion
window.addEventListener("resize", setCanvasSize);

// Funcion para inicializar el juego
function startGame() {
  // Tamaño de fuente para aplicar a los elementos
  game.font = elementSize * 0.5 + "px Verdana";
  game.textAlign = "center";

  // Se trae el mapa
  const map = maps[level];

  // Si no hay mapa no hace nada
  if (!map) {
    gameWin();
    return;
  }

  // Con el metodo trim de string se quitan espacios al inicial y al final
  // y con el split se divide por caracter
  // Luego se hace un map de lo mismo (quitar espacios y dividir por caracter)
  let mapArray = map
    .trim()
    .split("\n")
    .map((rows) => rows.trim().split(""));

  // Se borra todo lo que haya en el canvas
  // cordx_ini, cordy_ini, width, heigth
  game.clearRect(0, 0, canvasSize, canvasSize);

  // Se limpia la posicion de las bombas
  bombPosition = [];

  // Usando for each para reducir lineas de codigo
  // cuando se reciben dos parametros, el primero es el elmento del array y el segundo es el indice
  mapArray.forEach((row, i) => {
    row.forEach((emoji, j) => {
      // Coordenadas de insercion del elemento
      let posX = elementSize * 0.5 + elementSize * i;
      let posY = elementSize * 0.6 + elementSize * j;

      // Se trae el objeto del mapa y se coloca en el canvas
      game.fillText(emojis[emoji], posX, posY);

      // Si se encuentra la puerta 'O' y no se ha definido la posicion del jugador
      if (emoji === "O" && !playerPosition.x && !playerPosition.y) {
        playerPosition.x = posX;
        playerPosition.y = posY;
      } else if (emoji === "I") {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (emoji === "X") {
        bombPosition.push([posX, posY]);
      }
    });
  });

  // Se dibuja el emoji del jugador en la posicion que es
  movePlayer();
}

function setCanvasSize() {
  // Funcion para modificar el tamaño del canvas

  // Se calcula cual es la minima medida de la pantalla activa y se
  // define que el tamaño del canvas es del 75% de esa medida
  canvasSize = Math.min(window.innerHeight, window.innerWidth) * 0.75;
  // Modificar tamaños del canvas
  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  // Cuadrado interior del canvas
  elementSize = canvasSize / 10;

  // Cada que se modifica el tamaño, se renderiza el juego
  startGame();

  return canvasSize, elementSize;
}

// Funciones de movimiento

function moveByKeys(event) {
  // Con el event key se rescata como se llama el evento en el navegador
  // Cuando en un if no se ponen las {} se ejecuta el codigo que este despues de los ()
  // Esto para reducir codigo
  if (event.key == "ArrowUp") moveUp();
  else if (event.key == "ArrowDown") moveDown();
  else if (event.key == "ArrowLeft") moveLeft();
  else if (event.key == "ArrowRight") moveRight();
}

function nextLevel() {
  console.log("Siguiente nivel");
  level++;
  startGame();
}

function gameWin() {
  console.log("terminaste el juego");
}

function gameFail() {
  if (lives <= 1) {
    level = 0;
    lives = 3;
  } else {
    lives--;
  }
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function reviewPlayerPosition() {
  // Colision con el regalo
  if (
    playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3) &&
    playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3)
  ) {
    nextLevel();
  }
  // Colision con las bombas
  if (
    bombPosition.some(
      (posic) =>
        posic[0].toFixed(3) == playerPosition.x.toFixed(3) &&
        posic[1].toFixed(3) == playerPosition.y.toFixed(3)
    )
  ) {
    gameFail();
  }
}

function movePlayer() {
  // Se dibuja el emoji del jugador
  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
  // Se revisa la posicion del jugador
  reviewPlayerPosition();
}

function moveUp() {
  if (playerPosition.y - elementSize + 1e-3 > elementSize * 0.5) {
    playerPosition.y -= elementSize;
    // Se vuelve a cargar el juego para borrar el emoji de la posición anterior
    startGame();
  }
}

function moveDown() {
  if (playerPosition.y + elementSize - 1e-3 < canvasSize) {
    playerPosition.y += elementSize;
    // Se vuelve a cargar el juego para borrar el emoji de la posición anterior
    startGame();
  }
}

function moveLeft() {
  if (playerPosition.x - elementSize + 1e-3 > elementSize * 0.5) {
    playerPosition.x -= elementSize;
    // Se vuelve a cargar el juego para borrar el emoji de la posición anterior
    startGame();
  }
}

function moveRight() {
  if (playerPosition.x + elementSize - 1e-3 < canvasSize) {
    playerPosition.x += elementSize;
    // Se vuelve a cargar el juego para borrar el emoji de la posición anterior
    startGame();
  }
}
