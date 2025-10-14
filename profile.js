function obtenerNivel(puntos) {
  if (puntos >= 1000) return "Leyenda";
  if (puntos >= 500) return "Experto";
  if (puntos >= 100) return "Intermedio";
  return "Novato";
}

function cargarPerfil() {
  const usuario = localStorage.getItem("usuarioActivo");
  const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
  const datos = usuarios.find(u => u.usuario === usuario);

  if (datos) {
    document.getElementById("nombre-usuario").textContent = datos.usuario;
    document.getElementById("puntos").textContent = `Reputación: ${datos.puntos || 0} pts`;
    document.getElementById("nivel").textContent = `Nivel: ${obtenerNivel(datos.puntos || 0)}`;
    document.getElementById("bio").value = datos.bio || "";
    if (datos.avatar) {
      document.getElementById("avatar").src = datos.avatar;
    }
  }
}

function guardarBio() {
  const nuevaBio = document.getElementById("bio").value.trim();
  const usuario = localStorage.getItem("usuarioActivo");
  const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
  const index = usuarios.findIndex(u => u.usuario === usuario);

  if (index !== -1) {
    usuarios[index].bio = nuevaBio;
    localStorage.setItem("usuariosRegistrados", JSON.stringify(usuarios));
    alert("Biografía actualizada.");
  }
}

window.addEventListener("DOMContentLoaded", cargarPerfil);
