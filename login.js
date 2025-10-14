function esCorreoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function hash(text) {
  return btoa(unescape(encodeURIComponent(text)));
}

function mostrarMensaje(texto) {
  const mensaje = document.getElementById("mensaje");
  mensaje.textContent = texto;
  mensaje.classList.remove("hidden");
}

function registrarse() {
  const correo = document.getElementById("correo").value.trim();
  const usuario = document.getElementById("usuario").value.trim();
  const clave = document.getElementById("clave").value.trim();

  if (!correo || !usuario || !clave) {
    mostrarMensaje("Completa todos los campos.");
    return;
  }

  if (!esCorreoValido(correo)) {
    mostrarMensaje("Introduce un correo electrónico válido.");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
  const existe = usuarios.find(u => u.correo === correo);

  if (existe) {
    mostrarMensaje("Este correo ya está registrado.");
  } else {
    usuarios.push({ correo, usuario, clave: hash(clave), bio: "", avatar: "", puntos: 0 });
    localStorage.setItem("usuariosRegistrados", JSON.stringify(usuarios));
    mostrarMensaje("Registro exitoso. Ahora puedes iniciar sesión.");
    document.getElementById("correo").value = "";
    document.getElementById("usuario").value = "";
    document.getElementById("clave").value = "";
  }
}

function iniciarSesion() {
  const correo = document.getElementById("correo").value.trim();
  const clave = document.getElementById("clave").value.trim();

  const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
  const encontrado = usuarios.find(u => u.correo === correo && u.clave === hash(clave));

  if (encontrado) {
    localStorage.setItem("usuarioActivo", encontrado.usuario);
    window.location.href = "index.html";
  } else {
    mostrarMensaje("Correo o contraseña incorrectos.");
  }
}
