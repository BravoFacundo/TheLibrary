let library = [];
let examplePages = []; // shipped with the game, in data/pages.json
let openedPage = -1;
const libraryKey = "theLibrary.pages";
const maxPages = 60;
const slipsPerTable = 12;
let tableIndex = 0;
let tableView = 0;
let slipImages = [];
const slipSize = { w: 310, h: 174 };
const slipColumns = 4;
const tableSpacing = 1610; // neighbor tables peek at the screen edges


// The library shows the example pages first, then the ones saved in this browser
function loadLibrary(examples) {
  examplePages = examples.pages || [];
  let saved = [];
  try {
    saved = JSON.parse(localStorage.getItem(libraryKey)) || [];
  } catch (e) {}
  library = examplePages.concat(saved);
}

function saveToLibrary() {
  library.push({
    text: getText(),
    name: signature.trim() || texts[lang].anonymous,
    jitterX: random(-50, 50),
    jitterY: random(-30, 30),
    angle: random(-0.18, 0.18),
    sprite: floor(random(slipImages.length))
  });
  let saved = library.slice(examplePages.length);
  if (saved.length > maxPages) library.splice(examplePages.length, 1);

  try {
    localStorage.setItem(libraryKey, JSON.stringify(library.slice(examplePages.length)));
  } catch (e) {}
}

function slipPosition(i) {
  let slip = library[i];
  let table = floor(i / slipsPerTable);
  let col = (i % slipsPerTable) % slipColumns;
  let row = floor((i % slipsPerTable) / slipColumns);
  return {
    x: 405 + col * 370 + slip.jitterX + (table - tableView) * tableSpacing,
    y: 230 + row * 250 + slip.jitterY
  };
}

function tableCount() {
  return max(1, ceil(library.length / slipsPerTable));
}

function changeTable(direction) {
  let next = constrain(tableIndex + direction, 0, tableCount() - 1);
  if (next != tableIndex) playSound("papers", 0.4, 1.1);
  tableIndex = next;
}

function drawLibrary() {
  tableView = lerp(tableView, tableIndex, 0.12);
  if (abs(tableView - tableIndex) < 0.001) tableView = tableIndex;
  image(tableImage, 0, 0, 1920, 1080);
  let hovered = slipUnderMouse();

  for (let i = 0; i < library.length; i++) {
    let slip = library[i];
    let pos = slipPosition(i);
    if (pos.x < -300 || pos.x > 2220) continue;
    push();
    translate(pos.x, pos.y);
    rotate(slip.angle);
    if (i == hovered && openedPage < 0) scale(1.06);

    let img = slipImages[(slip.sprite ?? i) % slipImages.length];
    if (i == library.length - 1 && !returnToBook) drawingContext.shadowColor = "rgba(240, 90, 38, " + (0.6 + 0.3 * sin(millis() * 0.004)) + ")";
    else drawingContext.shadowColor = "rgba(0, 0, 0, 0.6)";
    drawingContext.shadowBlur = 18;
    drawingContext.shadowOffsetY = 6;
    imageMode(CENTER);
    image(img, 0, 0, slipSize.w, slipSize.h);
    imageMode(CORNER);
    drawingContext.shadowColor = "rgba(0, 0, 0, 0)";

    noStroke();
    fill(inkColor);
    textSize(11);
    textAlign(LEFT, TOP);
    let slipLines = wrapText(slipText(slip), 210);
    for (let j = 0; j < min(slipLines.length, 5); j++) {
      text(slipLines[j], -slipSize.w / 2 + 46, -slipSize.h / 2 + 40 + j * 15);
    }
    textAlign(RIGHT, TOP);
    text(slipName(slip), slipSize.w / 2 - 44, slipSize.h / 2 - 48);
    pop();
  }

  if (hovered >= 0 && openedPage < 0) cursor(HAND);
}

// Example pages have one text per language
function slipText(slip) {
  if (typeof slip.text == "object") return slip.text[lang] || "";
  return slip.text || "";
}

function slipName(slip) {
  if (typeof slip.name == "object") return slip.name[lang] || "";
  return slip.name || "";
}

function slipUnderMouse() {
  if (gameState != "Library") return -1;
  let mx = mouseX / screenScale;
  let my = mouseY / screenScale;

  for (let i = library.length - 1; i >= 0; i--) {
    let slip = library[i];
    let pos = slipPosition(i);
    let dx = mx - pos.x;
    let dy = my - pos.y;
    let lx = dx * cos(-slip.angle) - dy * sin(-slip.angle);
    let ly = dx * sin(-slip.angle) + dy * cos(-slip.angle);
    if (abs(lx) < slipSize.w / 2 && abs(ly) < slipSize.h / 2) return i;
  }
  return -1;
}

function drawOpenedPage() {
  if (openedPage < 0) return;
  let slip = library[openedPage];

  noStroke();
  fill(0, 170);
  rect(0, 0, 1920, 1080);

  push();
  translate(960, 520);
  rotate(slip.angle * 0.2);
  imageMode(CENTER);
  image(slipImages[(slip.sprite ?? openedPage) % slipImages.length], 0, 0, 900, 505);
  imageMode(CORNER);

  fill(inkColor);
  textAlign(LEFT, TOP);
  let size = 32;
  let slipLines = [];
  while (size > 12) {
    textSize(size);
    slipLines = wrapText(slipText(slip), 620);
    if (slipLines.length * size * 1.35 <= 270) break;
    size -= 2;
  }
  for (let j = 0; j < slipLines.length; j++) {
    text(slipLines[j], -316, -138 + j * size * 1.35);
  }
  textSize(30);
  textAlign(RIGHT, TOP);
  text("— " + slipName(slip), 330, 150);
  pop();

  fill(paperColor[0], paperColor[1], paperColor[2], 230);
  textSize(28);
  textAlign(CENTER, CENTER);
  text(texts[lang].close, 960, 850);
  cursor(HAND);
}

function libraryClick() {
  if (openedPage >= 0) {
    openedPage = -1;
    playSound("paper", 0.4, 1.1);
    return true;
  }
  let slip = slipUnderMouse();
  if (slip >= 0) {
    let table = floor(slip / slipsPerTable);
    if (table != tableIndex) changeTable(table > tableIndex ? 1 : -1);
    else {
      openedPage = slip;
      playSound("paper", 0.7);
    }
    return true;
  }
  return false;
}
