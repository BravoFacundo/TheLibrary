class VideoFrames {
  constructor(path, glowPath, cantFrames) {
    this.cantFrames = cantFrames;
    this.columns = 16;
    this.frameW = 384;
    this.frameH = 216;
    this.currentFrame = 0;
    this.speed = 0;
    this.pendingRewind = 0;
    this.rewinding = false;
    this.burstFrames = 6;
    this.rewindSpeed = 0.5;

    this.sheet = loadImage(path);
    this.glowPath = glowPath;
    this.glowSheet = null;
  }

  createMask() {
    this.sheet.loadPixels();
    let p = this.sheet.pixels;
    for (let i = 0; i < p.length; i += 4) {
      p[i + 3] = p[i];
      p[i] = 255;
      p[i + 1] = 255;
      p[i + 2] = 255;
    }
    this.sheet.updatePixels();
  }

  update() {
    let step = min(deltaTime, 100) / (1000 / 60);
    if (this.pendingRewind >= this.burstFrames) this.rewinding = true;

    if (this.rewinding) {
      let back = min(this.pendingRewind, this.rewindSpeed * step);
      this.pendingRewind -= back;
      this.currentFrame -= back;
      if (this.pendingRewind <= 0 || this.currentFrame <= 0) {
        this.pendingRewind = 0;
        this.rewinding = false;
      }
    } else {
      this.currentFrame += this.speed * step;
    }
    this.currentFrame = constrain(this.currentFrame, 0, this.cantFrames - 1);
  }

  drawFrame(img, x, y, w, h, pg = window) {
    let i = floor(this.currentFrame);
    let sx = (i % this.columns) * this.frameW;
    let sy = floor(i / this.columns) * this.frameH;
    pg.image(img, x, y, w, h, sx, sy, this.frameW, this.frameH);
  }

  drawMask(pg, x, y, w, h) {
    this.drawFrame(this.sheet, x, y, w, h, pg);
  }

  // The glow loads after the game starts, so the book appears sooner
  loadGlow() {
    loadImage(this.glowPath, img => this.glowSheet = img);
  }

  drawGlow(pg, x, y, w, h) {
    if (!this.glowSheet) return;
    this.drawFrame(this.glowSheet, x, y, w, h, pg);
  }

  rewind(frames) {
    this.pendingRewind += frames;
  }

  finishRewind() {
    if (this.pendingRewind > 0) this.rewinding = true;
  }

  setSpeed(v) {
    this.speed = v;
  }

  setFrame(v) {
    this.currentFrame = v;
    this.pendingRewind = 0;
    this.rewinding = false;
  }
}
