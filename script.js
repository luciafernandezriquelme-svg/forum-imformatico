// Calcula el nivel del usuario según sus puntos
function calcularNivel(puntos) {
  if (puntos >= 100) return "Oro";
  if (puntos >= 50) return "Plata";
  return "Bronce";
}

// Genera las insignias visuales según logros
function generarInsignias(datos) {
  let html = "";
  if (datos.puntos >= 10) html += "🎯 ";
  if (datos.respuestas >= 10) html += "💬 ";
  if (datos.top3) html += "🏆 ";
  return html;
}

// Carga el perfil del usuario activo
function cargarPerfil() {
  const usuario = sessionStorage.getItem("usuario");
  if (!usuario) return window.location.href = "login.html";

  const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
  const preguntas = JSON.parse(localStorage.getItem("preguntas")) || [];
  const datos = usuarios.find(u => u.usuario === usuario);
  if (!datos) return;

  // Datos personales
  document.getElementById("nombre-usuario").textContent = datos.nombre || datos.usuario;
  document.getElementById("usuario-id").textContent = datos.usuario;
  document.getElementById("correo-usuario").textContent = datos.correo || "Sin correo";

  // Campos editables
  document.getElementById("bio-input").value = datos.bio || "";
  document.getElementById("intereses-input").value = datos.intereses || "";

  // Puntos, nivel e insignias
  document.getElementById("puntos-usuario").textContent = datos.puntos || 0;
  document.getElementById("nivel-usuario").textContent = calcularNivel(datos.puntos);
  document.getElementById("insignias-usuario").innerHTML = generarInsignias(datos);

  // Avatar
  document.getElementById("avatar-usuario").src = `img/usuarios/${datos.usuario}.png`;
  document.getElementById("avatar-usuario").onerror = () => {
    document.getElementById("avatar-usuario").src = "img/usuarios/default.png";
  };

  // Historial de preguntas
  const historial = preguntas.filter(p => p.autor === usuario);
  const lista = document.getElementById("historial-preguntas");
  lista.innerHTML = "";
  historial.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.titulo} (${p.respuestas.length} respuestas)`;
    lista.appendChild(li);
  });
}

// Guarda los cambios del perfil, incluyendo validación de contraseña
function guardarCambios() {
  const usuario = sessionStorage.getItem("usuario");
  const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
  const index = usuarios.findIndex(u => u.usuario === usuario);
  if (index === -1) return;

  // Actualizar biografía e intereses
  usuarios[index].bio = document.getElementById("bio-input").value.trim();
  usuarios[index].intereses = document.getElementById("intereses-input").value.trim();

  // Validación de contraseña
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

  // Guardar en localStorage
  localStorage.setItem("usuariosRegistrados", JSON.stringify(usuarios));

  // Confirmación visual
  const confirmacion = document.getElementById("confirmacion");
  confirmacion.classList.remove("hidden");
  setTimeout(() => confirmacion.classList.add("hidden"), 2000);

  // Limpiar campos de contraseña
  document.getElementById("password-input").value = "";
  document.getElementById("confirm-password-input").value = "";
}

// Ejecutar al cargar la página
window.addEventListener("DOMContentLoaded", cargarPerfil);

