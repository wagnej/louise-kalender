# Louise’s Advent Calendar

A personalised, interactive 24-day Christmas advent calendar — built with React, TypeScript and Vite, hosted for free on GitHub Pages.

Each day unlocks a mini-game. Finish the game to reveal a gift. Progress is saved in the browser (localStorage). No backend, no paid services.

---

## Quick start (on your computer)

You need [Node.js](https://nodejs.org/) installed (version 20 or newer is fine).

1. Open this folder in Cursor / a terminal
2. Install dependencies (only needed once):

```bash
npm install
```

3. Start the local website:

```bash
npm run dev
```

4. Open the address shown in the terminal (usually `http://localhost:5173`)

### Preview mode

In `src/config/calendar.ts`, `previewMode` is set to `true` so **all 24 days are open** while you test.

**Set `previewMode: false` before sharing with Louise** — then days unlock on Dec 1–24 in Swedish time (`Europe/Stockholm`).

### Password lock + music

The site opens on a letter lock screen first.

1. Change the password in `src/config/calendar.ts` → `lock.password` (default is `godjul`)
2. Music file: `public/audio/fairytale-of-new-york.m4a`  
   (Keep the GitHub repo **private** if you push this copyrighted track)
3. Opening the letter starts the music (browsers require a tap before audio can play)
4. After unlock, use the ♫ button (top right) to mute/unmute
5. Refreshing the page always shows the lock screen again (unlock is not remembered)

---

## How to put the website online (GitHub Pages)

Follow these steps once. After that, every push to `main` updates the live site automatically.

### Step 1 — Create a GitHub account & repository

1. Sign up / log in at [github.com](https://github.com)
2. Click **New repository**
3. Choose a name, e.g. `louise-kalender` (this becomes part of the URL)
4. Leave it empty (no README) if you will push this project into it
5. Create the repository

### Step 2 — Put this project on GitHub (from Cursor)

In the Cursor terminal, inside this project folder:

```bash
git init
git add .
git commit -m "Initial advent calendar"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/louise-kalender.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `louise-kalender` with your real GitHub username and repo name.

> Tip: You can also use Cursor’s Source Control panel / GitHub integration to publish the repo if you prefer clicking over typing.

### Step 3 — Turn on GitHub Pages

1. On GitHub, open your repository
2. Go to **Settings → Pages**
3. Under **Build and deployment → Source**, choose **GitHub Actions**
4. Open the **Actions** tab — you should see a workflow called **Deploy to GitHub Pages**
5. Wait until it finishes with a green checkmark

### Step 4 — Open the live site

Your site will be at:

```text
https://YOUR_USERNAME.github.io/louise-kalender/
```

(Exact URL also appears under **Settings → Pages** after the first successful deploy.)

### Updating the site later

1. Edit files locally
2. Commit and push to `main`
3. Wait for the Actions workflow to finish
4. Refresh the live URL

---

## Where to edit content

### Almost everything: `src/config/calendar.ts`

This is the **one file** you should edit most often:

| Setting | What it does |
|--------|----------------|
| `recipientName` | Name on the home page |
| `senderName` | Signature on gifts |
| `year` | Advent year (unlock dates) |
| `previewMode` | `true` = all days open for testing |
| `days` | All 24 doors: game + gift |

Each day looks like:

```ts
{
  day: 1,
  doorTheme: 'snowflake',   // visual style of the door
  teaser: 'A little word',  // short text on the door
  game: { type: 'wordGuess', /* … */ },
  gift: {
    title: '…',
    message: '…',
    image: '/gifts/my-photo.jpg',          // optional
    link: { url: 'https://…', label: '…' }, // optional
    physicalGift: '…',                      // optional
  },
}
```

### Images & assets

1. Put files in `public/gifts/` (e.g. `public/gifts/day-7.jpg`)
2. Reference them in config as `'/gifts/day-7.jpg'`
3. A placeholder SVG is already there for photo games / puzzles

### Game types you can use

| `type` | What the player does |
|--------|----------------------|
| `wordGuess` | Wordle-style letter guessing |
| `emojiRiddle` | Guess a phrase from emojis |
| `memory` | Match pairs of cards |
| `quiz` | Multiple-choice questions (all must be correct) |
| `connections` | Group words into categories |
| `photoGuess` | Guess a blurred photo |
| `musicQuiz` | Guess a song from a lyric clue |
| `crossword` | Tiny crossword grid |
| `picturePuzzle` | Sliding tile picture puzzle |

Copy an existing day that uses the game type you want, then change the words / questions / answers.

### Progress (localStorage)

Completed days are stored in the browser under the key `louise-advent-progress-v1`.

To reset while testing, open the browser console on your site and run:

```js
localStorage.removeItem('louise-advent-progress-v1')
location.reload()
```

---

## Project structure (beginner map)

```text
src/
  config/calendar.ts     ← edit days, gifts, names here
  components/
    calendar/            ← door grid UI
    games/               ← all mini-games
    gift/                ← gift reveal animation
    layout/              ← snowfall, etc.
  pages/                 ← home + day screens
  hooks/useProgress.ts   ← saves progress
  utils/date.ts          ← Stockholm date unlocking
  utils/storage.ts       ← localStorage helpers
  types/index.ts         ← TypeScript shapes (advanced)
public/gifts/            ← put images here
.github/workflows/       ← auto-deploy to GitHub Pages
```

---

## Useful commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check for simple code issues |

---

## Notes

- Unlocking uses **Europe/Stockholm** midnight dates in December of `year`.
- The site is a static SPA (HashRouter), so GitHub Pages works without a custom server.
- The Vite `base` path is set automatically on GitHub Actions from your repository name.
