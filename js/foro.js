document.addEventListener('DOMContentLoaded', () => {
  // 🌤 Saludo personalizado con animación tipo máquina de escribir
  function saludoPersonalizado() {
    const hora = new Date().getHours();
    let mensaje = "👋 ¡Hola, Lucia!";
    if (hora < 12) mensaje = "🌞 Buenos días, Lucia!";
    else if (hora < 18) mensaje = "🌤 Buenas tardes, Lucia!";
    else mensaje = "🌙 Buenas noches, Lucia!";

    const destino = document.getElementById("texto-saludo");
    let i = 0;
    const escribir = () => {
      if (i < mensaje.length) {
        destino.textContent += mensaje.charAt(i);
        i++;
        setTimeout(escribir, 100);
      }
    };
    escribir();
  }

  saludoPersonalizado();

  // 📝 Publicar pregunta
  document.querySelector('.pregunta button').addEventListener('click', () => {
    const titulo = document.querySelector('.pregunta input').value.trim();
    const contenido = document.querySelector('.pregunta textarea').value.trim();
    if (titulo && contenido) {
      const nuevaPregunta = document.createElement('li');
      nuevaPregunta.innerHTML = `<strong>${titulo}</strong> por <em>Lucia</em> — ${contenido} <button>Responder</button>`;
      document.querySelector('.recientes ul').prepend(nuevaPregunta);
      document.querySelector('.pregunta input').value = '';
      document.querySelector('.pregunta textarea').value = '';
    }
  });

  // 💬 Enviar mensaje privado
  document.querySelector('.chat button').addEventListener('click', () => {
    const usuario = document.querySelector('.chat select').value;
    const mensaje = document.querySelector('.chat textarea').value.trim();
    if (usuario !== 'Seleccione usuario' && mensaje) {
      alert(`Mensaje enviado a ${usuario}: ${mensaje}`);
      document.querySelector('.chat textarea').value = '';
    }
  });

  // 🎨 Cambiar tema (claro/oscuro)
  window.cambiarTema = function () {
    const body = document.body;
    if (body.style.backgroundColor === 'white') {
      body.style.backgroundColor = '#0a3d62';
      body.style.color = 'white';
    } else {
      body.style.backgroundColor = 'white';
      body.style.color = '#222';
    }
  };

  // 🚪 Cerrar sesión (simulado)
  window.cerrarSesion = function () {
    alert('Sesión cerrada. Redirigiendo al inicio...');
    window.location.href = 'index.html';
  };
});

