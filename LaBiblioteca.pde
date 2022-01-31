//----- processing video
import processing.video.*; //librería de video
Video_Frames Video;
//Movie v;
float v = 0.6; //variable que determina la velocidad de reproducción del objeto video
//----- keystone mapping
import deadpixel.keystone.*; 
Keystone ks;
CornerPinSurface surface1;
CornerPinSurface surface2; 
PGraphics p1;
PGraphics p2;
PFont mono;
PImage logo ;
//----- estado
int modo = 0; //-1 reversa automática //0 puede cambiar //1 ganaste-no cambia //-2 perdiste-no cambia
//----- escritura
int CantidadCaracteres = 29; //por renglón
int CantidadTeclas = 120;    //qué necesitas presionar 
int Renglones = 7;           //cantidad de renglones que tendrá la obra (si es impar serán menos en la segunda hoja)
int CantidadTeclasb;         //variable clon de que guarda el valor original y luego se usa para devolverlo
int mitad = Renglones%2==0?Renglones/2:Renglones/2+1; //cálculo para arreglar problemas con cantidades impares de renglones D)
String[] s = new String[Renglones];                   //string array de renglones (cada uno de los strings corresponde a un renglón)
int Renglon = 0;                                      //variable que determina en qué renglón del arreglo se escribe, es sumada y restada bajo ciertos criterios en la función escribir() de la tercera pestaña)
//----- son booleans que uso para asegurar que ciertas cosas no se pasen de lo que quiero
boolean Safety = true; 
boolean SafetyKey = false;
boolean Tocando = false; //se usa una sola vez, boolean que simula el keypressed
boolean FirstTime = false; //se usa una sola vez, boolean que cambia cosas cuando el usuario toca por primera vez una tecla (la velocidad de reproducción del video es una de esas cosas)
float Tiempo = 0; //se usa una sola vez

//----- ya no se usan
boolean Writing = false; //no se usa
int CantidadTeclasV = 0; //está comentado no se usa
float opacidadV = 0;     //está comentado no se usa
boolean termino; //está comentado no se usa

//----- para guardar
boolean Guardar = false;    //se usa para saber cuándo guardar
String[] g = new String[1]; //arreglo clon donde se guardan lo escrito en el otro arreglo
int name = 1;               //número con el cual se guarda el texto corresponde a la cantidad de usuarios y/o reinicios durante una ejecución de la aplicación 
                            //(al cerrar y volver a abrir el proyecto se reincia esta variable así que hay que guardar los textos!)

//----- D
boolean tocarKeys;         
float contador = 1; //se maneja en segundos
float contadorMemoria = 2; 

void setup() {
  size(1920, 1080, P3D);
  //size(320,240,P3D);
  //fullScreen(P3D);
  mono = createFont("TheQueen.ttf", 50);
  ks = new Keystone(this);
  surface1 = ks.createCornerPinSurface(width/2, height, 20);
  surface2 = ks.createCornerPinSurface(width/2, height, 20);
  p1= createGraphics(width/2, height, P3D);
  p2= createGraphics(width/2, height, P3D);

  logo  = loadImage("logo.png");
  logo.resize(350, 350);// resize del logo

  Video = new  Video_Frames(this, "vid.mov");
  Video.setVelocidad(v);
  //frameRate(30);
  for (int i = 0; i < Renglones; i++) {  //arreglo de texto escribir
    s[i] = "";
  } 
  g[0] = ""; //arreglo clon (no necesita más que 1 valor)
  ks.load(); //auto cargar la configuración del mapping al ejecutar
  CantidadTeclasb = CantidadTeclas; //se igualan las variables clon para su posterior uso
}

void draw() {

  Video.actualizar(); 
  if (Video.init) { // esto me dice cuando cargo el video

    Video.play();                             //los estados
    if (modo == -2) Video.setVelocidad(0);    //perdiste (no se usa)
    if (modo == -1) Video.setVelocidad(-1);   //reversa  (cuando ya cumpliste las condiciones para ganar el programa se gana solo sin importar tu participación)
    if (modo ==  0) {
      Video.setVelocidad(v);                  //ajustable(la velocidad de reproducción se ajusta sola según la interacción del usuario)
    }
    if (modo ==  1) Video.setVelocidad(0);    //ganaste  (pausa y detona el sello)
    // Video.saltarAlFinal();
    // Video.saltarAlInicio();
    image(Video.getFrame(), 0, 1);

    if (Tocando) { //la primera vez que tocas la velocidad del video se normaliza //esto ocurre hasta que se deja de tocar por 60 segundos (tiempo en el que se cambia el usuario)
      if (!FirstTime) { 
        v = 1;
        FirstTime = true;
      }
    }
    println(FirstTime, " ", Video.frameActual, " ", CantidadTeclas);
    if (FirstTime && Video.frameActual < 2 && CantidadTeclas < 0) { //con esto se gana, si ya se presionó al menos una tecla, si el video esta en su inicio y si el usuario presiono la cantidad de teclas que establecimos 
      modo = 1;
      println("POOM GANASTE");
    }


    if (tocarKeys) { // (D)
      contador-=1.0/frameRate;
      v = -0.5;
      if (contador<=0) {
        tocarKeys =  false;
      }
    } else if (FirstTime) {
      v = 1;
    }

    p1.beginDraw(); //aca se dibuja dentro de los pgraphic
    background(232, 223, 176);
    p1.blend(Video.getFrame(), 0, 0, width/2, height, 0, 0, width/2, height, DARKEST);
    drawText(); 
    p1.endDraw();

    p2.beginDraw();
    background(232, 223, 176);
    p2.blend(Video.getFrame(), 0, 0, width/2, height, 0, 0, width/2, height, DARKEST);
    drawText(); 
    if (modo ==1)    p2.image (logo, p2.width/2, p2.height- p2.height/6);
    p2.endDraw();   

    //se cuenta el tiempo sin interacción para reiniciar la experiencia por si sola (ahora mismo solo guarda el texto, pero se podría hacer una función de reinicio)
    if (Tiempo/frameRate >= 60) { //está dividido por el framerate para contar segundos reales
      if (!Guardar) {
        println("El texto se ha guardado correctamente");
        guardarString();
        Guardar = true;
      }
    } 

    //println(frameCount + " > "+Video.time());

    //background(0); //(232, 223, 176)
    surface1.render(p1);
    surface2.render(p2);
    //println(v);
  }
}



void keyPressed () {  
  Tocando = true;
  Guardar = false;
  Tiempo = 0;  //no está muy testeado, cuenta el tiempo si presionar teclas, detona guardar el string
  if (!FirstTime) {
    for (int i = 0; i < Renglones; i++) { //esto reinicia lo escrito cuando es la primera vez que escribe un nuevo usuario
      s[i] = "";
    }
  }
  if (Video.frameActual>Video.cantFrames -10 && !FirstTime) { //esto hace que el usuario note mas facilmente que se puede seguir jugando aun cuando toda la pantalla esta en negro
    //Video.frameActual = Video.cantFrames-100;
  }
  escribir(); //estas están en la pestaña "Funciones"
  calibrar();
}

void keyReleased() {
  Tocando = false;
  SafetyKey = false;
  tocarKeys = true;  
  contador = contadorMemoria;
}

void mousePressed() { 
  if (mouseButton == RIGHT) { //reinicio manual del sistema
    guardarString();
    Renglon = 0;
    CantidadTeclas = CantidadTeclasb;
    modo = 0;
    v = 0.7;
    Video.setFrame(0.8);
    Video.setVelocidad(v);

    FirstTime = true;
    //termino = false; //no está siendo usada en otro lado
  }
}
