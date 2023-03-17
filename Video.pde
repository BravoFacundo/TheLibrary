class VideoFrames {
  Movie video;
  boolean update;
  boolean initialize;

  float currentFrame;
  float speed;
  int cantFrames;

  ArrayList<PImage> imgs;

  VideoFrames(TheLibrary processingSketch, String nombre) {
    video = new Movie(processingSketch, nombre);
    video.play();
    imgs = new ArrayList<PImage>();
  }

  void Play()
  {
    update = true;
  }
  void Stop() 
  {
    update = false;
  }

  void Update()
  {
    if (update && initialize)
    {
      currentFrame += speed;
      currentFrame = constrain(currentFrame, 0.1, cantFrames-1); //println(frameActual, " ", velocidad);
    } else if (!initialize)
    {
      //si no estas en el ultimo frame
      if (video.duration() - video.time() > 0.1) {
        if (video.available()) {
          video.read();
          PImage img = video.copy();
          image(img, 0, 0);
          img.resize(640, 480); // resolución
          //---- agregar cualquier proceso que la imagen necesite
          imgs.add(img);
          //println(imgs.size());
        }
      } else {
        initialize = true;
        cantFrames = imgs.size();
      }
    }
  }

  void SetSpeed(float v) 
  {
    speed = v;
  }
  
  PImage getFrame() 
  {
    return initialize?imgs.get(int(currentFrame)):null;
  }
  void SetFrame(float v) 
  {
    currentFrame = v;
  }

  void JumpToEnd() 
  {
    currentFrame = cantFrames - 1;
  }
  void JumpToStart() 
  {
    currentFrame = 1;
  }
}
