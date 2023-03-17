//----- Processing Mapping Library
import deadpixel.keystone.*;
Keystone ks;
CornerPinSurface surface1;
CornerPinSurface surface2;
PGraphics p1;
PGraphics p2;


//----- Processing Video Library
import processing.video.*;
VideoFrames video;
float videoSpeed = 0.6;

String gameState = "Playing";
//"Playing" = Playing          - Changes are allowed
//"Win"     = Win              - No changes allowed
//"Lose"    = Lose             - No changes allowed
//"Reverse" = Reverse playback - No changes allowed


//----- Writing Input System
int lines = 7;
int linesSplit = lines % 2 == 0 ? lines / 2 : lines / 2 + 1;
String[] lineStrings = new String[lines];
int charactersPerLine = 29;

int currentCharactersToWin = 120;
int charactersToWin;
int currentLine = 0;

boolean safety = true;
boolean safetyKey = false;
boolean pressingKeys = false;
boolean firstPressedKey = false;

boolean pressKeys;
float counter = 1;
float contadorMemoria = 2;
float timeWithoutPressingKeys = 0;


//----- Save Texts
boolean currentTextIsSaved = false;
String[] lineStringsToSave = new String[1];
int nameID = 1;


//----- Design
PFont font;
PImage logo;


void setup() 
{

  size(1920, 1080, P3D);

  //----- Mapping
  ks = new Keystone(this);
  surface1 = ks.createCornerPinSurface(width/2, height, 20);
  surface2 = ks.createCornerPinSurface(width/2, height, 20);
  p1= createGraphics(width/2, height, P3D);
  p2= createGraphics(width/2, height, P3D);
  ks.load();

  //----- Video
  video = new VideoFrames(this, "Burn.mov");
  video.SetSpeed(videoSpeed); //frameRate(30);

  //----- Input System
  for (int i = 0; i < lines; i++)
  {
    lineStrings[i] = "";
  }
  lineStringsToSave[0] = "";
  charactersToWin = currentCharactersToWin; //se igualan las variables clon para su posterior uso

  //----- Design
  font = createFont("TheQueen.ttf", 50);
  logo = loadImage("Logo_TheLibrary.png");
  logo.resize(350, 350);
}

void draw() 
{

  video.Update();

  if (video.initialize) 
  {
    video.Play();
    image(video.getFrame(), 0, 1);
    
    if (gameState == "Lose")    video.SetSpeed(0);
    if (gameState == "Reverse") video.SetSpeed(-1);
    if (gameState == "Playing") video.SetSpeed(videoSpeed);
    if (gameState == "Win")     video.SetSpeed(0);

    if (pressingKeys)
    { 
      if (!firstPressedKey) 
      {
        videoSpeed = 1;
        firstPressedKey = true;
      }
    }
    
    if (firstPressedKey && video.currentFrame < 2 && currentCharactersToWin < 0) 
    {
      gameState = "Win";
      println("Win");
    }

    if (pressKeys)
    {
      counter -= 1.0 / frameRate;
      videoSpeed = -0.5;
      if (counter<=0) pressKeys =  false;
    } else if (firstPressedKey) 
    {
      videoSpeed = 1;
    }

    //----- Mapping

    p1.beginDraw();
    //background(232, 223, 176);
    p1.blend(video.getFrame(), 0, 0, width/2, height, 0, 0, width/2, height, BLEND);
    drawText();
    p1.endDraw();

    p2.beginDraw();
    //background(232, 223, 176);
    p2.blend(video.getFrame(), 0, 0, width/2, height, 0, 0, width/2, height, DARKEST);
    drawText();
    if (gameState == "Win") p2.image (logo, p2.width/2, p2.height- p2.height/6);
    p2.endDraw();

    //----- Save Texts
    
    if (timeWithoutPressingKeys/frameRate >= 60)
    {
      if (!currentTextIsSaved) 
      {        
        SaveText();
        currentTextIsSaved = true;
        println("Text has been saved correctly");
      }
    }

    //background(0); //(232, 223, 176)
    surface1.render(p1);
    surface2.render(p2);
  }
}
