// Determinar nivel según puntos
function obtenerNivel(puntos) {
  if (puntos >= 1000) return "Leyenda";
  if (puntos >= 500) return "Experto";
  if (puntos >= 100) return "Intermedio";
  return "Novato";
}

// Cargar datos del perfil al iniciar la página
function cargarPerfil() {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
  const datos = usuarios.find(u => u.usuario === usuarioActivo);

  if (!datos) return;

  const nombreUsuario = document.getElementById("nombre-usuario");
  const puntos = document.getElementById("puntos");
  const nivel = document.getElementById("nivel");
  const bio = document.getElementById("bio");
  const avatar = document.getElementById("avatar");

  if (nombreUsuario) nombreUsuario.textContent = datos.usuario;
  if (puntos) puntos.textContent = `Reputación: ${datos.puntos || 0} pts`;
  if (nivel) nivel.textContent = `Nivel: ${obtenerNivel(datos.puntos || 0)}`;
  if (bio) bio.value = datos.bio || "";
  if (avatar && datos.avatar) avatar.src = datos.avatar;
}

// Guardar biografía actualizada
function guardarBio() {
  const bioInput = document.getElementById("bio");
  const nuevaBio = bioInput?.value.trim();
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
  const index = usuarios.findIndex(u => u.usuario === usuarioActivo);

  if (index !== -1) {
    usuarios[index].bio = nuevaBio;
    localStorage.setItem("usuariosRegistrados", JSON.stringify(usuarios));
    alert("Biografía actualizada.");
  }
}

// Inicializar perfil al cargar la página
window.addEventListener("DOMContentLoaded", cargarPerfil);


