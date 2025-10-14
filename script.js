// Redirección si no hay sesión activa
if (!sessionStorage.getItem("usuario")) {
  window.location.href = "login.html";
}

// Sanitización básica
function sanitize(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, char => map[char]);
}

// Publicar pregunta
function publicarPregunta() {
  const titulo = sanitize(document.getElementById("titulo").value.trim());
  const contenido = sanitize(document.getElementById("pregunta").value.trim());
  const autor = sessionStorage.getItem("usuario");

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

// Mostrar pregunta con tarjeta visual y nivel
function mostrarPregunta({ autor, titulo, contenido, respuestas = [] }) {
  const tarjeta = document.createElement("div");
  tarjeta.classList.add("tarjeta-pregunta");

  const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
  const datosAutor = usuarios.find(u => u.usuario === autor);
  let nivel = "Bronce";
  let claseNivel = "nivel-bronce";

  if (datosAutor) {
    const puntos = datosAutor.puntos || 0;
    if (puntos >= 100) {
      nivel = "Oro";
      claseNivel = "nivel-oro";
    } else if (puntos >= 50) {
      nivel = "Plata";
      claseNivel = "nivel-plata";
    }
  }

  const respuestasHTML = respuestas.map(r => `
    <div class="respuesta">
      <p><strong>${r.usuario}:</strong> ${r.texto}</p>
    </div>
  `).join("");

  tarjeta.innerHTML = `
    <div class="cabecera-pregunta">
      <h3 class="titulo-pregunta">${titulo}</h3>
      <span class="autor-pregunta">por <span class="autor-chat" data-usuario="${autor}">${autor}</span></span>
    </div>
    <p class="contenido-pregunta">${contenido}</p>
    <div class="respuestas-pregunta">${respuestasHTML}</div>
    <div class="interaccion-pregunta">
      <textarea class="respuesta-input" placeholder="Escribe tu respuesta..."></textarea>
      <button class="btn-responder">Responder</button>
    </div>
    <div class="nivel-usuario ${claseNivel}">${nivel}</div>
  `;

  tarjeta.querySelector(".btn-responder").addEventListener("click", () => {
    const texto = sanitize(tarjeta.querySelector(".respuesta-input").value.trim());
    const usuario = sessionStorage.getItem("usuario");
    if (!texto) return alert("Escribe una respuesta.");
    const preguntas = JSON.parse(localStorage.getItem("preguntas")) || [];
    const index = preguntas.findIndex(p => p.titulo === titulo && p.autor === autor);
    if (index !== -1) {
      preguntas[index].respuestas.push({ usuario, texto });
      localStorage.setItem("preguntas", JSON.stringify(preguntas));
      tarjeta.querySelector(".respuestas-pregunta").innerHTML += `
        <div class="respuesta">
          <p><strong>${usuario}:</strong> ${texto}</p>
        </div>
      `;
      tarjeta.querySelector(".respuesta-input").value = "";
      sumarPuntos(usuario, 15);
    }
  });

  document.getElementById("lista-preguntas").appendChild(tarjeta);
}

// Cargar preguntas guardadas
function cargarPreguntasGuardadas() {
  const preguntas = JSON.parse(localStorage.getItem("preguntas")) || [];
  preguntas.forEach(mostrarPregunta);
}

// Buscador
document.getElementById("buscador").addEventListener("input", e => {
  const filtro = e.target.value.toLowerCase();
  const preguntas = document.querySelectorAll("#lista-preguntas .tarjeta-pregunta");
  preguntas.forEach(p => {
    const texto = p.textContent.toLowerCase();
    p.style.display = texto.includes(filtro) ? "block" : "none";
  });
});

// Chat privado
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
  nuevoMensaje.classList.add("fade-in");
  chat.appendChild(nuevoMensaje);
}

function cargarMensajesGuardados() {
  const mensajes = JSON.parse(localStorage.getItem("mensajesChat")) || [];
  mensajes.forEach(mostrarMensaje);
}

// Emoji panel
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

// Mostrar usuarios en el chat
function cargarUsuariosEnChat() {
  const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
  const select = document.getElementById("user-select");
  select.innerHTML = '<option value="">Selecciona usuario</option>';

  usuarios.forEach(u => {
    if (u.usuario !== sessionStorage.getItem("usuario")) {
      const option = document.createElement("option");
      option.value = u.usuario;
      option.textContent = u.usuario;
      select.appendChild(option);
    }
  });
}

// Mostrar autores de preguntas en el chat
function cargarUsuariosDePreguntas() {
  const preguntas = JSON.parse(localStorage.getItem("preguntas")) || [];
  const autores = [...new Set(preguntas.map(p => p.autor))];
  const select = document.getElementById("user-select");

  autores.forEach(nombre => {
    if (![...select.options].some(opt => opt.value === nombre) && nombre !== sessionStorage.getItem("usuario")) {
      const option = document.createElement("option");
      option.value = nombre;
      option.textContent = nombre;
      select.appendChild(option);
    }
  });
}

// Seleccionar usuario desde nombre en pregunta
document.addEventListener("click", e => {
  if (e.target.classList.contains("autor-chat")) {
    const usuario = e.target.dataset.usuario;
    const select = document.getElementById("user-select");
    select.value = usuario;
    document.getElementById("chat-input").focus();
  }
});


