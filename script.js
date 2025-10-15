// Mostrar saludo personalizado
document.addEventListener("DOMContentLoaded", () => {
  const usuario = sessionStorage.getItem("usuario") || "Lucia";
  const bienvenida = document.getElementById("bienvenida");
  if (bienvenida) bienvenida.textContent = `Hola, ${usuario}!`;

  cargarPreguntas();
  cargarUsuariosChat();
});

// Cambiar tema claro/oscuro
document.getElementById("btn-tema")?.addEventListener("click", () => {
  const body = document.body;
  const esOscuro = body.classList.contains("modo-oscuro");
  body.classList.toggle("modo-oscuro", !esOscuro);
  body.classList.toggle("modo-claro", esOscuro);
  localStorage.setItem("tema", esOscuro ? "claro" : "oscuro");
});

// Cerrar sesión
document.getElementById("btn-logout")?.addEventListener("click", () => {
  sessionStorage.removeItem("usuario");
  window.location.href = "login.html";
});

// Publicar pregunta
document.getElementById("btn-publicar")?.addEventListener("click", () => {
  const titulo = document.getElementById("titulo").value.trim();
  const contenido = document.getElementById("pregunta").value.trim();
  const autor = sessionStorage.getItem("usuario") || "Lucia";

  if (!titulo || !contenido) return;

  const preguntas = JSON.parse(localStorage.getItem("preguntas")) || [];
  preguntas.push({ titulo, contenido, autor });
  localStorage.setItem("preguntas", JSON.stringify(preguntas));

  document.getElementById("titulo").value = "";
  document.getElementById("pregunta").value = "";
  cargarPreguntas();
});

// Mostrar preguntas recientes
function cargarPreguntas() {
  const preguntas = JSON.parse(localStorage.getItem("preguntas")) || [];
  const lista = document.getElementById("lista-preguntas");
  if (!lista) return;
  lista.innerHTML = "";

  preguntas.forEach(p => {
    const div = document.createElement("div");
    div.className = "tarjeta-pregunta";
    div.innerHTML = `
      <h3>${p.titulo}</h3>
      <p class="autor">por ${p.autor}</p>
      <p class="contenido">${p.contenido}</p>
      <button>Responder</button>
    `;
    lista.appendChild(div);
  });
}

// Cargar usuarios en el chat privado
function cargarUsuariosChat() {
  const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
  const select = document.getElementById("user-select");
  if (!select) return;

  usuarios.forEach(u => {
    const option = document.createElement("option");
    option.value = u.usuario;
    option.textContent = u.usuario;
    select.appendChild(option);
  });
}

// Enviar mensaje privado
document.getElementById("btn-enviar")?.addEventListener("click", () => {
  const de = sessionStorage.getItem("usuario") || "Lucia";
  const para = document.getElementById("user-select").value;
  const mensaje = document.getElementById("chat-input").value.trim();

  if (!para || !mensaje) return;

  const chats = JSON.parse(localStorage.getItem("chatsPrivados")) || [];
  chats.push({ de, para, mensaje });
  localStorage.setItem("chatsPrivados", JSON.stringify(chats));

  document.getElementById("chat-input").value = "";
  mostrarMensajesChat(de, para);
});

// Mostrar mensajes del chat
function mostrarMensajesChat(usuario, destinatario) {
  const chats = JSON.parse(localStorage.getItem("chatsPrivados")) || [];
  const panel = document.getElementById("chat-messages");
  if (!panel) return;

  const mensajes = chats.filter(c =>
    (c.de === usuario && c.para === destinatario) ||
    (c.de === destinatario && c.para === usuario)
  );

  panel.innerHTML = "";
  mensajes.forEach(m => {
    const msg = document.createElement("p");
    msg.textContent = `${m.de}: ${m.mensaje}`;
    panel.appendChild(msg);
  });
}

// Emojis en el chat
document.querySelectorAll("#emoji-panel span").forEach(e => {
  e.addEventListener("click", () => {
    const input = document.getElementById("chat-input");
    input.value += e.textContent;
    input.focus();
  });
});

