const mensaje = document.querySelector(".titulo");
let texto = "Welcome";

// Función para hacer el efecto de escritura
function efecto (elemento, texto, i = 0){
    if (i < texto.length){
        elemento.textContent += texto[i];
        setTimeout(() => efecto(elemento, texto, i + 1), 300);  // Escribe más rápido
    } else {
        setTimeout(() => borrarTexto(elemento), 1500);  // Borrado más rápido
    }
}

// Función para borrar el texto y repetir el ciclo
function borrarTexto(elemento) {
    elemento.textContent = '';
    setTimeout(() => efecto(elemento, texto), 1000);  // Inicia el ciclo más seguido
}

// Ejecutar la función de escritura
efecto(mensaje, texto);

// Movimiento de los vehículos
let coche1 = document.getElementById("coche");
let autobus1 = document.getElementById("autobus");

function movimiento(t = -20, a = -20, velocidad = 60) {
    if (t < 120) {
        coche1.style.marginLeft = (t * 3) + `vw`;
        setTimeout(() => movimiento(t + 1, a, velocidad), velocidad);
    } else if (a < 120) {
        autobus1.style.display = `block`;
        autobus1.style.marginLeft = a + `vw`;
        setTimeout(() => movimiento(t, a + 1, velocidad), velocidad);
    } else {
        invertirImagenAutobus();
        vuelta();
    }
}

// Función para invertir la dirección del autobús y el coche
function invertirImagenAutobus() {
    autobus1.style.transform = `scaleX(-1)`;
    coche1.style.transform = `scaleX(-1)`;
}

// Función para devolver el autobús
function vuelta(x = 119, y = 70, velocidad = 40) {
    if (x >= -25) {
        autobus1.style.marginLeft = x + `vw`;
        setTimeout(() => vuelta(x - 1, y, velocidad), velocidad);
    } else {
        vueltacoche();
    }
}

// Función para devolver el coche
function vueltacoche(y = 119, velocidad = 40) {
    if (y >= -20) {
        coche1.style.marginLeft = y + `vw`;
        setTimeout(() => vueltacoche(y - 1, velocidad), velocidad);
    } else {
        resetMovimiento();  // Reinicia el ciclo de movimiento cuando ambos vehículos terminan
    }
}

// Reinicia el movimiento de ambos vehículos
function resetMovimiento() {
    coche1.style.transform = `scaleX(1)`;
    autobus1.style.transform = `scaleX(1)`;
    autobus1.style.display = 'none';
    movimiento();  // Reinicia el movimiento
}

// Iniciar el movimiento de los vehículos
movimiento();
