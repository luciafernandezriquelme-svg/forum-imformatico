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
    document.getElementById
