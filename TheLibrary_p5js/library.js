let library = [];
let openedPage = -1;
const libraryKey = "theLibrary.pages";
const maxPages = 60;
const slipsPerTable = 12;
let tableIndex = 0;
let tableView = 0;
let slipImages = [];
const slipSize = { w: 310, h: 174 };
const slipColumns = 4;


function loadLibrary() {
  try {
    library = JSON.parse(localStorage.getItem(libraryKey)) || [];
  } catch (e) {
    library = [];
  }
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
  if (library.length > maxPages) library.shift();

  try {
    localStorage.setItem(libraryKey, JSON.stringify(library));
  } catch (e) {}
}

function slipPosition(i) {
  let slip = library[i];
  let table = floor(i / slipsPerTable);
  let col = (i % slipsPerTable) % slipColumns;
  let row = floor((i % slipsPerTable) / slipColumns);
  return {
    x: 405 + col * 370 + slip.jitterX + (table - tableView) * 1920,
    y: 230 + row * 250 + slip.jitterY
  };
}

function tableCount() {
  return max(1, ceil(library.length / slipsPerTable));
}

function changeTable(direction) {
  tableIndex = constrain(tableIndex + direction, 0, tableCount() - 1);
}

function drawTableNavigation() {
  tableView = lerp(tableView, tableIndex, 0.12);
  if (abs(tableView - tableIndex) < 0.001) tableView = tableIndex;
  if (tableCount() < 2) return;

  if (tableIndex > 0) drawArrow(90, -1);
  if (tableIndex < tableCount() - 1) drawArrow(1830, 1);

  noStroke();
  for (let i = 0; i < tableCount(); i++) {
    fill(paperColor[0], paperColor[1], paperColor[2], i == tableIndex ? 240 : 140);
    circle(960 + (i - (tableCount() - 1) / 2) * 28, 935, 12);
  }
}

function drawArrow(x, direction) {
  let y = 520;
  let mx = mouseX / screenScale;
  let my = mouseY / screenScale;
  let hover = abs(mx - x) < 50 && abs(my - y) < 70;
  if (hover && openedPage < 0) cursor(HAND);

  noFill();
  stroke(paperColor[0], paperColor[1], paperColor[2], hover ? 255 : 210);
  strokeWeight(5);
  line(x - 14 * direction, y - 36, x + 14 * direction, y);
  line(x + 14 * direction, y, x - 14 * direction, y + 36);
  noStroke();

  buttons.push({ x: x, y: y, w: 100, h: 140, action: () => changeTable(direction) });
}

function drawLibrary() {
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
    if (i == library.length - 1 && !returnToBook) drawingContext.shadowColor = "rgba(255, 150, 40, " + (0.6 + 0.3 * sin(millis() * 0.004)) + ")";
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
    text(slip.name || "", slipSize.w / 2 - 44, slipSize.h / 2 - 48);
    pop();
  }

  if (hovered >= 0 && openedPage < 0) cursor(HAND);
}

function slipText(slip) {
  return slip.text || (slip.lines || []).join(" ");
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
  text(slip.name || "", 330, 150);
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
    return true;
  }
  let slip = slipUnderMouse();
  if (slip >= 0) {
    openedPage = slip;
    return true;
  }
  return false;
}
