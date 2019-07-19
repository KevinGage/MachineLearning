class VisionRay {
  constructor(x, y, angle, fixedX, fixedY) {
    this.pos = createVector(x, y);
    this.dir = p5.Vector.fromAngle(radians(angle));
    this.fixedX = fixedX;
    this.fixedY = fixedY;
  }

  show() {
    stroke(255);
    push();
    //Translate sets the relative 0,0 position of this object
    translate(this.pos.x, this.pos.y);
    //Draw a line from the new relative 0,0 to the direction
    line(0, 0, this.dir.x, this.dir.y);
    pop();
  }

  setDir(x, y) {
    this.dir.x = x - this.pos.x;
    this.dir.y = y - this.pos.y;
    this.dir.normalize();
  }

  setPos(x, y) {
    if (!this.fixedX){
      this.pos.x = x;
    }
    if (!this.fixedY){
      this.pos.y = y;
    }
  }

  check(boundary) {
    //Get start and end points of boundary line
    const x1 = boundary.a.x;
    const y1 = boundary.a.y;
    const x2 = boundary.b.x;
    const y2 = boundary.b.y;

    //Get two points on this line
    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;

    //From wikipedia formula to determine if lines are exactly parallel
    //https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den == 0) {
      return null;
    }

    //From wikipedia formula to determine if lines intersect 
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && t < 1 && u > 0){
      //The lines intersect find the intersection point
      const pt = createVector();
      pt.x = x1 + t * (x2 - x1);
      pt.y = y1 + t * (y2 - y1);

      return pt;
    } else {
      //The lines don't intersect
      return null;
    }
  }
}