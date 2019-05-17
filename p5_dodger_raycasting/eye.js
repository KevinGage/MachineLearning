class Eye extends VisionRay{
  constructor(guyX, guyY, offsetX, offsetY, angle) {
    super(guyX + offsetX, guyY + offsetY, angle);

    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  setPos(guyX, guyY) {
    super.setPos(guyX + this.offsetX, guyY + this.offsetY);
  }
}