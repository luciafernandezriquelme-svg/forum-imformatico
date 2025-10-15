// Cargar bienvenida y aplicar tema
document.addEventListener("DOMContentLoaded", () => {
  const usuario = sessionStorage.getItem("usuario");
  if (usuario) {
    const bienvenida = document.getElementById("bienvenida");
    if (bienvenida) bienvenida.textContent = `Hola, ${usuario}!`;
  }

  const temaGuardado = localStorage.getItem("tema");
  if (temaGuardado === "oscuro") {
    document.body.classList.add("modo-oscuro");
  } else {
    document.body.classList.add("modo-claro");
  }

  const btnTema = document.getElementById("btn-tema");
  if (btnTema) {
    btnTema.addEventListener("click", () => {
      const body = document.body;
      const esOscuro = body.classList.contains("modo-oscuro");
      body.classList.toggle("modo-oscuro", !esOscuro);
      body.classList.toggle("modo-claro", esOscuro);
      localStorage.setItem("tema", esOscuro ? "claro" : "oscuro");
    });
  }

  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      sessionStorage.removeItem("usuario");
      window.location.href = "login.html";
    });
  }

  cargarPreguntas();
  cargarUsuariosChat();
  cargarPerfil();
});

// Publicar pregunta
document.getElementById("btn-publicar")?.addEventListener("click", () => {
  const titulo = document.getElementById("titulo").value.trim();
  const contenido = document.getElementById("pregunta").value.trim();
  const autor = sessionStorage.getItem("usuario");
  if (!titulo || !contenido || !autor) return;

  const preguntas = JSON.parse(localStorage.getItem("preguntas")) || [];
  preguntas.push({ titulo, contenido, autor, respuestas: [] });
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

// Chat privado con emojis
document.getElementById("btn-enviar")?.addEventListener("click", () => {
  const usuario = sessionStorage.getItem("usuario");
  const destinatario = document.getElementById("user-select").value;
  const mensaje = document.getElementById("chat-input").value.trim();
  if (!usuario || !destinatario || !mensaje) return;

  const chats = JSON.parse(localStorage.getItem("chatsPrivados")) || [];
  chats.push({ de: usuario, para: destinatario, mensaje });
  localStorage.setItem("chatsPrivados", JSON.stringify(chats));

  document.getElementById("chat-input").value = "";
  mostrarMensajesChat(usuario, destinatario);
});

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

// Emojis en chat
document.querySelectorAll("#emoji-panel span").forEach(e => {
  e.addEventListener("click", () => {
    const input = document.getElementById("chat-input");
    input.value += e.textContent;
    input.focus();
  });
});

// Perfil editable
function calcularNivel(puntos) {
  if (puntos >= 100) return "Oro";
  if (puntos >= 50) return "Plata";
  return "Bronce";
}

function generarInsignias(datos) {
  let html = "";
  if (datos.puntos >= 10) html += "🎯 ";
  if (datos.respuestas >= 10) html += "💬 ";
  if (datos.top3) html += "🏆 ";
  return html;
}

function cargarPerfil() {
  const usuario = sessionStorage.getItem("usuario");
  if (!usuario) return;

  const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
  const preguntas = JSON.parse(localStorage.getItem("preguntas")) || [];
  const datos = usuarios.find(u => u.usuario === usuario);
  if (!datos) return;

  document.getElementById("nombre-usuario").textContent = datos.nombre || datos.usuario;
  document.getElementById("usuario-id").textContent = datos.usuario;
  document.getElementById("correo-usuario").textContent = datos.correo || "Sin correo";
  document.getElementById("bio-input").value = datos.bio || "";
  document.getElementById("intereses-input").value = datos.intereses || "";
  document.getElementById("puntos-usuario").textContent = datos.puntos || 0;
  document.getElementById("nivel-usuario").textContent = calcularNivel(datos.puntos);
  document.getElementById("insignias-usuario").innerHTML = generarInsignias(datos);

  const avatar = datos.avatarBase64 || `img/usuarios/${datos.usuario}.png`;
  const avatarEl = document.getElementById("avatar-usuario");
  avatarEl.src = avatar;
  avatarEl.onerror = () => {
    avatarEl.src = "img/usuarios/default.png";
  };

  const historial = preguntas.filter(p => p.autor === usuario);
  const lista = document.getElementById("historial-preguntas");
  lista.innerHTML = "";
  historial.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.titulo} (${p.respuestas.length} respuestas)`;
    lista.appendChild(li);
  });
}

// Guardar cambios en perfil
function guardarCambios() {
  const usuario = sessionStorage.getItem("usuario");
  const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
  const index = usuarios.findIndex(u => u.usuario === usuario);
  if (index === -1) return;

  usuarios[index].bio = document.getElementById("bio-input").value.trim();
  usuarios[index].intereses = document.getElementById("intereses-input").value.trim();

  const nuevaPass = document.getElementById("password-input").value.trim();
  const confirmPass = document.getElementById("confirm-password-input").value.trim();
  const errorMsg = document.getElementById("password-error");
  errorMsg.classList.add("hidden");
  errorMsg.textContent = "";

  if (nuevaPass || confirmPass) {
    if (nuevaPass.length < 6) {
      errorMsg.textContent = "La contraseña debe tener al menos 6 caracteres.";
      errorMsg.classList.remove("hidden");
      return;
    }
    if (nuevaPass !== confirmPass) {
      errorMsg.textContent = "Las contraseñas no coinciden.";
      errorMsg.classList.remove("hidden");
      return;
    }
    usuarios[index].contraseña = nuevaPass;
  }

  localStorage.setItem("usuariosRegistrados", JSON.stringify(usuarios));

  const confirmacion = document.getElementById("confirmacion");
  confirmacion.classList.remove("hidden");
  setTimeout(() => confirmacion.classList.add("hidden"), 2000);

  document.getElementById("password-input").value = "";
  document.getElementById("confirm-password-input").value = "";
}

// Subida de avatar
document.getElementById("avatar-input")?.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById("avatar-usuario").src = e.target.result;

