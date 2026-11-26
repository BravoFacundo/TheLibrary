# The Library — web version

Browser version of The Library in p5.js.

Same logic as the original installation in [`TheLibrary_Processing`](../TheLibrary_Processing): you type on the keyboard, the text appears on two pages like an open book, and the fire video rewinds as you write. No projection mapping.

## How to play

- The book burns on its own while nobody writes.
- Every character you type pushes the fire back. While you write it advances slowly; stop for 2 seconds and it comes back at full speed.
- Write 120 characters and bring the fire back to the start to save the book.
- When you win, sign your page with your name and press `Enter`. The page is cut from the book and placed on the table with the pages saved before. Click a page to read it, or write again.
- Saved pages are kept only in the player's browser (`localStorage`). Nothing is sent or stored anywhere else.
- After 60 seconds without typing, the book resets for the next user.

Controls: keyboard to write, `Backspace` to delete, `Enter` for a new line. A physical keyboard is required.

## How to run

The page has to be served by a local server: opened with a double click (`file://`), the browser blocks the video and the font.

- With XAMPP, put the repository inside `htdocs` and open `http://localhost/TheLibrary/TheLibrary_p5js/`.

Language follows the browser (Spanish or English). Force it with `?lang=es` or `?lang=en`.

## Structure

- `index.html` — page and scripts. p5.js 1.11 is loaded from the jsDelivr CDN.
- `sketch.js` — variables, `setup()` and `draw()`.
- `functions.js` — book drawing, writing system, saving and restarting.
- `inputs.js` — keyboard and mouse.
- `video.js` — `VideoFrames`, moves the fire forward and back frame by frame, reading the frames from two sheets.
- `book.js` — the book photo, its page positions and the fire on top.
- `library.js` — saved pages: storing them in the browser, the table screen and reading a page.
- `data/` — `burn_sheet.webp` (burnt paper) and `glow_sheet.webp` (embers on the burning edge), the 271 frames of the fire video in a 16-column grid (384×216 each), `Book.webp`, `Table.jpg` and `Slip_1` to `Slip_4.webp` (book, table and saved pages), `Logo_ES.png` and `Logo_EN.png`.

## Credits

The videos and images were provided by collaborators in charge of other areas of the project. Font: ["The Queen"](https://fontbundles.net/free-fonts/regular-fonts/the-queen) by Font Bundles, under its Premium License; it keeps its own license.
