class Guy {
  constructor() {
    this.color = 'green';
    this.width = 64;
    this.height = this.width;
    this.y = (height / 2) - (this.height / 2);
    this.x = (width / 2) - (this.width / 2);
    this.gravity = 0;
    this.speed = 10;

    this.eyes = [];

    this.upLeftEye = new Eye(this, 0, 0, 270, false, false);
    this.upCenterEye = new Eye(this, 0.5, 0, 270, false, false),
    this.upRightEye = new Eye(this, 1, 0, 270, false, false);
    this.downLeftEye = new Eye(this, 0, 1, 90, false, false);
    this.downCenterEye = new Eye(this, 0.5, 1, 90, false, false);
    this.downRightEye = new Eye(this, 1, 1, 90, false, false);
    this.rightFloatingEye = new Eye(this, 1, -.25, 0, false, false);
    this.rightTopEye = new Eye(this, 1, .25, 0, false, false);
    this.rightBottomEye = new Eye(this, 1, .75, 0, false, false);
    this.leftFloatingEye = new Eye(this, 0, -.25, 180, false, false);
    this.leftTopEye = new Eye(this, 0, .25, 180, false, false);
    this.leftBottomEye = new Eye(this, 0, .75, 180, false, false);

    this.eyes.push(this.upLeftEye);
    this.eyes.push(this.upCenterEye);
    this.eyes.push(this.upRightEye);
    this.eyes.push(this.downLeftEye);
    this.eyes.push(this.downCenterEye);
    this.eyes.push(this.downRightEye);
    this.eyes.push(this.rightFloatingEye);
    this.eyes.push(this.rightTopEye);
    this.eyes.push(this.rightBottomEye);
    this.eyes.push(this.leftFloatingEye);
    this.eyes.push(this.leftTopEye);
    this.eyes.push(this.leftBottomEye);
  }

  show() {
    fill(this.color);
    rect(this.x, this.y, this.width, this.height);
  }

  up() {
    if (this.y > 0){
      this.y -= this.speed;
    }
  }

  down() {
    if (this.y < height - this.height) {
      this.y += this.speed;
    }
  }

  left() {
    if (this.x > 0) {
      this.x -= this.speed;
    }
  }

  right() {
    if (this.x < width - this.width) {
      this.x += this.speed;
    }
  }

  look(boundaries) {
    push();
    stroke(255);
    let points = [];

    for (let eye of this.eyes) {
      let smallestDistance = Infinity;
      let closestPoint = null;

      for (let boundary of boundaries) {
        let pt = eye.check(boundary);
        if (pt) {
          let distance = dist(eye.pos.x, eye.pos.y, pt.x, pt.y);
          if (distance < smallestDistance) {
            smallestDistance = distance
            closestPoint = pt;
          }
        }
      }
      if (closestPoint) {
        points.push(closestPoint);
      }
    }

    for (let point of points) {
      ellipse(point.x, point.y, 10, 10);
    }

    pop();
  }

  update() {
    //Update eye position
    for (let eye of this.eyes) {
      eye.setPos();
    }
  }
}