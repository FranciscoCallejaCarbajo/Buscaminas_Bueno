// Definición del objeto buscaminas que almacenará la configuración y estado del juego
const buscaminas = {
  numMinasTotales: 0,       // Número total de minas en el tablero
  numMinasEncontradas: 0,   // Número de minas encontradas y marcadas correctamente por el jugador
  numFilas: 0,              // Número de filas del tablero de juego
  numColumnas: 0,           // Número de columnas del tablero de juego
  aCampoMinas: [],          // Matriz que representa el campo de juego, con información sobre las minas y las celdas
};

let intervaloTemporizador;
let temporizadorIniciado = false;


// Esta funcion crea el tablero automaticamente
// Esta función crea el tablero automáticamente
function pintarTablero() {
  // Obtiene el elemento del tablero por su id y lo guarda en la variable 'tablero'
  let tablero = document.querySelector("#tablero");

  // Con esto colocamos en las variables CSS el número de filas y columnas del objeto 'buscaminas'
  document
    .querySelector("html")
    .style.setProperty("--num-filas", buscaminas.numFilas);
  document
    .querySelector("html")
    .style.setProperty("--num-columnas", buscaminas.numColumnas);

  // Este while borra los divs predeterminados del HTML
  // Borramos el tablero actual
  while (tablero.firstChild) {
    // Elimina los eventos 'contextmenu' y 'click' de cada celda del tablero
    tablero.firstChild.removeEventListener("contextmenu", marcar); 
    tablero.firstChild.removeEventListener("click", destapar); 
    tablero.removeChild(tablero.firstChild); // Elimina la celda del DOM
  }

  // Creamos las celdas del tablero según el número de filas y columnas
  for (let f = 0; f < buscaminas.numFilas; f++) {
    for (let c = 0; c < buscaminas.numColumnas; c++) {
      let newDiv = document.createElement("div"); // Crea un nuevo div para cada celda

      // Establece los atributos y dataset para identificar la fila y columna de cada celda
      newDiv.setAttribute("id", "f" + f + "_c" + c);
      newDiv.dataset.fila = f;
      newDiv.dataset.columna = c;

      // Añade los eventos 'contextmenu' y 'click' a cada celda
      newDiv.addEventListener("contextmenu", marcar); // Evento con el botón derecho del ratón
      newDiv.addEventListener("click", destapar); // Evento con el botón izquierdo del ratón
      
      // Añade la celda al tablero
      tablero.appendChild(newDiv);
    }
  }
}


//Genera minas
function generarCampoMinasVacio() {
  // Verificamos si 'numFilas' no es NaN
  if (!Number.isNaN(buscaminas.numFilas)) {
    // Generamos el campo de minas en el objeto 'buscaminas'
    buscaminas.aCampoMinas = new Array(buscaminas.numFilas); // Creamos un array con el número de filas

    // Recorremos cada fila para crear un array de columnas
    for (let fila = 0; fila < buscaminas.numFilas; fila++) {
      // Creamos un array para cada fila con el número de columnas
      buscaminas.aCampoMinas[fila] = new Array(buscaminas.numColumnas);
    }
  } else {
    // Si 'numFilas' es NaN, recargamos la página
    location.reload();
  }
}


function esparcirMinas() {
  //repartimos de forma aleatoria las minas
  let numMinasEsparcidas = 0;

  while (numMinasEsparcidas < buscaminas.numMinasTotales) {
    //numero aleatorio en el intervalo [0,numFilas-1]
    let fila = Math.floor(Math.random() * buscaminas.numFilas);

    //numero aleatorio en el intervalo [0,numColumnas-1]
    let columna = Math.floor(Math.random() * buscaminas.numColumnas);

    //si no hay bomba en esa posicion
    if (buscaminas.aCampoMinas[fila][columna] != "B") {
      //la ponemos
      buscaminas.aCampoMinas[fila][columna] = "B";

      //y sumamos 1 a las bombas esparcidas
      numMinasEsparcidas++;
    }
  }
}

function contarMinasAlrededorCasilla(fila, columna) {
  let numeroMinasAlrededor = 0;

  // De la fila anterior a la posterior
  for (let zFila = fila - 1; zFila <= fila + 1; zFila++) {
    // De la columna anterior a la posterior
    for (let zColumna = columna - 1; zColumna <= columna + 1; zColumna++) {
      // Si la casilla cae dentro del tablero
      if (
        zFila > -1 &&
        zFila < buscaminas.numFilas &&
        zColumna > -1 &&
        zColumna < buscaminas.numColumnas
      ) {
        // Miramos si en esa posición hay bomba
        if (buscaminas.aCampoMinas[zFila][zColumna] == "B") {
          // Y sumamos 1 al número de minas que hay alrededor de esa casilla
          numeroMinasAlrededor++;
        }
      }
    }
  }

  // Guardamos cuántas minas hay en esa posición
  buscaminas.aCampoMinas[fila][columna] = numeroMinasAlrededor;
}


function contarMinas() {
  //contamos cuantas minas hay alrededor de cada casilla
  for (let fila = 0; fila < buscaminas.numFilas; fila++) {
    for (let columna = 0; columna < buscaminas.numColumnas; columna++) {
      //solo contamos si es distinto de bomba
      if (buscaminas.aCampoMinas[fila][columna] != "B") {
        contarMinasAlrededorCasilla(fila, columna);
      }
    }
  }
}

function marcar(miEvento) {
  if (miEvento.type === "contextmenu") {
    console.log(miEvento); //quitar console es para ver si funcionaba

    //obtenemos el elemento que ha disparado el evento
    let casilla = miEvento.currentTarget;

    //detenemos el evento y su accion por defecto
    miEvento.stopPropagation();
    miEvento.preventDefault();

    //obtenemos la fila de las propiedades dataset.
    let fila = parseInt(casilla.dataset.fila, 0);
    let columna = parseInt(casilla.dataset.columna, 0);

    if (
      fila >= 0 &&
      columna >= 0 &&
      fila < buscaminas.numFilas &&
      columna < buscaminas.numColumnas
    ) {
      //si esta marcada como "bandera"
      if (casilla.classList.contains("icon-bandera")) {
        //la quitamos
        casilla.classList.remove("icon-bandera");
        //y la marcamos como duda
        casilla.classList.add("icon-duda");
        //y al numero de minas encontradas le restamos 1
        buscaminas.numMinasEncontradas--;
      } else if (casilla.classList.contains("icon-duda")) {
        //si estaba marcada como duda lo quitamos
        casilla.classList.remove("icon-duda");
      } else if (casilla.classList.length == 0) {
        //si no está marcada la marcamos como "bandera"
        casilla.classList.add("icon-bandera");
        //y sumamos 1 al numero de minas encontradas
        buscaminas.numMinasEncontradas++;
        //si es igual al numero de minas totales resolvemos el tablero para ver si esta bien
        if (buscaminas.numMinasEncontradas == buscaminas.numMinasTotales) {
          resolverTablero(true);
        }
      }
      //actualizamos la barra de estado con el numero de minas restantes
      actualizarNumMinasRestantes();
    }
  }
}

function destapar(miEvento) {
  // Verificamos si el tipo de evento es "click"
  if (miEvento.type === "click") {
    // Iniciar el temporizador solo si aún no ha comenzado
    if (!temporizadorIniciado) {
      iniciarTemporizador();
      temporizadorIniciado = true; // Marcamos el temporizador como iniciado
    }

    // Obtenemos el elemento que ha disparado el evento
    let casilla = miEvento.currentTarget;

    // Obtenemos las coordenadas de la casilla a partir de sus atributos dataset
    let fila = parseInt(casilla.dataset.fila, 0);
    let columna = parseInt(casilla.dataset.columna, 0);

    // Llamamos a la función destaparCasilla con las coordenadas de la casilla
    destaparCasilla(fila, columna);
  }
}


// Esta funcion se encarga de llamar la funcion destapar
function destaparCasilla(fila, columna) {
  //si la casilla esta dentro del tablero
  if (
    fila > -1 &&
    fila < buscaminas.numFilas &&
    columna > -1 &&
    columna < buscaminas.numColumnas
  ) {
    console.log(
      "destapamos la casilla con fila " + fila + " y columna " + columna
    );
    //obtenermos la casilla con la fila y columna
    let casilla = document.querySelector("#f" + fila + "_c" + columna);

    //si la casilla no esta destapada
    if (!casilla.classList.contains("destapado")) {
      //si no esta marcada como "bandera"
      if (!casilla.classList.contains("icon-bandera")) {
        //la destapamos
        casilla.classList.add("destapado");

        //ponemos en la casilla el número de minas que tiene alrededor
        casilla.innerHTML = buscaminas.aCampoMinas[fila][columna];

        //ponemos el estilo del numero de minas que tiene alrededor (cada uno es de un color)
        casilla.classList.add("c" + buscaminas.aCampoMinas[fila][columna]);

        //si no es bomba
        if (buscaminas.aCampoMinas[fila][columna] !== "B") {
          // y tiene 0 minas alrededor, destapamos las casillas contiguas
          if (buscaminas.aCampoMinas[fila][columna] == 0) {
            destaparCasilla(fila - 1, columna - 1);
            destaparCasilla(fila - 1, columna);
            destaparCasilla(fila - 1, columna + 1);
            destaparCasilla(fila, columna - 1);
            destaparCasilla(fila, columna + 1);
            destaparCasilla(fila + 1, columna - 1);
            destaparCasilla(fila + 1, columna);
            destaparCasilla(fila + 1, columna + 1);

            //y borramos el 0 poniendo la cadena vacía
            casilla.innerHTML = "";
          }
        } else if (buscaminas.aCampoMinas[fila][columna] == "B") {
          // si por el contrario hay bomba quitamos la B
          casilla.innerHTML = "";

          //añadimos el estilo de que hay bomba
          casilla.classList.add("icon-bomba");

          // y que se nos ha olvidado marcarla
          casilla.classList.add("sinmarcar");

          // y resolvemos el tablero indicando (false), que hemos cometido un fallo
          resolverTablero(false);
        }
      }
    }
  }
}

function resolverTablero(isOK) {
  let modal = document.getElementById("myModal");
  let span = document.getElementById("closeModal");
  let btnResetModal = document.getElementById("btnResetModal");

  let aCasillas = tablero.children;
  for (let i = 0; i < aCasillas.length; i++) {
    aCasillas[i].removeEventListener("click", destapar);
    aCasillas[i].removeEventListener("contextmenu", marcar);

    let fila = parseInt(aCasillas[i].dataset.fila, 0);
    let columna = parseInt(aCasillas[i].dataset.columna, 0);

    if (aCasillas[i].classList.contains("icon-bandera")) {
      if (buscaminas.aCampoMinas[fila][columna] == "B") {
        aCasillas[i].classList.add("destapado");
        aCasillas[i].classList.remove("icon-bandera");
        aCasillas[i].classList.add("icon-bomba");
      } else {
        aCasillas[i].classList.add("destapado");
        aCasillas[i].classList.add("banderaErronea");
        isOK = false;
      }
    } else if (!aCasillas[i].classList.contains("destapado")) {
      if (buscaminas.aCampoMinas[fila][columna] == "B") {
        aCasillas[i].classList.add("destapado");
        aCasillas[i].classList.add("icon-bomba");
      }
    }
  }

  if (!isOK) {
    // Detener el temporizador cuando el jugador pierde
    clearInterval(intervaloTemporizador);
  }

  if (isOK) {
    modal.style.display = "block";
  }

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function actualizarNumMinasRestantes() {
  // Seleccionamos el elemento con el id "numMinasRestantes" en el documento
  let elementoNumMinasRestantes = document.querySelector("#numMinasRestantes");

  // Calculamos el número de minas restantes restando las minas encontradas del total de minas
  let numMinasRestantes = buscaminas.numMinasTotales - buscaminas.numMinasEncontradas;

  // Actualizamos el contenido HTML del elemento seleccionado con el número de minas restantes
  elementoNumMinasRestantes.innerHTML = numMinasRestantes;
}

function reiniciarJuego() {
  // Ocultar el mensaje de felicitación al reiniciar el juego
  let mensajeFelicidades = document.getElementById("mensajeFelicidades");
  mensajeFelicidades.style.display = "none";

  // Reiniciar el juego llamando a la función inicio()
  inicio();
}

function iniciarTemporizador() {
  const startButton = document.getElementById("start-timer");
  let segundos = 0; // Variable para almacenar el tiempo en segundos

  // Función para actualizar el temporizador
  function actualizarTemporizador() {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;

    const tiempoFormateado =
      (minutos < 10 ? "0" : "") + minutos + ":" + (segundosRestantes < 10 ? "0" : "") + segundosRestantes;

    startButton.textContent = tiempoFormateado;

    segundos++;
  }

  // Iniciar el temporizador
  intervaloTemporizador = setInterval(actualizarTemporizador, 1000);
}

function actualizarNumMinasRestantes() {
  const elementoNumMinasRestantes = document.querySelector("#numMinasRestantes");

  // Calculamos el número de minas restantes restando las minas encontradas del total de minas
  const numMinasRestantes = buscaminas.numMinasTotales - buscaminas.numMinasEncontradas;

  // Actualizamos el contenido HTML del elemento seleccionado con el número de minas restantes
  elementoNumMinasRestantes.textContent = numMinasRestantes;
}

//función para resetear el juego
function resetJuego() {
  // Ocultar el modal si está visible
  let modal = document.getElementById("myModal");
  modal.style.display = "none";

  // Detener el temporizador actual
  clearInterval(intervaloTemporizador);

  // Reiniciar el tablero
  inicio();
}

// Agregamos el evento al botón de Reset
document.getElementById("iniciarJuego2").addEventListener("click", resetJuego);

// Agregamos el evento al botón de Reset
document.getElementById("iniciarJuego2").addEventListener("click", resetJuego);




// Funcion iniciar el juego con parametros exactos (Si quisieramos cambiar los parametros para que salga de otro tamaño cambiarlos aqui...)
function inicio() {
  // Establecer las dimensiones y la cantidad de minas del tablero
  buscaminas.numFilas = 10;
  buscaminas.numColumnas = 10;
  buscaminas.numMinasTotales = 12;
  buscaminas.numMinasEncontradas = 0;

  // Reiniciar la bandera del temporizador
  temporizadorIniciado = false;

  // Pintar el tablero en la interfaz gráfica
  pintarTablero();

  // Generar un campo de minas vacío
  generarCampoMinasVacio();

  // Esparcir las minas en el campo de minas
  esparcirMinas();

  // Contar el número de minas alrededor de cada casilla
  contarMinas();

  // Actualizar el número de minas restantes en la interfaz gráfica
  actualizarNumMinasRestantes();

    // Reiniciar el temporizador en el botón sin empezar aún
  const startButton = document.getElementById("start-timer");
  startButton.textContent = "00:00";
  clearInterval(intervaloTemporizador); // Detenemos cualquier temporizador previo

  }


window.onload = inicio;




// Esto es para el boton de jugar con mas celdas etc

// Selecciona el elemento con el id "abrirJugarMas" y agrega un evento de clic
document.getElementById("abrirJugarMas").addEventListener("click", function () {
  // Selecciona el contenedor del formulario con el id "formContainer" y alterna la clase "hidden" para mostrar u ocultar el formulario
  document.getElementById("formContainer").classList.toggle("hidden");
});


function inicioBoton() {
  // Verificar si el número de filas o columnas es NaN (Not a Number)
  if (isNaN(buscaminas.numColumnas) || isNaN(buscaminas.numFilas)) {
    // Recargar la página si el número de filas o columnas no es un número válido
    location.reload();
  } else {
    // Obtener los campos de entrada para el número de filas, columnas y minas
    let numFilasInput = document.getElementById("numFilas");
    let numColumnasInput = document.getElementById("numColumnas");
    let numMinasTotalesInput = document.getElementById("numMinasTotales");

    // Actualizar el número de filas, columnas y minas del buscaminas con los valores introducidos en los campos de entrada
    buscaminas.numFilas = parseInt(numFilasInput.value ?? 0, 10);
    buscaminas.numColumnas = parseInt(numColumnasInput.value, 10);
    buscaminas.numMinasTotales = parseInt(numMinasTotalesInput.value, 10);

    // Validar que el número de minas no sea mayor que la mitad del total de casillas
    if (
      buscaminas.numMinasTotales >=
      (buscaminas.numFilas * buscaminas.numColumnas) / 2
    ) {
      // Mostrar una alerta si el número de minas es mayor o igual a la mitad del total de casillas
      alert(
        "El número de minas no puede ser mayor que la mitad del total de las casillas."
      );
      return; // Salir de la función si hay un error
    }
  }

  // Ejecutar las funciones para iniciar el juego
  pintarTablero();
  generarCampoMinasVacio();
  esparcirMinas();
  contarMinas();
  actualizarNumMinasRestantes();
}

// Agregar eventos de clic para iniciar el juego al hacer clic en los botones correspondientes
document.getElementById("iniciarJuego1").addEventListener("click", inicioBoton);
document.getElementById("iniciarJuego2").addEventListener("click", inicioBoton);


function myFunction() {
  // Selecciona el formulario con el id "myForm" y lo resetea, lo que restablece todos los campos de entrada a sus valores por defecto
  document.getElementById("myForm").reset();
}


// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {
  // Obtén el botón de inicio del temporizador por su ID
  const startButton = document.getElementById("start-timer");

  let segundos = 0; // Variable para almacenar el tiempo en segundos

  // Función para actualizar el temporizador
  function actualizarTemporizador() {
    // Calcula los minutos a partir de los segundos almacenados
    const minutos = Math.floor(segundos / 60);
    // Calcula los segundos restantes
    const segundosRestantes = segundos % 60;

    // Formatea el tiempo en minutos y segundos con ceros a la izquierda si es necesario
    const tiempoFormateado =
      (minutos < 10 ? "0" : "") + minutos + ":" + (segundosRestantes < 10 ? "0" : "") + segundosRestantes;

    // Muestra el tiempo formateado en el botón de inicio del temporizador
    startButton.textContent = tiempoFormateado;

    // Incrementa la variable de segundos para reflejar el tiempo transcurrido
    segundos++;
  }

  // Agrega un evento de clic al botón de inicio del temporizador
  startButton.addEventListener("click", function () {
    // Reinicia el tiempo a cero
    segundos = 0;
    // Actualiza el contenido del botón con el tiempo inicial "00:00"
    startButton.textContent = "00:00";

    // Inicia el temporizador actualizando la función de actualización cada segundo (1000 milisegundos)
    setInterval(actualizarTemporizador, 1000);
  });
});
