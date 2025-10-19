// Validar formato de correo electrónico
function esCorreoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

// Encriptar texto base64 (simple hash para almacenamiento local)
function hash(texto) {
  return btoa(unescape(encodeURIComponent(texto)));
}

// Mostrar mensaje de estado en pantalla
function mostrarMensaje(texto) {
  const mensaje = document.getElementById("mensaje");
  if (mensaje) {
    mensaje.textContent = texto;
    mensaje.classList.remove("hidden");
  }
}

// Registrar nuevo usuario
function registrarse() {
  const correoInput = document.getElementById("correo");
  const usuarioInput = document.getElementById("usuario");
  const claveInput = document.getElementById("clave");

  const correo = correoInput?.value.trim();
  const usuario = usuarioInput?.value.trim();
  const clave = claveInput?.value.trim();

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
    usuarios.push({
      correo,
      usuario,
      clave: hash(clave),
      bio: "",
      avatar: "",
      puntos: 0
    });
    localStorage.setItem("usuariosRegistrados", JSON.stringify(usuarios));
    mostrarMensaje("Registro exitoso. Ahora puedes iniciar sesión.");

    correoInput.value = "";
    usuarioInput.value = "";
    claveInput.value = "";
  }
}

// Iniciar sesión de usuario
function iniciarSesion() {
  const correoInput = document.getElementById("correo");
  const claveInput = document.getElementById("clave");

  const correo = correoInput?.value.trim();
  const clave = claveInput?.value.trim();

  if (!correo || !clave) {
    mostrarMensaje("Completa todos los campos.");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];
  const encontrado = usuarios.find(u => u.correo === correo && u.clave === hash(clave));

  if (encontrado) {
    sessionStorage.setItem("usuario", encontrado.usuario);
    window.location.href = "index.html";
  } else {
    mostrarMensaje("Correo o contraseña incorrectos.");
  }
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
    // ✅ Guardamos el usuario en sessionStorage para uso temporal
    sessionStorage.setItem("usuario", encontrado.usuario);
    window.location.href = "index.html";
  } else {
    mostrarMensaje("Correo o contraseña incorrectos.");
  }
}
