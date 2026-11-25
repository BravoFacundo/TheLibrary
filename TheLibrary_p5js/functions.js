function drawText() {
  noStroke();
  fill(inkColor);
  textSize(textSizePage);
  textAlign(LEFT, BASELINE);
  let blink = focused && millis() % 1000 < 500;

  for (let i = 0; i < lines; i++) {
    push();
    toLine(i);
    spacedText(lineStrings[i], textMarginX, lineY(i));
    pop();
  }

  drawSignature(blink);
}

function toLine(i) {
  let page = i < linesSplit ? pages[0] : pages[1];
  translate(page.x, page.y);
  scale(pageScale);
}

function lineY(i) {
  if (i < linesSplit) return firstLineY[0] + i * lineHeight;
  return firstLineY[1] + (i - linesSplit) * lineHeight;
}

function addTypedLetter() {
  let line = lineStrings[currentLine];
  push();
  textSize(textSizePage);
  let x = textMarginX + spacedWidth(line.slice(0, -1));
  pop();
  typedLetters.push({ c: line[line.length - 1], line: currentLine, x: x, time: millis() });
}

function drawTypedLetters() {
  typedLetters = typedLetters.filter(l => millis() - l.time < letterFade);
  noStroke();
  textSize(textSizePage);
  textAlign(LEFT, BASELINE);

  for (let l of typedLetters) {
    let alpha = map(millis() - l.time, 0, letterFade, 255, 0);
    push();
    toLine(l.line);
    drawingContext.shadowColor = "rgba(255, 140, 40, " + alpha / 255 + ")";
    drawingContext.shadowBlur = 25;
    fill(255, 240, 210, alpha);
    text(l.c, l.x, lineY(l.line));
    pop();
  }

  let blink = focused && millis() % 1000 < 500;
  if (gameState == "Playing" && firstPressedKey && blink) {
    push();
    toLine(currentLine);
    fill(255, 235, 200);
    rect(textMarginX + spacedWidth(lineStrings[currentLine]) + 2, lineY(currentLine) - textSizePage * 0.75, 4, textSizePage * 0.9);
    pop();
  }
}

function drawSignature(blink) {
  push();
  translate(pages[1].x, pages[1].y);
  scale(pageScale);

  stroke(inkColor[0], inkColor[1], inkColor[2], 200);
  strokeWeight(3);
  line(420, 1180, 860, 1180);
  noStroke();

  fill(inkColor[0], inkColor[1], inkColor[2], 210);
  textSize(34);
  textAlign(LEFT, TOP);
  text(texts[lang].signature, 420, 1195);

  fill(inkColor);
  textSize(64);
  if (textWidth(signature) > 400) textSize(64 * 400 / textWidth(signature));
  textAlign(LEFT, BASELINE);
  text(signature, 440, 1160);
  if (gameState == "Sign" && blink) rect(440 + textWidth(signature) + 6, 1160 - 50, 4, 58);
  pop();
}

function drawStatus() {
  let y = 1015;
  textAlign(CENTER, CENTER);
  textSize(34);
  noStroke();
  buttons = [];

  if (gameState == "Sign") {
    fill(paperColor);
    text(texts[lang].sign, 960, y);
    return;
  }

  if (gameState == "Win") {
    fill(paperColor);
    text(texts[lang].saved, 960, y);
    return;
  }

  if (gameState == "Library") {
    textAlign(LEFT, CENTER);
    fill(paperColor);
    text(texts[lang].library, 230, 975);
    textSize(24);
    fill(paperColor[0], paperColor[1], paperColor[2], 225);
    text(texts[lang].libraryInfo, 230, 1022);
    textSize(34);
    textAlign(CENTER, CENTER);
    let label = returnToBook ? texts[lang].back : texts[lang].again;
    drawButton(label, 1690 - (textWidth(label) + 50) / 2, 995, leaveLibrary);
    return;
  }

  let message;
  if (isTouchOnly()) message = texts[lang].keyboard;
  else if (!focused) message = texts[lang].focus;
  else if (!firstPressedKey) message = texts[lang].start;
  else message = countCharacters() + " / " + charactersToWin;

  fill(paperColor);
  text(message, 960, y);

  if (library.length > 0) {
    textSize(26);
    let label = texts[lang].entries + " (" + library.length + ")";
    drawButton(label, 230 + (textWidth(label) + 50) / 2, y, () => showLibrary(true));
  }
}

// Dark gradients behind the UI so the text reads over the wood
function drawShade() {
  let ctx = drawingContext;
  let bottom = ctx.createLinearGradient(0, 880, 0, 1080);
  bottom.addColorStop(0, "rgba(0, 0, 0, 0)");
  bottom.addColorStop(1, "rgba(0, 0, 0, 0.75)");
  ctx.fillStyle = bottom;
  ctx.fillRect(0, 880, 1920, 200);

  let corner = ctx.createRadialGradient(1825, 40, 0, 1825, 40, 220);
  corner.addColorStop(0, "rgba(0, 0, 0, 0.6)");
  corner.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = corner;
  ctx.fillRect(1600, 0, 320, 260);
}

// Soft dark halo around UI text
function uiShadow(on) {
  drawingContext.shadowColor = on ? "rgba(0, 0, 0, 0.9)" : "rgba(0, 0, 0, 0)";
  drawingContext.shadowBlur = on ? 12 : 0;
  drawingContext.shadowOffsetY = 0;
}

function drawLanguage() {
  textSize(26);
  textAlign(CENTER, CENTER);
  let options = ["es", "en"];
  for (let i = 0; i < options.length; i++) {
    let x = 1790 + i * 70;
    let y = 40;
    let hover = abs(mouseX / screenScale - x) < 30 && abs(mouseY / screenScale - y) < 24;
    if (hover && openedPage < 0) cursor(HAND);
    noStroke();
    fill(paperColor[0], paperColor[1], paperColor[2], lang == options[i] ? 255 : hover ? 230 : 170);
    text(options[i].toUpperCase(), x, y);
    if (lang == options[i]) rect(x - 18, y + 18, 36, 2);
    buttons.push({ x: x, y: y, w: 60, h: 48, action: () => setLanguage(options[i]) });
  }
}

function setLanguage(l) {
  lang = l;
  try {
    localStorage.setItem("theLibrary.lang", l);
  } catch (e) {}
}

function drawButton(label, x, y, action) {
  let w = textWidth(label) + 50;
  let h = 60;
  let mx = mouseX / screenScale;
  let my = mouseY / screenScale;
  let hover = abs(mx - x) < w / 2 && abs(my - y) < h / 2;

  if (hover) cursor(HAND);
  noFill();
  stroke(paperColor[0], paperColor[1], paperColor[2], hover ? 255 : 190);
  rect(x - w / 2, y - h / 2, w, h);
  noStroke();
  fill(paperColor[0], paperColor[1], paperColor[2], hover ? 255 : 240);
  text(label, x, y - 4);

  buttons.push({ x: x, y: y, w: w, h: h, action: action });
}

function spacedText(s, x, y) {
  for (let c of s) {
    text(c, x, y);
    x += textWidth(c) + letterSpacing;
    if (c == " ") x += wordSpacing;
  }
}

function spacedWidth(s) {
  let w = 0;
  for (let c of s) {
    w += textWidth(c) + letterSpacing;
    if (c == " ") w += wordSpacing;
  }
  return w;
}

function lineFits(s) {
  push();
  textSize(textSizePage);
  let fits = spacedWidth(s) <= maxLineWidth;
  pop();
  return fits;
}

function write(k) {
  let line = lineStrings[currentLine];
  if (lineFits(line + k)) {
    lineStrings[currentLine] += k;
    return;
  }
  if (currentLine == lines - 1) return;

  if (k == " ") {
    lineStrings[currentLine] += k;
    currentLine++;
    return;
  }

  let lastSpace = line.lastIndexOf(" ");
  let lastWord = lastSpace > 0 ? line.substring(lastSpace + 1) : "";
  lineStrings[currentLine] = line.substring(0, line.length - lastWord.length);
  currentLine++;
  lineStrings[currentLine] = lastWord + k;
}

function deleteCharacter() {
  if (lineStrings[currentLine].length == 0) {
    if (currentLine == 0) return;
    currentLine--;
    if (lineBreaks[currentLine]) {
      lineBreaks[currentLine] = false;
      return;
    }
  }
  lineStrings[currentLine] = lineStrings[currentLine].slice(0, -1);
}

function rewindPerCharacter(written) {
  let remaining = max(1, charactersToWin - written);
  let burnLeft = max(0, video.currentFrame - video.pendingRewind);
  return burnLeft / remaining * rewindBoost;
}

function newLine() {
  if (currentLine == lines - 1 || lineStrings[currentLine].trim() == "") return;
  lineBreaks[currentLine] = true;
  currentLine++;
}

function endOfWord() {
  let line = lineStrings[currentLine];
  if (line.length == 0) return true;
  let lastWord = line.substring(line.lastIndexOf(" ") + 1);
  return " .,;:!?".includes(line[line.length - 1]) || lastWord.length >= 12;
}

function bookFull() {
  return currentLine == lines - 1 && !lineFits(lineStrings[currentLine] + "a");
}

function countCharacters() {
  let count = 0;
  for (let i = 0; i < lines; i++) count += lineStrings[i].length;
  return count;
}

function clearText() {
  for (let i = 0; i < lines; i++) {
    lineStrings[i] = "";
    lineBreaks[i] = false;
  }
  currentLine = 0;
}

function win() {
  gameState = "Sign";
  signature = "";
}

function signPage() {
  saveToLibrary();
  gameState = "Win";
  winTime = millis();
}

function getText() {
  let fullText = "";
  for (let i = 0; i <= currentLine; i++) {
    fullText += lineStrings[i];
    if (lineBreaks[i]) fullText += "\n";
  }
  return fullText.trim();
}

function wrapText(fullText, maxWidth) {
  let result = [];
  for (let paragraph of fullText.split("\n")) {
    let current = "";
    for (let word of paragraph.split(" ")) {
      let next = current.length > 0 ? current + " " + word : word;
      if (textWidth(next) <= maxWidth) {
        current = next;
        continue;
      }
      if (current.length > 0) result.push(current);
      current = "";
      for (let c of word) {
        if (textWidth(current + c) > maxWidth) {
          result.push(current);
          current = "";
        }
        current += c;
      }
    }
    result.push(current);
  }
  return result;
}

function showLibrary(fromBook = false) {
  returnToBook = fromBook;
  gameState = "Library";
  fadeTime = millis();
  openedPage = -1;
  tableIndex = tableCount() - 1;
  tableView = tableIndex;
}

function leaveLibrary() {
  if (!returnToBook) {
    restart(true);
    return;
  }
  returnToBook = false;
  gameState = "Playing";
  lastKeyPressed = millis();
  fadeTime = millis();
}

function drawFade() {
  let alpha = map(millis() - fadeTime, 0, 700, 255, 0, true);
  if (alpha <= 0) return;
  noStroke();
  fill(0, alpha);
  rect(0, 0, 1920, 1080);
}

function restart(newBook) {
  clearText();
  gameState = "Playing";
  firstPressedKey = false;
  bookSaved = false;
  typedLetters = [];
  returnToBook = false;
  openedPage = -1;
  signature = "";
  videoSpeed = 0.6;
  fadeTime = millis();
  if (newBook) video.setFrame(0);
}

function isTouchOnly() {
  return window.matchMedia("(pointer: coarse)").matches && !window.matchMedia("(pointer: fine)").matches;
}
