class VideoFrames {
  Movie video;
  boolean update;
  boolean initialize;

  float currentFrame;
  float speed;
  int cantFrames;
  int framesWithoutVideo = 0;

  ArrayList<PImage> imgs;

  VideoFrames(PApplet processingSketch, String nombre) {
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
      currentFrame = constrain(currentFrame, 0.1, cantFrames-1);
    } else if (!initialize)
    {
      if (video.available()) 
      {
        video.read();
        video.loadPixels();
        PImage img = video.get();
        image(img, 0, 0, width, height);
        img.resize(640, 480);
        imgs.add(img);
        framesWithoutVideo = 0;
      } else if (imgs.size() > 0)
      {
        framesWithoutVideo++;
      }

      if (video.duration() - video.time() < 0.1 || framesWithoutVideo > 60) 
      {
        initialize = true;
        cantFrames = imgs.size();
        println("Video frames loaded: " + cantFrames);
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
