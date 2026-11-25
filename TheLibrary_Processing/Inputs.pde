void keyPressed ()
{
  pressingKeys = true;
  currentTextIsSaved = false;

  timeWithoutPressingKeys = 0;
  if (!firstPressedKey)
  {
    for (int i = 0; i < lines; i++)
    {
      lineStrings[i] = "";
    }
  }
  if (video.currentFrame > video.cantFrames -10 && !firstPressedKey)
  { 
    //video.frameActual = video.cantFrames -100;
  }

  Write();
  CalibrateKS();
}

void keyReleased() 
{
  pressingKeys = false;
  safetyKey = false;
  pressKeys = true;
  counter = contadorMemoria;
}

void mousePressed() 
{
  if (mouseButton == RIGHT)
  {
    SaveText();
    
    currentLine = 0;
    currentCharactersToWin = charactersToWin;
    
    gameState = "Playing";
    
    videoSpeed = 0.7;
    video.SetFrame(0.8);
    video.SetSpeed(videoSpeed);

    firstPressedKey = true;
  }
}
