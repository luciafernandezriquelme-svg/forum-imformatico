// Publicar mensaje de apoyo
function publicarApoyo() {
  const usuario = sessionStorage.getItem("usuario") || "Anónimo";
  const mensajeInput = document.getElementById("mensaje-apoyo");
  const mensaje = mensajeInput?.value.trim();
  if (!mensaje) return;

  const apoyos = JSON.parse(localStorage.getItem("mensajesApoyo")) || [];
  apoyos.push({ autor: usuario, mensaje, fecha: new Date().toISOString() });
  localStorage.setItem("mensajesApoyo", JSON.stringify(apoyos));

  mensajeInput.value = "";
  cargarMensajesApoyo();
}

// Mostrar mensajes de apoyo
function cargarMensajesApoyo() {
  const apoyos = JSON.parse(localStorage.getItem("mensajesApoyo")) || [];
  const lista = document.getElementById("lista-apoyo");
  if (!lista) return;

  lista.innerHTML = "";
  apoyos.slice().reverse().forEach(({ autor, mensaje }) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${autor}</strong>: ${mensaje}`;
    lista.appendChild(li);
  });
}

// Publicar presentación en Rincón de Bienvenida
function publicarBienvenida() {
  const usuario = sessionStorage.getItem("usuario") || "Anónimo";
  const mensajeInput = document.getElementById("mensaje-bienvenida");
  const mensaje = mensajeInput?.value.trim();
  if (!mensaje) return;

  const bienvenidas = JSON.parse(localStorage.getItem("mensajesBienvenida")) || [];
  bienvenidas.push({ autor: usuario, mensaje, fecha: new Date().toISOString() });
  localStorage.setItem("mensajesBienvenida", JSON.stringify(bienvenidas));

  mensajeInput.value = "";
  cargarMensajesBienvenida();
}

// Mostrar presentaciones en Rincón de Bienvenida
function cargarMensajesBienvenida() {
  const bienvenidas = JSON.parse(localStorage.getItem("mensajesBienvenida")) || [];
  const lista = document.getElementById("lista-bienvenida");
  if (!lista) return;

  lista.innerHTML = "";
  bienvenidas.slice().reverse().forEach(({ autor, mensaje }) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${autor}</strong>: ${mensaje}`;
    lista.appendChild(li);
  });
}

// Mostrar contador de miembros activos
function mostrarContadorMiembros() {
  const miembros = localStorage.getItem("miembrosActivos") || "128";
  const contador = document.getElementById("miembrosActivos");
  if (contador) {
    contador.textContent = miembros;
  }
}

// Inicializar funciones al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  cargarMensajesApoyo();
  cargarMensajesBienvenida();
  mostrarContadorMiembros();
});


