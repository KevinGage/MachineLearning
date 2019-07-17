class Eye extends VisionRay{
  //This class takes in a parent object, an x offset, a y offset, and an angle in degrees.
  //
  //The parent object must have the following properties
  // .x = x position
  // .y = y position
  // .width = object width
  // .height = object height
  //
  //The x and y offsets are a percentage of the width and height.
  //Example offsets
  //offsetX = 1 would mean this eye would be on the right side of the parent
  //offsetX = 0 would mean this eye would be on the left side of the parent
  //offsetX = 0.5 would mean this eye would be horizontally centered on the parent
  //
  //Any time setPos is called the eye will be reloacted in the correct relative position even if the parent x,y,width,or height change
  constructor(parent, offsetX, offsetY, angle) {
    super(parent.x + (parent.width * offsetX), parent.y + (parent.height * offsetY), angle);

    this.parent = parent;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  setPos() {
    super.setPos(this.parent.x + (this.parent.width * this.offsetX), this.parent.y + (this.parent.height * this.offsetY));
  }
}