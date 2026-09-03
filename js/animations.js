/* ============================================================
   BIRTHDAY CARD — ANIMATIONS.JS
   Confetti, fireworks, floating hearts, sparkles
   ============================================================ */

'use strict';

const Animations = {

  // ---- Confetti Burst ----
  confettiBurst(intensity = 8) {
    const colors = ['#FF6B9D','#FFD700','#DDA0DD','#98D8C8','#FF8C42','#4FC3F7','#F48FB1','#A5D6A7'];
    const count  = intensity * 20;
    const centerX = window.innerWidth / 2;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        const size = Math.random() * 10 + 5;
        el.style.cssText = `
          left: ${centerX + (Math.random() - 0.5) * 300}px;
          width: ${size}px;
          height: ${size}px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
          animation-duration: ${Math.random() * 2 + 2}s;
          animation-delay: ${Math.random() * 0.5}s;
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 4000);
      }, i * 15);
    }
  },

  // ---- Fireworks ----
  fireworks(x, y) {
    const colors = ['#FF6B9D','#FFD700','#DDA0DD','#4FC3F7','#FF8C42','#A5D6A7'];
    const rays   = 12;

    for (let i = 0; i < rays; i++) {
      const angle  = (i / rays) * Math.PI * 2;
      const length = Math.random() * 80 + 40;
      const color  = colors[Math.floor(Math.random() * colors.length)];

      const el = document.createElement('div');
      el.style.cssText = `
        position: fixed;
        left: ${x}px; top: ${y}px;
        width: 5px; height: 5px;
        border-radius: 50%;
        background: ${color};
        box-shadow: 0 0 6px ${color};
        pointer-events: none;
        z-index: 9000;
        transform: translate(-50%, -50%);
        transition: transform 0.8s ease, opacity 0.8s ease;
        opacity: 1;
      `;
      document.body.appendChild(el);

      setTimeout(() => {
        el.style.transform = `translate(calc(-50% + ${Math.cos(angle) * length}px), calc(-50% + ${Math.sin(angle) * length}px)) scale(0)`;
        el.style.opacity   = '0';
      }, 50);

      setTimeout(() => el.remove(), 1000);
    }
  },

  // ---- Fireworks Show ----
  fireworkShow() {
    const positions = [
      [0.2, 0.3], [0.8, 0.2], [0.5, 0.15],
      [0.15, 0.5], [0.85, 0.45], [0.35, 0.25],
      [0.65, 0.35], [0.5, 0.5]
    ];

    positions.forEach(([rx, ry], i) => {
      setTimeout(() => {
        this.fireworks(
          rx * window.innerWidth,
          ry * window.innerHeight
        );
      }, i * 300);
    });
  },

  // ---- Floating Hearts ----
  floatHearts(count = 6) {
    const emojis = ['❤️','💕','💖','💗','💝','💓','🌸','✨'];
    const container = document.querySelector('.card-page.active') || document.body;
    const rect = container.getBoundingClientRect();

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'float-heart';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.cssText = `
          position: fixed;
          left: ${rect.left + Math.random() * rect.width}px;
          top: ${rect.top + rect.height * 0.6}px;
          font-size: ${Math.random() * 1.2 + 0.8}rem;
          pointer-events: none;
          z-index: 500;
          animation: floatHeart ${Math.random() * 1 + 1.5}s ease forwards;
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2500);
      }, i * 200);
    }
  },

  // ---- Sparkle at Center ----
  sparkleAtCenter(count = 4) {
    const emojis = ['✨','⭐','💫','🌟'];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.style.cssText = `
          position: fixed;
          left: ${30 + Math.random() * 40}vw;
          top:  ${20 + Math.random() * 60}vh;
          font-size: ${Math.random() * 1.4 + 0.8}rem;
          pointer-events: none;
          z-index: 500;
          animation: sparkle 0.9s ease forwards;
        `;
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1000);
      }, i * 120);
    }
  },

  // ---- Sparkle Rain ----
  sparkleRain(count = 10) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => this.sparkleAtCenter(2), i * 180);
    }
  },

  // ---- Memory Jar Explosion ----
  jarBurst(jarEl, notes) {
    if (!jarEl) return;
    const rect = jarEl.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const cy   = rect.top;

    notes.forEach((text, i) => {
      setTimeout(() => {
        const note = document.createElement('div');
        note.className = 'jar-note';

        // Assign pastel background
        const colors = ['#FEFBA7','#FFD6E7','#D4EDFF','#D4FFDC','#EDD4FF','#FFE5CC'];
        note.style.background = colors[i % colors.length];

        note.textContent = text;

        const spreadX = (Math.random() - 0.5) * 280;
        const startTop = cy - 20;

        note.style.cssText += `
          left: ${cx + spreadX - 100}px;
          top: ${startTop}px;
          animation-duration: ${Math.random() * 1.5 + 2}s;
          animation-delay: ${i * 0.15}s;
          transform: rotate(${(Math.random() - 0.5) * 30}deg);
          z-index: 500;
          background: ${colors[i % colors.length]};
        `;

        document.body.appendChild(note);
        setTimeout(() => note.remove(), 4000);
      }, i * 200);
    });

    // Sparkle burst at jar
    this.fireworks(cx, cy);
    this.floatHearts(4);
  },

  // ---- Ultimate Celebration ----
  celebrate() {
    this.confettiBurst(12);
    setTimeout(() => this.fireworkShow(), 500);
    setTimeout(() => this.floatHearts(10), 800);
    setTimeout(() => this.confettiBurst(8), 1500);
    setTimeout(() => this.fireworkShow(), 2000);
    setTimeout(() => this.confettiBurst(6), 3000);
  },

  // ---- Bear Hug Bounce ----
  bearHugBounce() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.textContent = '🧸';
        el.style.cssText = `
          position: fixed;
          left: ${Math.random() * 80 + 10}vw;
          bottom: -100px;
          font-size: ${Math.random() * 3 + 3}rem;
          pointer-events: none;
          z-index: 9999;
          animation: bearBounceUp ${Math.random() * 1.5 + 1.5}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
      }, i * 250);
    }
  },

  // ---- Photo Spam (Clone and throw all photos across the screen) ----
  photoSpam() {
    // Gather all real images on the page
    const photos = Array.from(document.querySelectorAll('.polaroid img')).map(img => img.src);
    if (photos.length === 0) return;

    const stickies = [
      "Our first walk! 🚶‍♀️",
      "Held your hand here! 🤝",
      "That look in your eyes 💖",
      "You goddess! 💋",
      "My favourite click! 🌟",
      "This cute smile 😊",
      "Magical days! ✨",
      "Best friend ever 🎁",
      "Cutest expression! 😍",
      "Too special! 💕",
      "Never forget this day! 🎂",
      "You make me happy 🤭",
      "No crying today! radu nako 🚫",
      "So glad we met! 🌸",
      "Always in my heart! ❤️",
      "More surprises coming! 💫"
    ];

    const spamCount = 16;
    for (let i = 0; i < spamCount; i++) {
      setTimeout(() => {
        const src = photos[i % photos.length];
        
        // Random landing positions
        const randomX = Math.random() * 82 + 2; // 2vw to 84vw
        const randomY = Math.random() * 65 + 10; // 10vh to 75vh
        const randomRot = (Math.random() - 0.5) * 50; // -25deg to +25deg

        // Create a custom mini polaroid container to throw
        const spamDiv = document.createElement('div');
        spamDiv.className = 'spam-polaroid';
        spamDiv.style.cssText = `
          position: fixed;
          width: 130px;
          padding: 8px 8px 18px 8px;
          background: white;
          box-shadow: 0 10px 30px rgba(0,0,0,0.18);
          border: 1px solid #eee;
          border-radius: 4px;
          left: ${randomX}vw;
          top: -250px;
          z-index: 10000;
          pointer-events: auto;
          --land-y: ${randomY}vh;
          --land-rot: ${randomRot}deg;
          animation: throwPhoto ${Math.random() * 1.2 + 1.2}s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          cursor: grab;
        `;

        // Make them draggable so user can move them around
        let isDragging = false;
        let startX, startY, origLeft, origTop;
        
        spamDiv.addEventListener('mousedown', (e) => {
          isDragging = true;
          spamDiv.style.zIndex = 10005; // Bring clicked photo to front
          startX = e.clientX;
          startY = e.clientY;
          const rect = spamDiv.getBoundingClientRect();
          origLeft = rect.left;
          origTop = rect.top;
          spamDiv.style.animation = 'none';
          spamDiv.style.top = origTop + 'px';
          spamDiv.style.left = origLeft + 'px';
        });

        document.addEventListener('mousemove', (e) => {
          if (!isDragging) return;
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          spamDiv.style.left = (origLeft + dx) + 'px';
          spamDiv.style.top = (origTop + dy) + 'px';
        });

        document.addEventListener('mouseup', () => {
          isDragging = false;
        });

        // Touch support for mobile dragging
        spamDiv.addEventListener('touchstart', (e) => {
          isDragging = true;
          spamDiv.style.zIndex = 10005;
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
          const rect = spamDiv.getBoundingClientRect();
          origLeft = rect.left;
          origTop = rect.top;
          spamDiv.style.animation = 'none';
          spamDiv.style.top = origTop + 'px';
          spamDiv.style.left = origLeft + 'px';
        }, { passive: true });

        spamDiv.addEventListener('touchmove', (e) => {
          if (!isDragging) return;
          const dx = e.touches[0].clientX - startX;
          const dy = e.touches[0].clientY - startY;
          spamDiv.style.left = (origLeft + dx) + 'px';
          spamDiv.style.top = (origTop + dy) + 'px';
        }, { passive: true });

        spamDiv.addEventListener('touchend', () => {
          isDragging = false;
        });

        const img = document.createElement('img');
        img.src = src;
        img.style.cssText = `
          width: 100%;
          height: 90px;
          object-fit: cover;
          border-radius: 2px;
          background: #faf8f5;
        `;
        spamDiv.appendChild(img);

        // Add a cute caption
        const caption = document.createElement('div');
        caption.textContent = ['💕', '✨', '💖', '🎂', '🌸', '😘', '😊', '😍'][i % 8];
        caption.style.cssText = `
          font-family: var(--font-note, 'Indie Flower', cursive);
          font-size: 0.75rem;
          text-align: center;
          margin-top: 4px;
          color: #e85a71;
        `;
        spamDiv.appendChild(caption);

        // Attach a cute sticky note to the photo
        const sticky = document.createElement('div');
        const noteColors = ['#FEFBA7', '#FFD6E7', '#D4EDFF', '#D4FFDC', '#EDD4FF', '#FFE5CC'];
        sticky.style.cssText = `
          position: absolute;
          width: 110px;
          padding: 6px;
          background: ${noteColors[i % noteColors.length]};
          box-shadow: 2px 5px 15px rgba(0,0,0,0.12);
          font-family: var(--font-note, 'Indie Flower', cursive);
          font-size: 0.7rem;
          color: #444;
          bottom: -30px;
          left: 10px;
          transform: rotate(${(Math.random() - 0.5) * 20}deg);
          border-radius: 2px;
          text-align: center;
          border: 1px solid rgba(0,0,0,0.05);
        `;
        sticky.textContent = stickies[i % stickies.length];
        spamDiv.appendChild(sticky);

        document.body.appendChild(spamDiv);
      }, i * 180);
    }
  }
};
