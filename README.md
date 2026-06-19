# 🎂 Happy Birthday Ruchii — Interactive Card Website

A magical, interactive scrapbook-style birthday greeting card built with pure HTML, CSS, and JavaScript. No build tools needed — just open `index.html` in any browser!

---

## 📁 File Structure

```
birthday-card/
├── index.html              ← Main site (open this!)
├── css/
│   ├── main.css            ← Design tokens, layout, components
│   ├── animations.css      ← All keyframe animations
│   └── pages.css           ← Per-page styles
├── js/
│   ├── card.js             ← Card open + page flip engine
│   ├── animations.js       ← Confetti, fireworks, hearts
│   └── interactions.js     ← Memory jar, gifts, surprises, music
├── assets/
│   ├── images/             ← 📸 Place your photos here!
│   └── audio/              ← 🎵 Optional audio files
└── README.md               ← This file
```

---

## 📸 How to Add Your Photos

1. Open the `assets/images/` folder
2. Replace (or add) these files with your real photos:

| Filename          | Where it appears                  |
|-------------------|-----------------------------------|
| `childhood.png`   | Page 2 — Her Journey              |
| `photo1.png`      | Pages 3 & 5 — Scrapbook          |
| `photo2.png`      | Pages 3 & 6 — Scrapbook          |
| `photo3.png`      | Pages 4 & 6 — Scrapbook          |
| `photo4.png`      | Page 4 — Scrapbook               |
| `birthday_cover.png` | Page 1 — Cover background     |
| `gift_box.png`    | Final page — Gift box            |
| `memory_jar.png`  | Page 9 — Memory jar              |
| `pressed_flowers.png` | Page 2 & letter decoration  |
| `parchment_bg.png` | Page 10 — Letter background    |

> **Tip:** Photos will automatically fill the Polaroid frames. Any standard JPG or PNG works. If a photo isn't found, a beautiful colored placeholder appears automatically.

---

## 🎥 Adding the Birthday Video

1. Open `index.html` in a text editor
2. Find this line:
   ```
   data-src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1"
   ```
3. Replace `YOUR_VIDEO_ID` with your YouTube video ID
   - Example: if the URL is `https://youtube.com/watch?v=dQw4w9WgXcQ`, the ID is `dQw4w9WgXcQ`
4. Save the file

---

## 💌 How to Customize the Letter (Page 10)

1. Open `index.html`
2. Find the `<div id="letter-body" data-text="...">` element
3. Edit the text inside the `data-text="..."` attribute — this is what gets typed out with the ink animation

---

## 🎵 Music

The site tries to auto-play a soft background melody. If the browser blocks autoplay, click the **🎵 Music On** button in the top-right corner.

To use your own music file:
1. Put an `.mp3` file in `assets/audio/` (e.g., `music.mp3`)
2. Open `js/interactions.js`
3. Find `this.audio.src = '...'` and change it to `'assets/audio/music.mp3'`

---

## 🌐 Deploy to GitHub Pages

1. Push the entire folder to a GitHub repository
2. Go to **Settings → Pages → Source → main branch → / (root)**
3. GitHub will give you a URL like `https://yourusername.github.io/repo-name/`
4. Share that URL with Ruchii! 🎉

---

## 🎮 Controls

| Action | Description |
|--------|-------------|
| Click cover | Opens the card |
| ▶ / ◀ buttons | Flip pages |
| Arrow keys | Flip pages (keyboard) |
| Swipe left/right | Flip pages (touch) |
| Click hidden stickers | Surprise messages (🎁🌸🧸⭐) |
| Tap the Memory Jar | Release memories |
| Tap Memory Cards | Reveal special moments |
| Click Gift button | Final celebration! |

---

## ✨ Hidden Stickers (Surprise!)

There are 4 hidden surprise stickers — can Ruchii find them all?

- ⭐ Star — Page 1
- 🌸 Flower — Page 2
- 🧸 Teddy Bear — Page 4
- 🎁 Gift Box — Page 7

---

*Made with 💖 — Every pixel was placed with love for Ruchii.*
