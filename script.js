function getAvatar(username) {
  return localStorage.getItem(`avatar_${username}`) || '👤';
}

function getReputation(username) {
  return parseInt(localStorage.getItem(`reputation_${username}`)) || 0;
}

function addReputation(username, type) {
  let points = 0;
  if (type === '👍') points = 1;
  if (type === '❤️') points = 2;
  if (type === '🤔') points = 1;
  const current = getReputation(username);
  localStorage.setItem(`reputation_${username}`, current + points);
}

function getLevel(points) {
  if (points >= 20) return 'Experta';
  if (points >= 10) return 'Colaboradora';
  return 'Novata';
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
    document.querySelector('.chat-container').style.display = 'block';
    loadChatHistory(username);
    updateRanking();
  } else {
    alert('Por favor, completa todos los campos.');
  }
}

function sendMessage(event) {
  event.preventDefault();
  const input = document.getElementById('chat-input');
  const user = document.getElementById('user-select').value;
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

    history.forEach((msg) => {
      if (!msg.text.toLowerCase().includes(query)) return;

      const div = document.createElement('div');
      div.className = 'chat-message ' + (msg.from === currentUser ? 'right' : 'left');
      const avatar = getAvatar(msg.from);
      const rep = getReputation(msg.from);
      const level = getLevel(rep);
      div.textContent = `${avatar} ${msg.from} (${rep}⭐ - ${level}) a ${msg.to}: ${msg.text}`;

      const reactionDiv = document.createElement('div');
      reactionDiv.className = 'reactions';
      ['👍', '❤️', '🤔'].forEach(icon => {
        const span = document.createElement('span');
        span.textContent = icon;
        span.onclick = () => {
          msg.reactions[icon] = (msg.reactions[icon] || 0) + 1;
          addReputation(msg.from, icon);
          localStorage.setItem(key, JSON.stringify(history));
          loadChatHistory(currentUser);
          updateRanking();
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
  searchInput.addEventListener('input', updateMessages);
  updateMessages();
}

function updateRanking() {
  const rankingList = document.getElementById('ranking-list');
  if (!rankingList) return;

  const users = ['Ana', 'Luis', 'Marta', 'Pedro'];
  const ranked = users.map(name => ({
    name,
    avatar: getAvatar(name),
    points: getReputation(name),
    level: getLevel(getReputation(name))
  })).sort((a, b) => b.points - a.points);

  rankingList.innerHTML = '';
  ranked.forEach(user => {
    const li = document.createElement('li');
    li.textContent = `${user.avatar} ${user.name} (${user.points}⭐ - ${user.level})`;
    rankingList.appendChild(li);
  });
}

document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

window.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('forumUser');
  if (user) {
    document.getElementById('login-screen').style.display = 'none';
    document.querySelector('.chat-container').style.display = 'block';
    loadChatHistory(user);
    updateRanking();
  }
});

