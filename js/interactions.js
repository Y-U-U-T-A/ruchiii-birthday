/* ============================================================
   BIRTHDAY CARD — INTERACTIONS.JS
   Hidden surprises, memory jar, memory cards, gift reveal
   Music player, sound manager
   ============================================================ */

'use strict';

// ============================================================
// MUSIC PLAYER
// ============================================================
const MusicPlayer = {
  audio: null,
  playing: false,
  started: false,

  init() {
    // Use a royalty-free birthday/happy melody from a CDN
    // You can replace this URL with any audio file
    this.audio = new Audio();
    this.audio.src = 'assets/audio/WhatsApp Audio 2026-06-18 at 2.26.43 PM.mpeg';
    this.audio.preload = 'auto';
    this.audio.loop = true;
    this.audio.volume = 0.18;

    const btn = document.getElementById('music-toggle');
    if (btn) {
      btn.addEventListener('click', () => this.toggle());
    }

    // When music is OFF, let the background video play its audio instead
    this._syncVideoAudio();
  },

  _syncVideoAudio() {
    const bgVideo = document.getElementById('bg-video');
    if (!bgVideo) return;
    // Start muted; will be unmuted when music is off
    bgVideo.muted = true;
  },

  start() {
    if (!this.audio || this.playing) return;
    this.started = true;
    this.audio.play().then(() => {
      this.playing = true;
      this.updateBtn();
      this._applyVideoAudio();
    }).catch(() => {
      this.started = false;
      this.playing = false;
      this.updateBtn();
    });
  },

  toggle() {
    if (!this.audio) return;
    if (this.playing) {
      this.audio.pause();
      this.playing = false;
      this.updateBtn();
      this._applyVideoAudio();
    } else {
      this.start();
    }
  },

  stop() {
    if (!this.audio) return;
    this.audio.pause();
    this.playing = false;
    this.updateBtn();
  },

  // When music is ON → mute video audio; when music is OFF → unmute video so its sound plays
  _applyVideoAudio() {
    // Sync the background card video
    const bgVideo = document.getElementById('bg-video');
    if (bgVideo) {
      bgVideo.muted = this.playing;
      if (!this.playing) bgVideo.play().catch(() => {});
    }
    // Sync any active video page player
    const activePage = document.querySelector('.card-page.active');
    if (activePage) {
      const vid = activePage.querySelector('.card-video-player');
      if (vid && !vid.paused) {
        vid.muted = this.playing;
      }
    }
  },

  updateBtn() {
    const btn = document.getElementById('music-toggle');
    if (btn) {
      btn.textContent = this.playing ? '🎵 Music On' : '🔇 Music Off';
    }
  }
};

// ============================================================
// SOUND MANAGER
// ============================================================
const SoundManager = {
  // Generate a soft page-flip sound using Web Audio API
  audioCtx: null,

  getCtx() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.audioCtx;
  },

  playPageFlip() {
    // Synth sound muted
  },

  playPop() {
    // Synth sound muted
  },

  playCelebration() {
    // Synth sound muted
  }
};

// ============================================================
// SURPRISE STICKERS
// ============================================================
const SurpriseStickers = {
  config: [
    {
      id:      'surprise-gift',
      emoji:   '🎁',
      title:   'A Gift from the Heart!',
      message: 'Every day with you is a gift, Ruchii! You bring joy wherever you go. Here\'s to celebrating YOU today and every day! 🎁✨',
    },
    {
      id:      'surprise-flower',
      emoji:   '🌸',
      title:   'Blooming Like You!',
      message: 'Just like this flower, you bring beauty and fragrance to everyone\'s life. You\'re in full bloom, Ruchii! 🌸💕',
    },
    {
      id:      'surprise-teddy',
      emoji:   '🧸',
      title:   'A Bear Hug for You!',
      message: 'Sending you the biggest, warmest, squishiest bear hug on your special day! You deserve all the hugs! 🧸❤️',
    },
    {
      id:      'surprise-star',
      emoji:   '⭐',
      title:   'You\'re a Star!',
      message: 'In a sky full of stars, you shine the brightest, Ruchii. Never forget how dazzling you truly are! ⭐🌟💫',
    },
  ],

  init() {
    this.config.forEach(sticker => {
      const el = document.getElementById(sticker.id);
      if (!el) return;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        SoundManager.playPop();
        Animations.sparkleAtCenter(3);
        
        // Add random variation to stickers
        if (sticker.id === 'surprise-gift') {
          Animations.floatHearts(8);
        } else if (sticker.id === 'surprise-flower') {
          // Trigger flower petals rain
          Animations.sparkleRain(4);
        } else if (sticker.id === 'surprise-teddy') {
          // Giant bear emoji bounce
          Animations.bearHugBounce();
        } else if (sticker.id === 'surprise-star') {
          // Sparkle rain
          Animations.sparkleRain(6);
        }
        
        this.showModal(sticker);
      });
    });
  },

  showModal(sticker) {
    const overlay = document.getElementById('modal-overlay');
    document.getElementById('modal-emoji').textContent  = sticker.emoji;
    document.getElementById('modal-title').textContent  = sticker.title;
    document.getElementById('modal-text').textContent   = sticker.message;
    overlay.classList.add('visible');
  }
};

// ============================================================
// MODAL
// ============================================================
function initModal() {
  const overlay   = document.getElementById('modal-overlay');
  const closeBtn  = document.getElementById('modal-close-btn');

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('visible');
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('visible');
  });
}

// ============================================================
// MEMORY CARDS (Page 7)
// ============================================================
function initMemoryCards() {
  const cards = document.querySelectorAll('.memory-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('opened')) {
        // Toggle back
        card.classList.remove('opened');
      } else {
        SoundManager.playPop();
        Animations.sparkleAtCenter(2);
        card.classList.add('opened');
        // Small confetti
        const rect = card.getBoundingClientRect();
        Animations.fireworks(rect.left + rect.width/2, rect.top);
      }
    });
  });
}

// ============================================================
// MEMORY JAR (Page 9)
// ============================================================
const jarMemories = [
  '🌧️ That rainy day in class when I first saw you',
  '☕ Our long walks sharing jokes & sipping warm chai',
  '📞 That time you were busy talking on the phone and missed my wave',
  '💬 How nervous I was saying "Hi" for the first time',
  '🤝 holding your hand during our vehicle-less walk',
  '🎂 Making sure this birthday is your absolute best!',
  '🌟 Your laugh which makes everyone else laugh instantly',
  '🌸 Your amazing capability to make any day feel peaceful',
  '🦋 Every single deep late-night conversation we shared',
  '🎁 How lucky I am to have you as a best friend!',
];

function initMemoryJar() {
  const jarContainer = document.getElementById('jar-container');
  if (!jarContainer) return;

  jarContainer.addEventListener('click', () => {
    if (window.jarOpened) return;
    window.jarOpened = true;

    SoundManager.playCelebration();

    // Animate jar
    const jarImg = jarContainer.querySelector('.jar-img');
    if (jarImg) {
      jarImg.style.transform = 'scale(1.15) rotate(-5deg)';
      setTimeout(() => {
        jarImg.style.transform = '';
      }, 400);
    }

    // Show notes floating out
    const notesArea = document.getElementById('jar-notes-area');
    const hint = document.querySelector('.jar-tap-hint');
    if (hint) hint.style.display = 'none';

    // Burst from jar
    Animations.jarBurst(jarContainer, jarMemories.slice(0, 8));

    // Show a few in the notes area
    const displayNotes = jarMemories.slice(0, 6);
    const colors = ['#FEFBA7','#FFD6E7','#D4EDFF','#D4FFDC','#EDD4FF','#FFE5CC'];

    displayNotes.forEach((text, i) => {
      setTimeout(() => {
        if (!notesArea) return;
        const note = document.createElement('div');
        note.style.cssText = `
          display: inline-block;
          background: ${colors[i % colors.length]};
          border-radius: 6px;
          padding: 8px 12px;
          margin: 4px;
          font-family: var(--font-note, 'Indie Flower', cursive);
          font-size: 0.78rem;
          color: #555;
          box-shadow: 2px 3px 10px rgba(0,0,0,0.12);
          transform: rotate(${(Math.random()-0.5)*10}deg);
          animation: fadeInUp 0.5s ease;
          line-height: 1.4;
        `;
        note.textContent = text;
        notesArea.appendChild(note);
      }, i * 350);
    });
  });
}

// ============================================================
// GIFT BOX (Final Page)
// ============================================================
function initGiftBox() {
  const giftBtn  = document.getElementById('gift-btn');
  const giftImg  = document.getElementById('gift-box-img');

  if (!giftBtn) return;

  giftBtn.addEventListener('click', () => {
    giftBtn.disabled = true;
    giftBtn.textContent = '🎉 Opening...';

    SoundManager.playCelebration();

    // Shake gif
    if (giftImg) {
      giftImg.style.animation = 'giftShake 0.4s ease 3';
      setTimeout(() => {
        giftImg.style.animation = 'none';
        giftImg.style.opacity = '0';
        giftImg.style.transform = 'scale(0.5)';
      }, 1300);
    }

    setTimeout(() => {
      // Mega celebration
      Animations.celebrate();

      // Spam all the polaroid photos on screen
      Animations.photoSpam();

      // Show video or final message
      const videoContainer = document.getElementById('final-video-container');
      const finalQuote = document.getElementById('final-quote');

      if (videoContainer) {
        videoContainer.classList.add('visible');
      }

      if (finalQuote) {
        setTimeout(() => {
          finalQuote.classList.add('visible');
        }, 600);
      }

      giftBtn.textContent = '🎊 Happy Birthday Ruchii! 🎊';
    }, 1400);
  });
}

// ============================================================
// INIT ALL
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  MusicPlayer.init();
  initModal();
  SurpriseStickers.init();
  initMemoryCards();
  initMemoryJar();
  initGiftBox();
});
