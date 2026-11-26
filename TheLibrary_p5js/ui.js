//----- UI objects on the table
// Brass plaque = information, burned paper = button, ribbons = language

let plaqueImage;
let ribbonImages = {};
const plaque = { x: 960, y: 1012, w: 600, h: 92 };
const ribbonX = { es: 1772, en: 1852 };
let ribbonDrop = { es: -65, en: -65 };
let plaqueKey = "";
let plaqueTime = 0;
const plaqueShine = 1400;


function loadUI() {
  plaqueImage = loadImage("data/Plaque.webp");
  ribbonImages.es = loadImage("data/Ribbon_ES.webp");
  ribbonImages.en = loadImage("data/Ribbon_EN.webp");
}

function drawStatus() {
  buttons = [];

  if (gameState == "Library") {
    drawPlaque("library", texts[lang].library, texts[lang].libraryInfo);
    drawPaperButton(texts[lang].again, 380, 1008, 2.5, leaveLibrary);
    return;
  }

  if (gameState == "Win") {
    drawPlaque("saved", texts[lang].saved);
    return;
  }

  if (gameState == "Sign") {
    drawPlaque("sign", texts[lang].safe, texts[lang].sign);
    return;
  }

  let message = "start";
  if (isTouchOnly()) message = "keyboard";
  else if (!focused) message = "focus";
  else if (bookSaved) message = "safe";
  drawPlaque(message, texts[lang][message]);

  if (library.length > 0) {
    let label = texts[lang].entries + " (" + library.length + ")";
    drawPaperButton(label, 1635, 1008, -3, () => showLibrary(true));
  }
}

// key = which message is shown, so changing language doesn't shine
function drawPlaque(key, title, subtitle) {
  if (key != plaqueKey) {
    plaqueKey = key;
    plaqueTime = millis();
  }
  let t = (millis() - plaqueTime) / plaqueShine;

  push();
  translate(plaque.x, plaque.y);
  objectShadow(1);
  imageMode(CENTER);
  image(plaqueImage, 0, 0, plaque.w, plaque.h);
  objectShadow(0);
  if (t < 1) drawShine(t);

  noStroke();
  textAlign(CENTER, CENTER);
  if (subtitle) {
    engraved(title, -16, 28);
    engraved(subtitle, 21, 21);
  } else {
    engraved(title, -4, 28);
  }
  pop();
}

// Warm glow around the plaque + a light band sweeping across it
function drawShine(t) {
  let ctx = drawingContext;
  let glow = sin(t * PI);

  ctx.save();
  ctx.shadowColor = "rgba(255, 180, 80, " + glow * 0.8 + ")";
  ctx.shadowBlur = 40 * screenScale;
  noFill();
  stroke(255, 200, 120, glow * 120);
  strokeWeight(2);
  rect(-plaque.w / 2 + 2, -plaque.h / 2 + 2, plaque.w - 4, plaque.h - 4, 10);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.rect(-plaque.w / 2, -plaque.h / 2, plaque.w, plaque.h);
  ctx.clip();
  ctx.globalCompositeOperation = "lighter";
  let x = lerp(-plaque.w / 2 - 120, plaque.w / 2 + 120, t);
  let band = ctx.createLinearGradient(x - 80, 0, x + 80, 0);
  band.addColorStop(0, "rgba(255, 220, 150, 0)");
  band.addColorStop(0.5, "rgba(255, 220, 150, 0.45)");
  band.addColorStop(1, "rgba(255, 220, 150, 0)");
  ctx.fillStyle = band;
  ctx.fillRect(-plaque.w / 2, -plaque.h / 2, plaque.w, plaque.h);
  ctx.restore();
  noStroke();
}

function engraved(s, y, size) {
  textSize(size);
  let maxWidth = plaque.w - 70;
  if (textWidth(s) > maxWidth) textSize(size * maxWidth / textWidth(s));
  fill(255, 230, 160, 150);
  text(s, 0, y + 1.5);
  fill(45, 28, 8);
  text(s, 0, y);
}

function drawPaperButton(label, x, y, angle, action) {
  textSize(22);
  let w = max(280, textWidth(label) + 90);
  let h = 92;
  let hover = openedPage < 0 && mouseOver(x, y, w, h);
  if (hover) cursor(HAND);

  push();
  translate(x, y - (hover ? 4 : 0));
  rotate(radians(angle + (hover ? 1 : 0)));
  objectShadow(hover ? 1.8 : 1);
  imageMode(CENTER);
  image(slipImages[1], 0, 0, w, h);
  objectShadow(0);

  noStroke();
  fill(inkColor);
  textAlign(CENTER, CENTER);
  text(label, 0, -3);
  pop();

  buttons.push({ x: x, y: y, w: w, h: h, action: action });
}

function drawLanguage() {
  let mx = mouseX / screenScale;
  let my = mouseY / screenScale;

  for (let l of ["es", "en"]) {
    let x = ribbonX[l];
    let hover = openedPage < 0 && abs(mx - x) < 30 && my < 250;
    let target = lang == l ? -10 : hover ? -40 : -65;
    ribbonDrop[l] = lerp(ribbonDrop[l], target, 0.2);
    if (hover && lang != l) cursor(HAND);

    push();
    translate(x, ribbonDrop[l]);
    objectShadow(0.6);
    image(ribbonImages[l], -27, 0, 54, 250);
    objectShadow(0);

    noStroke();
    textSize(28);
    textAlign(CENTER, CENTER);
    fill(60, 40, 10, 200);
    text(l.toUpperCase(), 1, 162);
    fill(235, 200, 110);
    text(l.toUpperCase(), 0, 160);
    pop();

    buttons.push({ x: x, y: 120, w: 60, h: 250, action: () => setLanguage(l) });
  }
}

function setLanguage(l) {
  lang = l;
  try {
    localStorage.setItem("theLibrary.lang", l);
  } catch (e) {}
}

// Drop shadow for objects lying on the table (lift = how high they are)
function objectShadow(lift) {
  let ctx = drawingContext;
  ctx.shadowColor = lift > 0 ? "rgba(0, 0, 0, 0.55)" : "rgba(0, 0, 0, 0)";
  ctx.shadowBlur = 16 * lift * screenScale;
  ctx.shadowOffsetX = 6 * lift * screenScale;
  ctx.shadowOffsetY = 10 * lift * screenScale;
}

function mouseOver(x, y, w, h) {
  let mx = mouseX / screenScale;
  let my = mouseY / screenScale;
  return abs(mx - x) < w / 2 && abs(my - y) < h / 2;
}
