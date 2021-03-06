class Boundary {
  constructor(x1, y1, x2, y2) {
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);
  }

  show() {
    push();
    stroke(255);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
    pop();
  }

  setPos(x1, y1, x2, y2) {
    this.a.x = x1;
    this.a.y = y1;
    this.b.x = x2;
    this.b.y = y2;
  }
}