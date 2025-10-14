function sanitize(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, char => map[char]);
}

function publicarPregunta() {
  const nombre = sanitize(document.getElementById("nombre").value.trim());
  const titulo = sanitize(document.getElementById("titulo").value.trim());
  const pregunta = sanitize(document.getElementById("pregunta").value.trim());

  if (nombre && titulo && pregunta) {
    const nueva = { nombre, titulo, pregunta };
    guardarPregunta(nueva);
    mostrarPregunta(nueva);

    document.getElementById("nombre").value = "";
    document.getElementById("titulo").value = "";
    document.getElementById("pregunta").value = "";
  } else {
    alert("Por favor, completa todos los campos.");
  }
}

function guardarPregunta(pregunta) {
  const preguntas = JSON.parse(localStorage.getItem("preguntas")) || [];
  preguntas.push(pregunta);
  localStorage.setItem("preguntas", JSON.stringify(preguntas));
}

function mostrarPregunta({ nombre, titulo, pregunta }) {
  const nuevaPregunta = document.createElement("div");
  nuevaPregunta.classList.add("pregunta", "fade-in");
  nuevaPregunta.innerHTML = `
    <strong>${titulo}</strong>
    <p>por ${nombre}</p>
    <p class="contenido">${pregunta}</p>
  `;
  document.getElementById("lista-preguntas").appendChild(nuevaPregunta);
}

function cargarPreguntasGuardadas() {
  const preguntas = JSON.parse(localStorage.getItem("preguntas")) || [];
  preguntas.forEach(mostrarPregunta);
}

function sendMessage() {
  const usuario = sanitize(document.getElementById("user-select").value);
  const mensaje = sanitize(document.getElementById("chat-input").value.trim());

  if (usuario && mensaje) {
    const chat = document.getElementById("chat-messages");
    const nuevoMensaje = document.createElement("p");
    nuevoMensaje.textContent = `${usuario}: ${mensaje}`;
    nuevoMensaje.classList.add("fade-in");
    chat.appendChild(nuevoMensaje);
    document.getElementById("chat-input").value = "";
  } else {
    alert("Selecciona un usuario y escribe un mensaje.");
  }
}

document.getElementById("btn-publicar").addEventListener("click", publicarPregunta);
document.getElementById("btn-enviar").addEventListener("click", sendMessage);
window.addEventListener("DOMContentLoaded", cargarPreguntasGuardadas);
