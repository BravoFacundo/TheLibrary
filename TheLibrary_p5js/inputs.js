function keyPressed() {
  startAudio();
  if (keyCode == ESCAPE) {
    if (openedPage >= 0) {
      openedPage = -1;
      playSound("paper", 0.4, 1.1);
    }
    else if (gameState == "Library") leaveLibrary();
    else if (gameState == "Sign") signPage();
    return false;
  }
  if (gameState == "Sign") {
    lastKeyPressed = millis();
    if (keyCode == BACKSPACE) signature = signature.slice(0, -1);
    if (keyCode == ENTER) signPage();
    if (keyCode == BACKSPACE) playSound("pen1", penVolume * 0.5, 0.8);
    if (keyCode == BACKSPACE || keyCode == ENTER) return false;
    return;
  }
  if (gameState == "Library" && openedPage < 0) {
    lastKeyPressed = millis();
    if (keyCode == LEFT_ARROW) changeTable(-1);
    if (keyCode == RIGHT_ARROW) changeTable(1);
    return;
  }
  if (gameState != "Playing" || openedPage >= 0) return;

  lastKeyPressed = millis();
  if (!firstPressedKey) {
    clearText();
    firstPressedKey = true;
  }

  if (keyCode == BACKSPACE) {
    deleteCharacter();
    playSound("pen1", penVolume * 0.5, 0.8);
    return false;
  }
  if (keyCode == ENTER) {
    newLine();
    return false;
  }
}

function keyTyped() {
  if (gameState == "Sign" && key.length == 1) {
    if (signature.length < maxSignature) {
      signature += key;
      playPen();
    }
    return false;
  }
  if (gameState != "Playing" || openedPage >= 0 || key.length != 1) return;

  let before = countCharacters();
  write(key);
  if (countCharacters() > before) {
    addTypedLetter();
    playPen();
  }
  if (countCharacters() > before || bookFull()) video.rewind(rewindPerCharacter(before));
  return false;
}

function mouseMoved() {
  if (gameState == "Library") lastKeyPressed = millis();
}

function mousePressed() {
  startAudio();
  if (gameState == "Library") lastKeyPressed = millis();
  if (libraryClick()) return;

  let mx = mouseX / screenScale;
  let my = mouseY / screenScale;
  for (let b of buttons) {
    if (abs(mx - b.x) < b.w / 2 && abs(my - b.y) < b.h / 2) {
      playSound("tic", 0.5);
      b.action();
    }
  }
}
