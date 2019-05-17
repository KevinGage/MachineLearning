class Guy {
  constructor() {
    this.color = 'green';
    this.width = 64;
    this.height = this.width * 2;
    this.y = height - (this.height + 20);
    this.x = (width / 2) - (this.width / 2);
    this.gravity = 1.3;
    this.lift = -30;
    this.speed = 1;
    this.velocityY = 0;
    this.velocityX = 0;
    this.maxVelocityX = 10;
    this.friction = 0.9;

    this.eyes = [];

    this.upLeftEye = new Eye(this.x, this.y, 0, 0, 270);
    this.upRightEye = new Eye(this.x, this.y, this.width, 0, 270);
    this.downLeftEye = new Eye(this.x, this.y, 0, this.height, 90);
    this.downRightEye = new Eye(this.x, this.y, this.width, this.height, 90);
    this.rightTopEye = new Eye(this.x, this.y, this.width, this.height * .25, 0);
    this.rightBottomEye = new Eye(this.x, this.y, this.width, this.height * .75, 0);
    this.leftTopEye = new Eye(this.x, this.y, 0, this.height * .25, 180);
    this.leftBottomEye = new Eye(this.x, this.y, 0, this.height * .75, 180);

    this.eyes.push(this.upLeftEye);
    this.eyes.push(this.upRightEye);
    this.eyes.push(this.downLeftEye);
    this.eyes.push(this.downRightEye);
    this.eyes.push(this.rightTopEye);
    this.eyes.push(this.rightBottomEye);
    this.eyes.push(this.leftTopEye);
    this.eyes.push(this.leftBottomEye);
  }

  show() {
    fill(this.color);
    rect(this.x, this.y, this.width, this.height);
  }

  up() {
    if (this.y === height - this.height){
      this.velocityY = this.lift;
    }
  }

  left() {
    if (this.velocityX >= this.maxVelocityX * -1) {
      this.velocityX -= this.speed;
    }
  }

  right() {
    if (this.velocityX <= this.maxVelocityX){
      this.velocityX += this.speed;
    }
  }

  duck() {
    if (this.y === height - this.height){
      this.y = height - this.width;
      this.height = this.width;
    }
  }

  stand() {
    this.height = this.width * 2;
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
    //apply gravity and move up and down
    this.velocityY += this.gravity;
    this.y += this.velocityY;

    //cant go off bottom of screen
    //also apply friction while on the ground
    if (this.y >= height - this.height){
      this.y = height - this.height;
      this.velocityY = 0;

      this.velocityX = this.velocityX * this.friction;
    }

    //move left and right
    this.x += this.velocityX;

    //cant go off left of screen
    if (this.x <= 0) {
      this.x = 0;
      if (this.velocityX < 0) {
        this.velocityX = 0;
      }
    }

    //cant go off right of screen
    if (this.x + this.width >= width) {
      this.x = width - this.width;
      if (this.velocityX > 0) {
        this.velocityX = 0;
      }
    }

    //Update eye position
    for (let eye of this.eyes) {
      eye.setPos(this.x, this.y);
    }
  }
}