//----- Video
let video;
let videoSpeed = 0.6;

let gameState = "Playing";
//"Playing" = Changes are allowed
//"Sign"    = Writing the name under the text
//"Win"     = No changes allowed
//"Library" = Table with the saved pages


//----- Writing Input System
const lines = 16;
const linesSplit = lines / 2;
let lineStrings = [];
let lineBreaks = [];
const textMarginX = 95;
const maxLineWidth = 800;
const textSizePage = 44;
const letterSpacing = 10;
const wordSpacing = 14;
const lineHeight = 84;
const firstLineY = [365, 281];
let signature = "";
const maxSignature = 22;
const charactersToWin = 252;
let currentLine = 0;

let firstPressedKey = false;
let bookSaved = false;
let lastKeyPressed = 0;
const typingMemory = 1000;
const rewindBoost = 1.1;
const restartTime = 60000;
let typedLetters = [];
const letterFade = 800;
let winTime = 0;
let fadeTime = -10000;
let settleTime = -10000;


//----- Design
let logos = {};
const paperColor = [232, 223, 176];
const inkColor = [34, 26, 20];

let screenScale = 1;

let buttons = [];
const params = new URLSearchParams(window.location.search);
let lang = params.get("lang") || savedLanguage() || navigator.language || "en";
lang = lang.startsWith("es") ? "es" : "en";
let returnToBook = false;
const texts = {
  en: {
    start: "Type to save the book",
    focus: "Click to start writing",
    keyboard: "You need a keyboard to write",
    safe: "The book is safe",
    sign: "Sign the page and press Enter",
    signature: "Signature",
    anonymous: "Anonymous",
    saved: "Page saved",
    entries: "View saved pages",
    library: "Pages saved from the fire",
    libraryInfo: "Click on them to read them",
    close: "Click to close",
    again: "Write again"
  },
  es: {
    start: "Escribí para salvar el libro",
    focus: "Hacé click para escribir",
    keyboard: "Necesitás un teclado para escribir",
    safe: "El libro está a salvo",
    sign: "Firmá la página y apretá Enter",
    signature: "Firma",
    anonymous: "Anónimo",
    saved: "Página guardada",
    entries: "Ver páginas guardadas",
    library: "Páginas que se salvaron del fuego",
    libraryInfo: "Hacé click en ellas para leerlas",
    close: "Click para cerrar",
    again: "Volver a escribir"
  }
};


function preload() {
  video = new VideoFrames("data/mask_sheet.webp", "data/glow_sheet.webp", 271);
  logos.es = loadImage("data/Logo_ES.png");
  logos.en = loadImage("data/Logo_EN.png");
  bookImage = loadImage("data/Book.webp");
  burnedImage = loadImage("data/Book_Burned.webp");
  tableImage = loadImage("data/Table.jpg");
  loadUI();
}

function savedLanguage() {
  try {
    return localStorage.getItem("theLibrary.lang");
  } catch (e) {
    return null;
  }
}

function setup() {
  let canvas = createCanvas(10, 10);
  canvas.parent("game");
  fitCanvas();
  frameRate(60);
  window.focus();

  createBook();
  // Loaded after the book is on screen: only needed later
  video.loadGlow();
  for (let i = 1; i <= 4; i++) slipImages.push(loadImage("data/Slip_" + i + ".webp"));
  loadSounds();
  loadLibrary();
  textFont("Georgia");
  loadFont("data/TheQueen.ttf", f => textFont(f), () => {});
  clearText();
  fadeTime = millis(); // fade in from the black loading screen
}

function draw() {
  video.update();

  if (gameState == "Playing") video.setSpeed(videoSpeed);
  if (gameState != "Playing") video.setSpeed(0);

  if (gameState == "Playing" && firstPressedKey) {
    if (bookSaved) videoSpeed = 0;
    else if (millis() - lastKeyPressed < typingMemory) videoSpeed = 0;
    else videoSpeed = 1;
    if (millis() - lastKeyPressed > 400) video.finishRewind();

    if (!bookSaved && video.currentFrame < 3 && countCharacters() >= charactersToWin) {
      bookSaved = true;
      settleTime = millis();
      playSound("fireStop", 0.8);
    }
    let wordFinished = endOfWord() || bookFull() || millis() - lastKeyPressed > 1000;
    if (bookSaved && wordFinished) win();
  }

  if (gameState == "Win" && millis() - winTime > 2500) showLibrary();

  if (firstPressedKey && millis() - lastKeyPressed > restartTime) {
    if (gameState == "Sign") saveToLibrary();
    restart(gameState != "Playing");
  }

  updateSound();
  scale(screenScale);
  cursor(ARROW);
  if (gameState == "Library") drawLibrary();
  else drawBook();
  drawStatus();
  drawLanguage();
  drawOpenedPage();
  drawFade();
}

function windowResized() {
  fitCanvas();
}

function fitCanvas() {
  let w = min(windowWidth, windowHeight * 16 / 9);
  resizeCanvas(floor(w), floor(w * 9 / 16));
  screenScale = width / 1920;
}
