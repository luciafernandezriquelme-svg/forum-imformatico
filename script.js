// Redirigir si no hay sesión activa
if (!localStorage.getItem("usuarioActivo")) {
  window.location.href = "login.html";
}

// Sanitización básica
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

// Publicar pregunta
function publicarPregunta() {
  const titulo = sanitize(document.getElementById("titulo").value.trim());
  const contenido = sanitize(document.getElementById("pregunta").value.trim());
  const autor = localStorage.getItem("usuarioActivo");

  if (titulo && contenido) {
    const nueva = { autor, titulo, contenido, respuestas: [] };
    const preguntas = JSON.parse(localStorage.getItem("preguntas")) || [];
    preguntas.push(nueva);
    localStorage.setItem("preguntas", JSON.stringify(preguntas));
    mostrarPregunta(nueva);
    document.getElementById("titulo").value = "";
    document.getElementById("pregunta").value = "";
    sumarPuntos(autor, 10);
  } else {
    alert("Completa todos los campos.");
  }
}

// Mostrar pregunta con respuestas y botón de responder
function mostrarPregunta({ autor, titulo, contenido, respuestas = [] }) {
  const div = document.createElement("div");
  div.classList.add("pregunta", "fade-in");

  const respuestasHTML = respuestas.map(r => `
    <div class="respuesta">
      <p><strong>${r.usuario}:</strong> ${r.texto}</p>
    </div>
  `).join("");

  div.innerHTML = `
    <strong>${titulo}</strong>
    <p>por ${autor}</p>
    <p class="contenido">${contenido}</p>
    <div class="respuestas">${respuestasHTML}</div>
    <textarea placeholder="Escribe tu respuesta..." class="respuesta-input"></textarea>
    <button class="btn-responder">Responder</button>
  `;

  div.querySelector(".btn-responder").addEventListener("click", () => {
    const texto = sanitize(div.querySelector(".respuesta-input").value.trim());
    const usuario = localStorage.getItem("usuarioActivo");
    if (!texto) return alert("Escribe una respuesta.");
    const preguntas = JSON.parse(localStorage.getItem("preguntas")) || [];
    const index = preguntas.findIndex(p => p.titulo === titulo && p.autor === autor);
    if (index !== -1) {
      preguntas[index].respuestas.push({ usuario, texto });
      localStorage.setItem("preguntas", JSON.stringify(preguntas));
      div.querySelector(".respuestas").innerHTML += `
        <div class="respuesta">
          <p><strong>${usuario}:</strong> ${texto}</p>
        </div>
      `;
      div.querySelector(".respuesta-input").value = "";
      sumarPuntos(usuario, 15);
    }
  });

  document.getElementById("lista-preguntas").appendChild(div);
}

// Cargar preguntas guardadas
function cargarPreguntasGuardadas() {
  const preguntas = JSON.parse(localStorage.getItem("preguntas")) || [];
  preguntas.forEach(mostrarPregunta);
}

// Buscador de preguntas
document.getElementById("buscador").addEventListener("input", e => {
  const filtro = e.target.value.toLowerCase();
  const preguntas = document.querySelectorAll("#lista-preguntas .pregunta");
  preguntas.forEach(p => {
    const texto = p.textContent.toLowerCase();
    p.style.display = texto.includes(filtro) ? "block" : "none";
  });
});

// Chat
function sendMessage() {
  const usuario = sanitize(document.getElementById("user-select").value);
  const mensaje = sanitize(document.getElementById("chat-input").value.trim());

  if (usuario && mensaje) {
    const nuevo = { usuario, mensaje };
    const mensajes = JSON.parse(localStorage.getItem("mensajesChat")) || [];
    mensajes.push(nuevo);
    localStorage.setItem("mensajesChat", JSON.stringify(mensajes));
    mostrarMensaje(nuevo);
    document.getElementById("chat-input").value = "";
    sumarPuntos(usuario, 5);
  } else {
    alert("Selecciona un usuario y escribe un mensaje.");
  }
}

function mostrarMensaje({ usuario, mensaje }) {
  const chat = document.getElementById("chat-messages");
  const nuevoMensaje = document.createElement("p");
  nuevoMensaje.textContent = `${usuario}: ${mensaje}`;
  nuevoMensaje.classList.add("fade-in", `usuario-${usuario.toLowerCase()}`);
  chat.appendChild(nuevoMensaje);
}

function cargarMensajesGuardados() {
  const mensajes = JSON.parse(localStorage.getItem("mensajesChat")) || [];
  mensajes.forEach(mostrarMensaje);
}

// Reacciones tipo WhatsApp
document.getElementById("chat-input").addEventListener("focus", () => {
  document.getElementById("emoji-panel").classList.remove("hidden");
});
document.getElementById("chat-input").addEventListener("blur", () => {
  setTimeout(() => {
    document.getElementById("emoji-panel").classList.add("hidden");
  }, 300);
});
document.querySelectorAll("#emoji-panel span").forEach(emoji => {
  emoji.addEventListener("click", () => {
    const input = document.getElementById("chat-input");
    input.value += emoji.textContent;
    input.focus();
  });
});

// Reputación y ranking
function sumarPuntos(usuario, puntos) {
  const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
  const index = usuarios.findIndex(u => u.usuario === usuario);
  if (index !== -1) {
    usuarios[index].puntos = (usuarios[index].puntos || 0) + puntos;
    localStorage.setItem("usuariosRegistrados", JSON.stringify(usuarios));
    actualizarRanking();
  }
}

function actualizarRanking() {
  const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
  const lista = document.getElementById("ranking-list");
  lista.innerHTML = "";

  usuarios
    .filter(u => u.puntos)
    .sort((a, b) => b.puntos - a.puntos)
    .forEach(u => {
      const li = document.createElement("li");
      li.textContent = `${u.usuario} - ${u.puntos} pts`;
      lista.appendChild(li);
    });
}

// Tema claro/oscuro
function aplicarTema() {
  const tema = localStorage.getItem("temaPreferido");
  if (tema === "claro") document.body.classList.add("light-mode");
}
document.getElementById("btn-tema").addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  const modo = document.body.classList.contains("light-mode") ? "claro" : "oscuro";
  localStorage.setItem("temaPreferido", modo);
});

// Inicialización
window.addEventListener("DOMContentLoaded", () => {
  aplicarTema();
  cargarPreguntasGuardadas();
  cargarMensajesGuardados();
  actualizarRanking();

  const usuario = localStorage.getItem("usuarioActivo");
  const bienvenida = document.getElementById("bienvenida");
  const logoutBtn = document.getElementById("btn-logout");

  if (usuario && bienvenida && logoutBtn) {
    bienvenida.textContent = `Hola, ${usuario}!`;
    logoutBtn.classList.remove("hidden");
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("usuarioActivo");
      window.location.href = "login.html";
    });
  }

  document.getElementById("btn-publicar").addEventListener("click", publicarPregunta);
  document.getElementById("btn-enviar").addEventListener("click", sendMessage);
});
function cargarUsuariosEnChat() {
  const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
  const select = document.getElementById("user-select");
  select.innerHTML = '<option value="">Selecciona usuario</option>';

  usuarios.forEach(u => {
    if (u.usuario !== localStorage.getItem("usuarioActivo")) {
      const option = document.createElement("option");
      option.value = u.usuario;
      option.textContent = u.usuario;
      select.appendChild(option);
    }
  });
}

function cargarUsuariosDePreguntas() {
  const preguntas = JSON.parse(localStorage.getItem("preguntas")) || [];
  const autores = [...new Set(preguntas.map(p => p.autor))];
  const select = document.getElementById("user-select");

  autores.forEach(nombre => {
    if (![...select.options].some(opt => opt.value === nombre) && nombre !== localStorage.getItem("usuarioActivo")) {
      const option = document.createElement("option");
      option.value = nombre;
      option.textContent = nombre;
      select.appendChild(option);
    }
  });
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("autor-chat")) {
    const usuario = e.target.dataset.usuario;
    const select = document.getElementById("user-select");
    select.value = usuario;
    document.getElementById("chat-input").focus();
  }
