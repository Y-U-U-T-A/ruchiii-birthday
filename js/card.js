/* ============================================================
   BIRTHDAY CARD — CARD.JS
   Card open animation + Page flip engine
   ============================================================ */

'use strict';

// ---- State ----
let currentPage = 0;
let totalPages   = 0;
let isFlipping   = false;

// ---- DOM refs ----
const loadingScreen   = document.getElementById('loading-screen');
const cardClosed      = document.getElementById('card-closed');
const cardOpen        = document.getElementById('card-open');
const cardInnerReveal = document.getElementById('card-inner-reveal');
const pageNav         = document.getElementById('page-nav');
const prevBtn         = document.getElementById('prev-btn');
const nextBtn         = document.getElementById('next-btn');
const pageIndicator   = document.getElementById('page-indicator');

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  const pages = document.querySelectorAll('.card-page');
  totalPages = pages.length;

  // Hide loading after fonts/assets settle
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    startGlitter();
  }, 1800);

  // Wire nav
  prevBtn.addEventListener('click', () => flipPage(-1));
  nextBtn.addEventListener('click', () => flipPage(1));

  // Card cover click → open
  cardClosed.addEventListener('click', openCard);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') flipPage(1);
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   flipPage(-1);
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      flipPage(dx < 0 ? 1 : -1);
    }
  }, { passive: true });
});

// ---- Open Card Animation ----
function openCard() {
  // Play open sound
  SoundManager.playPageFlip();

  // Animate cover away
  cardClosed.classList.add('opening');

  // Show inner reveal
  setTimeout(() => {
    cardInnerReveal.classList.add('active');
    // Confetti burst on reveal
    Animations.confettiBurst(6);
  }, 600);

  // After reveal display, fade it out → show pages
  setTimeout(() => {
    cardInnerReveal.classList.add('fade-out');
  }, 3200);

  setTimeout(() => {
    cardInnerReveal.classList.remove('active', 'fade-out');
    cardClosed.style.display = 'none';
    cardOpen.classList.add('visible');
    pageNav.style.display = 'flex';
    showPage(0);
    // Try to start music
    MusicPlayer.start();
  }, 4000);
}

// ---- Page Navigation ----
function flipPage(direction) {
  if (isFlipping) return;

  const newPage = currentPage + direction;
  if (newPage < 0 || newPage >= totalPages) return;

  isFlipping = true;

  const pages = document.querySelectorAll('.card-page');
  const currentEl = pages[currentPage];
  const nextEl     = pages[newPage];

  // Sound
  SoundManager.playPageFlip();

  // Spark mini effect
  Animations.sparkleAtCenter(3);

  // Flip out current
  currentEl.classList.remove('active');
  currentEl.classList.add(direction > 0 ? 'flipping-out' : 'flipping-in-reverse');

  setTimeout(() => {
    currentEl.classList.remove('flipping-out', 'flipping-in-reverse');
    currentEl.style.display = 'none';

    // Flip in next
    currentEl.style.display = '';
    nextEl.classList.add('flipping-in');
    nextEl.classList.add('active');
    nextEl.style.display = 'flex';

    currentPage = newPage;
    updateNav();

    setTimeout(() => {
      nextEl.classList.remove('flipping-in');
      isFlipping = false;
      // Trigger page-specific effects
      onPageEnter(currentPage);
    }, 500);
  }, 450);
}

function showPage(index) {
  const pages = document.querySelectorAll('.card-page');
  pages.forEach((p, i) => {
    p.classList.remove('active');
    p.style.display = 'none';
  });
  pages[index].classList.add('active');
  pages[index].style.display = 'flex';
  currentPage = index;
  updateNav();
  onPageEnter(index);
}

function updateNav() {
  prevBtn.disabled = (currentPage === 0);
  nextBtn.disabled = (currentPage === totalPages - 1);
  pageIndicator.textContent = `${currentPage + 1} / ${totalPages}`;
}

// ---- Page-specific effects on enter ----
function onPageEnter(pageIndex) {
  const pageIds = [
    'page-1', 'page-2', 'page-3', 'page-4',
    'page-5', 'page-6', 'page-7', 'page-8',
    'page-9', 'page-10', 'page-final'
  ];

  const id = pageIds[pageIndex];

  switch(id) {
    case 'page-1':
      Animations.sparkleRain(8);
      break;
    case 'page-9':
      // Reset jar state
      window.jarOpened = false;
      break;
    case 'page-10':
      // Start letter writing effect if not started
      if (!window.letterWritten) {
        setTimeout(() => startLetterAnimation(), 400);
      }
      break;
    case 'page-final':
      // Gentle float hearts
      setTimeout(() => Animations.floatHearts(5), 300);
      break;
  }
}

// ---- Letter typewriter animation ----
let letterAnimRunning = false;

function startLetterAnimation() {
  if (letterAnimRunning || window.letterWritten) return;

  const letterBodyEl = document.getElementById('letter-body');
  if (!letterBodyEl) return;

  letterAnimRunning = true;
  const text = letterBodyEl.getAttribute('data-text') || '';
  letterBodyEl.textContent = '';

  // Add cursor
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  letterBodyEl.appendChild(cursor);

  let i = 0;
  const speed = 28; // ms per char

  function typeChar() {
    if (i < text.length) {
      // Insert char before cursor
      const charNode = document.createTextNode(text[i]);
      letterBodyEl.insertBefore(charNode, cursor);
      i++;
      setTimeout(typeChar, speed);
    } else {
      // Remove cursor when done
      setTimeout(() => {
        cursor.remove();
        window.letterWritten = true;
        letterAnimRunning = false;
      }, 1500);
    }
  }

  typeChar();
}

// ---- Glitter Canvas ----
function startGlitter() {
  const canvas = document.getElementById('glitter-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function spawnParticle() {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.3,
      r: Math.random() * 3 + 1,
      color: ['#FFD700','#FF6B9D','#DDA0DD','#98D8C8','#FFB347'][Math.floor(Math.random()*5)],
      vx: (Math.random() - 0.5) * 1.5,
      vy: Math.random() * 1.5 + 0.5,
      life: 1,
      decay: Math.random() * 0.006 + 0.003
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (Math.random() < 0.4) spawnParticle();

    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
    });

    requestAnimationFrame(draw);
  }

  draw();
}

// ---- Continue Reveal button ----
document.addEventListener('DOMContentLoaded', () => {
  const revealEl = document.getElementById('card-inner-reveal');
  if (revealEl) {
    revealEl.addEventListener('click', () => {
      revealEl.classList.add('fade-out');
      setTimeout(() => {
        revealEl.classList.remove('active', 'fade-out');
        cardClosed.style.display = 'none';
        cardOpen.classList.add('visible');
        pageNav.style.display = 'flex';
        showPage(0);
        MusicPlayer.start();
      }, 800);
    });
  }
});
