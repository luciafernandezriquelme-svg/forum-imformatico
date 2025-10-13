function getAvatar(username) {
  const avatars = {
    Ana: '👩‍💻',
    Luis: '🧑‍🔧',
    Marta: '👩‍🎨',
    Pedro: '🧑‍🏫',
    Lucia: '🦸‍♀️',
    default: '👤'
  };
  return avatars[username] || avatars.default;
}

function sendMessage(event) {
  event.preventDefault();
  const input = document.getElementById('chat-input');
  const user = document.getElementById('user-select').value;
  const messages = document.getElementById('chat-messages');
  const currentUser = localStorage.getItem('forumUser') || 'Tú';

  if (!user) {
    alert('Selecciona un usuario para chatear.');
    return;
  }

  const text = input.value.trim();
  if (!text) return;

  const message = {
    from: currentUser,
    to: user,
    text,
    timestamp: new Date().toISOString()
  };

  const div = document.createElement('div');
  div.className = 'chat-message';
  const avatar = getAvatar(message.from);
  div.textContent = `${avatar} ${message.from} a ${message.to}: ${message.text}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;

  const key = `chat_${currentUser}_to_${user}`;
  const history = JSON.parse(localStorage.getItem(key)) || [];
  history.push(message);
  localStorage.setItem(key, JSON.stringify(history));

  input.value = '';
  loadChatHistory(currentUser); // Recarga el historial actualizado
}

function toggleChat() {
  const chat = document.querySelector('.chat-container');
  chat.style.display = chat.style.display === 'none' ? 'flex' : 'none';
}

function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username && password) {
    localStorage.setItem('forumUser', username);
    document.getElementById('login-screen').style.display = 'none';
    loadChatHistory(username);
    alert(`Bienvenida, ${username}`);
  } else {
    alert('Por favor, completa todos los campos.');
  }
}

function loadChatHistory(currentUser) {
  const userSelect = document.getElementById('user-select');
  const messages = document.getElementById('chat-messages');

  const updateMessages = () => {
    messages.innerHTML = '';
    const selectedUser = userSelect.value;
    if (!selectedUser) return;

    const key = `chat_${currentUser}_to_${selectedUser}`;
    const history = JSON.parse(localStorage.getItem(key)) || [];

    history.forEach(msg => {
      const div = document.createElement('div');
      div.className = 'chat-message';
      const avatar = getAvatar(msg.from);
      div.textContent = `${avatar} ${msg.from} a ${msg.to}: ${msg.text}`;
      messages.appendChild(div);
    });

    messages.scrollTop = messages.scrollHeight;
  };

  userSelect.removeEventListener('change', updateMessages); // Evita duplicados
  userSelect.addEventListener('change', updateMessages);
  updateMessages(); // Carga inicial
}

window.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('forumUser');
  if (user) {
    document.getElementById('login-screen').style.display = 'none';
    loadChatHistory(user);
  }
});

