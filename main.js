const noMessages = [
  'Are you sure? 😏',
  'Think again, Nandini! 💕',
  'No way, try Yes! 😉',
  'Your heart says Yes! ❤️',
  "Don't break my heart! 🥺",
  'I see that smile... Yes? 😄',
];

const hearts = ['❤️', '💕', '💖', '💗', '💘', '💝', '🌹', '✨'];

const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');
const hint = document.getElementById('hint');
const heartsContainer = document.querySelector('.hearts');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');

let messageIndex = 0;
let dodgeCount = 0;
let yesScale = 1;

const createHeart = () => {
  const heart = document.createElement('span');
  heart.className = 'heart';
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDuration = `${8 + Math.random() * 6}s`;
  heart.style.fontSize = `${1 + Math.random() * 1.5}rem`;
  heart.style.opacity = `${0.6 + Math.random() * 0.4}`;
  heartsContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 15000);
};

setInterval(createHeart, 700);

const moveNoButton = () => {
  const bounds = document.body.getBoundingClientRect();
  const buttonBounds = noButton.getBoundingClientRect();
  const maxX = bounds.width - buttonBounds.width - 24;
  const maxY = bounds.height - buttonBounds.height - 24;

  const x = Math.max(16, Math.random() * maxX);
  const y = Math.max(16, Math.random() * maxY);

  noButton.style.position = 'fixed';
  noButton.style.left = `${x}px`;
  noButton.style.top = `${y}px`;

  noButton.textContent = noMessages[messageIndex];
  messageIndex = (messageIndex + 1) % noMessages.length;

  dodgeCount += 1;
  yesScale += 0.08;
  yesButton.style.transform = `scale(${yesScale})`;

  if (dodgeCount >= 3) {
    hint.classList.add('show');
  }
};

noButton.addEventListener('mouseenter', moveNoButton);
noButton.addEventListener('touchstart', (event) => {
  event.preventDefault();
  moveNoButton();
});

yesButton.addEventListener('click', () => {
  window.location.href = 'yes/';
});

const toggleMusic = async () => {
  if (bgMusic.paused) {
    await bgMusic.play();
    musicToggle.textContent = 'Pause music ⏸️';
  } else {
    bgMusic.pause();
    musicToggle.textContent = 'Play music 🎵';
  }
};

musicToggle.addEventListener('click', () => {
  toggleMusic().catch(() => {
    musicToggle.textContent = 'Tap to play 🎵';
  });
});

['click', 'touchstart'].forEach((eventName) => {
  document.body.addEventListener(
    eventName,
    () => {
      if (bgMusic.paused && musicToggle.textContent.includes('Play')) {
        toggleMusic().catch(() => {
          musicToggle.textContent = 'Tap to play 🎵';
        });
      }
    },
    { once: true }
  );
});
