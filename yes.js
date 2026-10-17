const slides = [
  {
    title: '🎉 I Knew It!',
    text: 'You just made me the happiest person alive, Nandini. I’m grinning like a fool right now.',
  },
  {
    title: '🤓 My Favourite Listener',
    text: "You sit through my longest, nerdiest tech rants—and somehow don’t run away. You’re my favorite listener, and I’m grateful for you.",
  },
  {
    title: '😂 The Laugh That Fixes Everything',
    text: 'One laugh from you and the worst day just… resets. You turn my bad mood around without even trying.',
  },
  {
    title: '😍 Stunning, Inside & Out',
    text: 'I could write a whole essay, but short version: you’re stunning and kind, and people feel it.',
  },
  {
    title: '✨ That Sparkle',
    text: 'When your eyes light up, I lose my words. Every single time.',
  },
  {
    title: '🌹 You Feel Like Home',
    text: 'Talking to you feels like home. No matter what’s going on, you make everything feel steady and good.',
  },
];

const hearts = ['❤️', '💕', '💖', '💗', '💘', '💝', '🌹', '✨'];

const slideTitle = document.getElementById('slideTitle');
const slideText = document.getElementById('slideText');
const slideCard = document.getElementById('slideCard');
const dotsContainer = document.getElementById('dots');
const finalMessage = document.getElementById('finalMessage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const heartsContainer = document.querySelector('.hearts');
const confettiCanvas = document.getElementById('confetti');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');

let currentIndex = 0;
let confettiActive = false;

const createHeart = () => {
  const heart = document.createElement('span');
  heart.className = 'heart';
  heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDuration = `${8 + Math.random() * 6}s`;
  heart.style.fontSize = `${1 + Math.random() * 1.6}rem`;
  heart.style.opacity = `${0.6 + Math.random() * 0.4}`;
  heartsContainer.appendChild(heart);
  setTimeout(() => heart.remove(), 15000);
};

setInterval(createHeart, 700);

const renderDots = () => {
  dotsContainer.innerHTML = '';
  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = `dot ${index === currentIndex ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
};

const updateSlide = () => {
  const slide = slides[currentIndex];
  slideCard.style.opacity = '0';
  slideCard.style.transform = 'translateY(12px)';

  setTimeout(() => {
    slideTitle.textContent = slide.title;
    slideText.textContent = slide.text;
    slideCard.style.opacity = '1';
    slideCard.style.transform = 'translateY(0)';
    finalMessage.hidden = currentIndex !== slides.length - 1;
    renderDots();
    handleConfetti();
  }, 150);

  prevBtn.disabled = currentIndex === 0;
  nextBtn.textContent = currentIndex === slides.length - 1 ? 'Replay' : 'Next';
};

const goToSlide = (index) => {
  currentIndex = index;
  updateSlide();
};

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    goToSlide(currentIndex - 1);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentIndex < slides.length - 1) {
    goToSlide(currentIndex + 1);
  } else {
    goToSlide(0);
  }
});

let touchStartX = 0;
let touchEndX = 0;

const handleSwipe = () => {
  const distance = touchStartX - touchEndX;
  if (Math.abs(distance) < 40) {
    return;
  }
  if (distance > 0 && currentIndex < slides.length - 1) {
    goToSlide(currentIndex + 1);
  }
  if (distance < 0 && currentIndex > 0) {
    goToSlide(currentIndex - 1);
  }
};

slideCard.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].clientX;
});

slideCard.addEventListener('touchend', (event) => {
  touchEndX = event.changedTouches[0].clientX;
  handleSwipe();
});

const confettiCtx = confettiCanvas.getContext('2d');
const confettiPieces = [];

const resizeConfetti = () => {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
};

const spawnConfetti = () => {
  confettiPieces.length = 0;
  for (let i = 0; i < 140; i += 1) {
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      radius: 4 + Math.random() * 4,
      color: `hsl(${Math.random() * 360} 90% 70%)`,
      speed: 2 + Math.random() * 3,
      tilt: Math.random() * 10,
    });
  }
};

const drawConfetti = () => {
  if (!confettiActive) {
    return;
  }
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach((piece) => {
    confettiCtx.beginPath();
    confettiCtx.fillStyle = piece.color;
    confettiCtx.ellipse(piece.x, piece.y, piece.radius, piece.radius * 1.4, piece.tilt, 0, Math.PI * 2);
    confettiCtx.fill();
    piece.y += piece.speed;
    piece.x += Math.sin(piece.y / 30) * 0.6;
    if (piece.y > confettiCanvas.height + 20) {
      piece.y = -20;
    }
  });
  requestAnimationFrame(drawConfetti);
};

const handleConfetti = () => {
  const isFinal = currentIndex === slides.length - 1;
  confettiActive = isFinal;
  if (isFinal) {
    resizeConfetti();
    spawnConfetti();
    drawConfetti();
  } else {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
};

window.addEventListener('resize', resizeConfetti);
resizeConfetti();
updateSlide();

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
