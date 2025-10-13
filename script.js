function getAvatar(username) {
  return localStorage.getItem(`avatar_${username}`) || '👤';
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
    timestamp: new Date().toISOString(),
    reactions: {}
  };

  const key = `chat_${currentUser}_to_${user}`;
  const history = JSON.parse(localStorage.getItem(key)) || [];
  history.push(message);
  localStorage.setItem(key, JSON.stringify(history));

  input.value = '';
  loadChatHistory(currentUser);
}

function toggleChat() {
  const chat = document.querySelector('.chat-container');
  chat.style.display = chat.style.display === 'none' ? 'flex' : 'none';
}

function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const avatar = document.getElementById('avatar').value;

  if (username && password) {
    localStorage.setItem('forumUser', username);
    localStorage.setItem(`avatar_${username}`, avatar);
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
  const searchInput = document.getElementById('search-input');

  const updateMessages = () => {
    messages.innerHTML = '';
    const selectedUser = userSelect.value;
    if (!selectedUser) return;

    const key = `chat_${currentUser}_to_${selectedUser}`;
    const history = JSON.parse(localStorage.getItem(key)) || [];
    const query = searchInput.value.toLowerCase();

    history.forEach((msg, index) => {
      if (!msg.text.toLowerCase().includes(query)) return;

      const div = document.createElement('div');
      div.className = 'chat-message ' + (msg.from === currentUser ? 'right' : 'left');
      const avatar = getAvatar(msg.from);
      div.textContent = `${avatar} ${msg.from} a ${msg.to}: ${msg.text}`;

      const reactionDiv = document.createElement('div');
      reactionDiv.className = 'reactions';
      ['👍', '❤️', '🤔'].forEach(icon => {
        const span = document.createElement('span');
        span.textContent = icon;
        span.onclick = () => {
          msg.reactions[icon] = (msg.reactions[icon] || 0) + 1;
          localStorage.setItem(key, JSON.stringify(history));
          loadChatHistory(currentUser);
        };
        reactionDiv.appendChild(span);
        if (msg.reactions[icon]) {
          const count = document.createElement('span');
          count.textContent = ` ${msg.reactions[icon]}`;
          reactionDiv.appendChild(count);
        }
      });

      div.appendChild(reactionDiv);
      messages.appendChild(div);
    });

    messages.scrollTop = messages.scrollHeight;
  };

  userSelect.removeEventListener('change', updateMessages);
  userSelect.addEventListener('change', updateMessages);
  searchInput.removeEventListener('input', updateMessages);
  searchInput

