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

//----- States
int state = 0;
String gameState = "Playing";
//-1 = Reverse playback - No changes allowed
// 0 = Playing          - Changes allowed
// 1 = Win              - No changes allowed
//-2 = Lose             - No changes allowed

//"Reverse" = Reverse playback - No changes allowed
//"Playing" = Playing          - Changes allowed
//"Win" = Win              - No changes allowed
//"Lose" = Lose             - No changes allowed

//----- Writing Input System
int lines = 7;
int linesSplit = lines % 2 == 0 ? lines / 2 : lines / 2 + 1;
String[] s = new String[lines];                   //string array de renglones (cada uno de los strings corresponde a un renglón)
int charactersPerLine = 29;

int currentCharactersToWin = 120;
int charactersToWin;
int currentLine = 0;             //variable que determina en qué renglón del arreglo se escribe, es sumada y restada bajo ciertos criterios en la función escribir() de la tercera pestaña) //Rename: agregar actual?

//----- son booleans que uso para asegurar que ciertas cosas no se pasen de lo que quiero
boolean Safety = true;
boolean safetyKey = false;
boolean pressingKey = false;    //se usa una sola vez, boolean que simula el keypressed
boolean firstInput = false;  //se usa una sola vez, boolean que cambia cosas cuando el usuario toca por primera vez una tecla (la velocidad de reproducción del video es una de esas cosas)
float timeWithoutPressingKeys = 0;           //se usa una sola vez

//----- Daniel
boolean tocarKeys;
float contador = 1;         //se maneja en segundos
float contadorMemoria = 2;

//----- Save Text
boolean save = false;    //se usa para saber cuándo guardar
String[] g = new String[1]; //arreglo clon donde se guardan lo escrito en el otro arreglo
int nameID = 1;               //número con el cual se guarda el texto corresponde a la cantidad de usuarios y/o reinicios durante una ejecución de la aplicación
//(al cerrar y volver a abrir el proyecto se reincia esta variable así que hay que guardar los textos!)

//----- Design
PFont font;
PImage logo;

//----- ya no se usan
boolean writing = false;    //no se usa
int CantidadTeclasV = 0;    //está comentado no se usa
float opacidadV = 0;        //está comentado no se usa
boolean termino;            //está comentado no se usa

void setup() {

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
  for (int i = 0; i < lines; i++) //arreglo de texto escribir
  {
    s[i] = "";
  }
  g[0] = ""; //arreglo clon (no necesita más que 1 valor)
  charactersToWin = currentCharactersToWin; //se igualan las variables clon para su posterior uso

  //----- Design
  font = createFont("TheQueen.ttf", 50);
  logo = loadImage("Logo_TheLibrary.png");
  logo.resize(350, 350);
}

void draw() {

  video.Update();

  if (video.initialize) 
  {
    video.Play();
    
    if (state == -2) video.SetSpeed(0);    //perdiste (no se usa)
    if (state == -1) video.SetSpeed(-1);   //reversa  (cuando ya cumpliste las condiciones para ganar el programa se gana solo sin importar tu participación)
    if (state ==  0) video.SetSpeed(videoSpeed);
    if (state ==  1) video.SetSpeed(0);    //ganaste  (pausa y detona el sello)
    // video.saltarAlFinal();
    // video.saltarAlInicio();
    image(video.getFrame(), 0, 1);

    if (pressingKey) //la primera vez que tocas la velocidad del video se normaliza //esto ocurre hasta que se deja de tocar por 60 segundos (tiempo en el que se cambia el usuario)
    { 
      if (!firstInput) 
      {
        videoSpeed = 1;
        firstInput = true;
      }
    }
    println(firstInput, " ", video.currentFrame, " ", currentCharactersToWin);
    if (firstInput && video.currentFrame < 2 && currentCharactersToWin < 0) //con esto se gana, si ya se presionó al menos una tecla, si el video esta en su inicio y si el usuario presiono la cantidad de teclas que establecimos
    {
      state = 1;
      gameState = "Win";
      println("Win");
    }

    if (tocarKeys) { // (D)
      contador-=1.0/frameRate;
      videoSpeed = -0.5;
      if (contador<=0) {
        tocarKeys =  false;
      }
    } else if (firstInput) {
      videoSpeed = 1;
    }

    //----- Mapping

    p1.beginDraw(); //aca se dibuja dentro de los pgraphic
    //background(232, 223, 176);
    p1.blend(video.getFrame(), 0, 0, width/2, height, 0, 0, width/2, height, BLEND);
    drawText();
    p1.endDraw();

    p2.beginDraw();
    //background(232, 223, 176);
    p2.blend(video.getFrame(), 0, 0, width/2, height, 0, 0, width/2, height, DARKEST);
    drawText();
    if (state == 1) p2.image (logo, p2.width/2, p2.height- p2.height/6);
    p2.endDraw();

    //se cuenta el tiempo sin interacción para reiniciar la experiencia por si sola (ahora mismo solo guarda el texto, pero se podría hacer una función de reinicio)
    if (timeWithoutPressingKeys/frameRate >= 60) { //está dividido por el framerate para contar segundos reales
      if (!save) {
        println("El texto se ha guardado correctamente");
        SaveText();
        save = true;
      }
    }

    //background(0); //(232, 223, 176)
    surface1.render(p1);
    surface2.render(p2);
  }
}
