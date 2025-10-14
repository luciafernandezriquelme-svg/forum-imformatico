// 🔐 Seguridad: función para sanitizar entradas
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

// 📝 Publicar pregunta
function publicarPregunta() {
  const nombre = sanitize(document.getElementById("nombre").value.trim());
  const titulo = sanitize(document.getElementById("titulo").value.trim());
  const pregunta = sanitize(document.getElementById("pregunta").value.trim());

  if (nombre && titulo && pregunta) {
    const nuevaPregunta = document.createElement("div");
    nuevaPregunta.classList.add("pregunta", "fade-in");
    nuevaPregunta.innerHTML = `
      <strong>${titulo}</strong>
      <p>por ${nombre}</p>
      <p class="contenido">${pregunta}</p>
    `;
    document.getElementById("lista-preguntas").appendChild(nuevaPregunta);

    document.getElementById("nombre").value = "";
    document.getElementById("titulo").value = "";
    document.getElementById("pregunta").value = "";
  } else {
    alert("Por favor, completa todos los campos.");
  }
}

// 💬 Enviar mensaje al chat
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

// 🎯 Eventos
document.getElementById("btn-publicar").addEventListener("click", publicarPregunta);
document.getElementById("btn-enviar").addEventListener("click", sendMessage);

// ✨ Animación CSS inyectada dinámicamente
const style = document.createElement("style");
style.textContent = `
  .fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
