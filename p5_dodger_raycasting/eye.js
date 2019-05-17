class Eye extends VisionRay{
  constructor(parent, offsetX, offsetY, angle) {
    super(parent.x + offsetX, parent.y + offsetY, angle);

    this.parent = parent;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  setPos() {
    super.setPos(this.parent.x + this.offsetX, this.parent.y + this.offsetY);
  }
}