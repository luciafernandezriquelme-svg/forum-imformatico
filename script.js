// Redirigir si no hay sesión activa
if (!localStorage.getItem("usuarioActivo")) {
  window.location.href = "login.html";
}

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

// Preguntas
function publicarPregunta() {
  const nombre = sanitize(document.getElementById("nombre").value.trim());
  const titulo = sanitize(document.getElementById("titulo").value.trim());
  const pregunta = sanitize(document.getElementById("pregunta").value.trim());

  if (nombre && titulo && pregunta) {
    const nueva = { nombre, titulo, pregunta };
    guardarPregunta(nueva);
    mostrarPregunta(nueva);

    document.getElementById("nombre").value = "";
    document.getElementById("titulo").value = "";
    document.getElementById("pregunta").value = "";
  } else {
    alert("Por favor, completa todos los campos.");
  }
}

function guardarPregunta(pregunta) {
  const preguntas = JSON.parse(localStorage.getItem("preguntas")) || [];
  preguntas.push(pregunta);
  localStorage.setItem("preguntas", JSON.stringify(preguntas));
}

function mostrarPregunta({ nombre, titulo, pregunta }) {
  const nuevaPregunta = document.createElement("div");
  nuevaPregunta.classList.add("pregunta", "fade-in");
  nuevaPregunta.innerHTML = `
    <strong>${titulo}</strong>
    <p>por ${nombre}</p
