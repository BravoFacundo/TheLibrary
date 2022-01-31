class Video_Frames {
  boolean actualizar;
  float velocidad;
  int cantFrames;
  Movie video;
  ArrayList<PImage> imgs;
  float frameActual;
  boolean init;
  Video_Frames(PApplet p5, String nombre) {
    video = new Movie(p5, nombre);
    video.play();
    imgs = new ArrayList<PImage>();
  }

  void play() {
    actualizar = true;
  }
  void stop() {
    actualizar = false;
  }
  void actualizar() {
    if (actualizar && init) {
      println(frameActual, " ", velocidad);
      frameActual += velocidad;
      frameActual = constrain(frameActual, 0.1, cantFrames-1);
    } else if (!init) {
      if (video.duration()-video.time()>0.1) {
        if (video.available()) {
          video.read();
          PImage img = video.copy();
          image(img, 0, 0);
          img.resize(640, 480);// resolución
          //---- agregar cualquier proceso que la imagen necesite
          imgs.add(img);
          //println(imgs.size());
        }
      } else {
        init = true;
        cantFrames = imgs.size();
      }
    }
  }

  void setVelocidad(float v) {
    velocidad = v;
  }

  void saltarAlFinal() {
    frameActual = cantFrames-1;
  }

  void saltarAlInicio() {
    frameActual = 1;
  }

  PImage getFrame() {
    return init?imgs.get(int(frameActual)):null;
  }

  void setFrame(float v) {
    frameActual = v;
  }
}
