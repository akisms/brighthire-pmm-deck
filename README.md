# BrightHire — Charting a singular path in a crowded category

An interactive single-page presentation by Ayman Kotob, built as a positioning POV for BrightHire.

## Run it

```bash
node server.js
```

Then open http://localhost:3030.

You can also just double-click `index.html` — the deck works fine without the server, but edits will only persist in that browser's `localStorage` instead of in a shared `edits.json` file.

## Controls

- **`P`** — toggle Present mode (one slide per screen, arrow keys to navigate)
- **Arrow keys / Space** — next/previous slide in Present mode
- **`Esc`** — exit Present mode
- **Edit button** — make every text element click-to-edit, autosaving as you type
- **Undo / Reset all** — appear in the nav while Edit mode is on

## Stack

Plain HTML/CSS/JS in a single file. Tiny Node `http` server to persist edits to `edits.json`.
