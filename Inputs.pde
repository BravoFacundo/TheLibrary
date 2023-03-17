void keyPressed ()
{
  pressingKey = true;
  save = false;

  timeWithoutPressingKeys = 0;
  if (!firstInput)
  {
    for (int i = 0; i < lines; i++) //esto reinicia lo escrito cuando es la primera vez que escribe un nuevo usuario
    {
      s[i] = "";
    }
  }
  if (video.currentFrame > video.cantFrames -10 && !firstInput) //esto hace que el usuario note mas facilmente que se puede seguir jugando aun cuando toda la pantalla esta en negro
  { 
    //video.frameActual = video.cantFrames -100;
  }

  Write();
  CalibrateKS();
}

void keyReleased() 
{
  pressingKey = false;
  safetyKey = false;
  tocarKeys = true;
  contador = contadorMemoria;
}

void mousePressed() 
{
  if (mouseButton == RIGHT) //reinicio manual del sistema
  {
    SaveText();
    
    currentLine = 0;
    currentCharactersToWin = charactersToWin;
    
    state = 0;
    gameState = "Playing";
    
    videoSpeed = 0.7;
    video.SetFrame(0.8);
    video.SetSpeed(videoSpeed);

    firstInput = true;
    //termino = false; //no está siendo usada en otro lado
  }
}
