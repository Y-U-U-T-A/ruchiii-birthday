/* ============================================================
   BIRTHDAY CARD — CARD.JS
   Card open animation + Page flip engine
   ============================================================ */

'use strict';

// ---- State ----
let currentPage = 0;
let totalPages   = 0;
let isFlipping   = false;
const PAGE_FLIP_DURATION = 800;

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
  addExtraVideoPages();
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
    }, PAGE_FLIP_DURATION);
  }, PAGE_FLIP_DURATION);
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
  const pageIds = Array.from(document.querySelectorAll('.card-page')).map(page => page.id);

  // Pause ALL card videos first, then play the active one
  document.querySelectorAll('.card-video-player').forEach(v => {
    v.pause();
  });

  const id = pageIds[pageIndex];
  const isVideoPage = id && (id.startsWith('page-v') || id.startsWith('page-extra-video'));
  document.body.classList.toggle('video-mode', pageIndex >= 12);

  // Auto-play video pages
  if (isVideoPage) {
    MusicPlayer.stop();
    const activePage = document.getElementById(id);
    if (activePage) {
      const vid = activePage.querySelector('.card-video-player');
      if (vid) {
        // Let the active memory video provide its own audio.
        vid.muted = false;
        const playVideo = () => {
          vid.currentTime = 0;
          vid.muted = false;
          return vid.play().catch(() => {
            // Autoplay blocked — play muted as fallback
            vid.muted = true;
            vid.play().catch(() => {});
          });
        };
        vid.addEventListener('canplay', playVideo, { once: true });
        vid.addEventListener('error', () => activePage.classList.add('video-error'), { once: true });
        vid.load();
        if (vid.readyState >= 3) playVideo();
        vid.onclick = () => {
          if (vid.paused) playVideo();
        };
      }
    }
  }

  switch(id) {
    case 'page-1':
      Animations.sparkleRain(8);
      break;
    case 'page-9':
      window.jarOpened = false;
      break;
    case 'page-10':
      if (!window.letterWritten) {
        setTimeout(() => startLetterAnimation(), 400);
      }
      break;
    case 'page-final':
      setTimeout(() => Animations.floatHearts(5), 300);
      break;
  }
}

function addExtraVideoPages() {
  const extraVideos = [
    'VID20251125090931.mp4',
    '2025-12-04_b~EiASFU9FcFh1WElFS3ZFREpWOFIwM2E0QzIBD0gDUARgAQ.mp4',
    '2025-12-06_b~EiASFVhiUDBaZ2lxOTVPV0ZOc2I5WGdnWDIBD0gCUARgAQ.mp4',
    '2025-12-06_b~EiASFWhlanBRTG9Xb29VdHBpSGg2NjZwTzIBD0gCUARgAQ.mp4',
    '2025-12-07_b~EiASFUozOEY5amFRYnBPOXQwN2EwZFJmYzIBdEgCUARgAQ.mp4',
    '2025-12-07_b~EiASFUtjRzkyYmY4cFEyRU1CbkM0YlJLdTIBD0gDUARgAQ.mp4',
    '2025-12-07_b~EiASFUx1ek1JSlFPV0VRbUJmcEMzbml0WTIBdEgCUARgAQ.mp4',
    '2025-12-14_b~EiASFXl1RnFpblBkck1KcG9wNlBZZ3VtNDIBD0gCUARgAQ.mp4',
    '2025-12-20_b~EiASFXZ0aE9wSDlzSVBiRUt6djE5bG14QzIBD0gCUARgAQ.mp4',
    '2025-12-27_b~EiASFUlyM09ISkxScnRsbnpIamlJelAyUDIBD0gCUARgAQ.mp4',
    '2025-12-27_b~EiASFWtZVm45YzJwRkdaa2IwVUw0Qm9DdjIBD0gCUARgAQ.mp4',
    '2026-01-12_b~EiASFThNQXYwSzRyTk9jSmVOYWxvU3gzbjIBD0gCUARgAQ.mp4',
    '2026-01-12_b~EiASFUpjYnhHdXppWlFBalFHZDFTbnljdzIBD0gHUARgAQ.mp4',
    '2026-01-17_b~EiASFU0wUDF6TU1iR0JhVnpxREV0YWNBRDIBD0gCUARgAQ.mp4',
    '2026-01-17_b~EiASFWl2M25lQWxtWTBoUjczU2RwVElHcTIBD0gCUARgAQ.mp4',
    '2026-01-17_b~EiASFWwwTEw1eVpRTm5iVnliS3g4aXEzbzIBD0gCUARgAQ.mp4',
    '2026-01-24_b~EiASFVRURVdmUkpJamNnMkV4V3VOY01oQzIBD0gCUARgAQ.mp4',
    '2026-02-09_b~EiASFUtkZHExdENBTzlEMmNWWnpNbEd2SDIBdEgEUARgAQ.mp4',
    '2026-02-13_b~EiASFU5XdFVWY0RRa3VXUGRkMm5sbmo3aTIBD0gCUARgAQ.mp4',
    '2026-02-15_media~Snapchat-2006134805.zip.nomedia.mp4',
    '2026-02-17_b~EiASFUVJcjdBZGpaSUZSdGc5N2JMTEo0YTIBD0gEUARgAQ.mp4',
    '2026-02-19_b~EiASFURhVkRnZGVpbXl6dTlYd1dRSkxvRzIBD0gCUARgAQ.mp4',
    '2026-02-19_b~EiASFVNDZXFGN2t6SnZxYU9ZQThwcHRxYzIBdEgCUARgAQ.mp4',
    '2026-02-19_b~EiASFW9wenRScnFjUEZkVDRaUnpzY1MwcTIBdEgCUARgAQ.mp4',
    '2026-02-23_b~EiASFWhacWF3dDZna0ZVbzU0TGU4OWMzSTIBfUgCUARgAQ.mp4'
  ];
  const container = document.querySelector('.page-container');
  extraVideos.forEach((file, index) => {
    const page = document.createElement('div');
    page.className = 'card-page video-page';
    page.id = `page-extra-video-${index + 1}`;
    page.innerHTML = `<video class="card-video-player" src="assets/videos/${file}" loop playsinline controls preload="auto"></video><div class="video-caption-bar"><span class="vc-emoji">🎥✨</span>Another beautiful memory, saved forever 💖</div>`;
    container.appendChild(page);
  });
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
