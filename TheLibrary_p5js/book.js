let bookImage;
let burnedImage;
let tableImage;
let bookBase;
let burnedBase;
let burnLayer;
let glowLayer;
let bookShadow;
let lastBurnFrame = -1;

const bookArea = { x: 96, y: 8, w: 1728, h: 972 };
const burnArea = { x: 172, y: 39, w: 1575, h: 908 };
const pages = [
  { x: 321, y: 51 },
  { x: 962, y: 51 }
];
const pageScale = 0.66;

function createBook() {
  bookBase = createGraphics(1920, 1080);
  bookBase.pixelDensity(1);
  bookBase.image(tableImage, 0, 0, 1920, 1080);
  bookBase.image(bookImage, bookArea.x, bookArea.y, bookArea.w, bookArea.h);

  burnedBase = createGraphics(1920, 1080);
  burnedBase.pixelDensity(1);
  burnedBase.image(tableImage, 0, 0, 1920, 1080);
  burnedBase.image(burnedImage, bookArea.x, bookArea.y, bookArea.w, bookArea.h);

  burnLayer = createGraphics(1920, 1080);
  burnLayer.pixelDensity(1);

  bookShadow = createGraphics(960, 540);
  bookShadow.pixelDensity(1);
  bookShadow.image(bookImage, bookArea.x / 2, bookArea.y / 2, bookArea.w / 2, bookArea.h / 2);
  bookShadow.image(burnedImage, bookArea.x / 2, bookArea.y / 2, bookArea.w / 2, bookArea.h / 2);

  glowLayer = createGraphics(960, 540);
  glowLayer.pixelDensity(1);
  video.createMask();
}

function drawBook() {
  image(bookBase, 0, 0);

  push();
  translate(pages[0].x, pages[0].y);
  scale(pageScale);
  drawTitle();
  pop();

  drawText();

  if (floor(video.currentFrame) != lastBurnFrame) updateBurn();
  image(burnLayer, 0, 0);

  push();
  blendMode(ADD);
  drawingContext.globalAlpha = (170 + 85 * noise(millis() * 0.003)) / 255;
  image(glowLayer, 0, 0, 1920, 1080);
  pop();

  drawTypedLetters();
}

function updateBurn() {
  lastBurnFrame = floor(video.currentFrame);

  burnLayer.clear();
  burnLayer.image(burnedBase, 0, 0);
  burnLayer.drawingContext.globalCompositeOperation = "destination-in";
  video.drawMask(burnLayer, burnArea.x, burnArea.y, burnArea.w, burnArea.h);
  burnLayer.drawingContext.globalCompositeOperation = "source-over";

  glowLayer.clear();
  video.drawGlow(glowLayer, burnArea.x / 2, burnArea.y / 2, burnArea.w / 2, burnArea.h / 2);
  glowLayer.drawingContext.globalCompositeOperation = "destination-in";
  glowLayer.image(bookShadow, 0, 0);
  glowLayer.drawingContext.globalCompositeOperation = "source-over";
}

function drawTitle() {
  blendMode(MULTIPLY);
  imageMode(CENTER);
  let logo = logos[lang];
  image(logo, 480, 125, 300, 300 * logo.height / logo.width);
  imageMode(CORNER);
  blendMode(BLEND);
}
