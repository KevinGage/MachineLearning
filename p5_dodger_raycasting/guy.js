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

    this.upLeftEye = new VisionRay(this.x, this.y, 270);
    this.upRightEye = new VisionRay(this.x + this.width, this.y, 270);

    this.rightTopEye = new VisionRay(this.x + this.width, this.y + this.height * .75, 0);
    this.rightBottomEye = new VisionRay(this.x + this.width, this.y + this.height * .25, 0);

    this.leftTopEye = new VisionRay(this.x, this.y + this.height * .75, 180);
    this.leftBottomEye = new VisionRay(this.x, this.y + this.height * .25, 180);
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

  look(boundary) {
    const pt1 = this.upLeftEye.check(boundary);
    const pt2 = this.upRightEye.check(boundary);
    const pt3 = this.rightTopEye.check(boundary);
    const pt4 = this.rightBottomEye.check(boundary);
    const pt5 = this.leftTopEye.check(boundary);
    const pt6 = this.leftBottomEye.check(boundary);

    push();
    stroke(255);
    if (pt1) {
      ellipse(pt1.x, pt1.y, 10, 10);
    }
    if (pt2) {
      ellipse(pt2.x, pt2.y, 10, 10);
    }
    if (pt3) {
      ellipse(pt3.x, pt3.y, 10, 10);
    }
    if (pt4) {
      ellipse(pt4.x, pt4.y, 10, 10);
    }
    if (pt5) {
      ellipse(pt5.x, pt5.y, 10, 10);
    }
    if (pt6) {
      ellipse(pt6.x, pt6.y, 10, 10);
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
    this.upLeftEye.setPos(this.x, this.y);
    this.upRightEye.setPos(this.x + this.width, this.y);
    this.rightTopEye.setPos(this.x + this.width, this.y + this.height * .75);
    this.rightBottomEye.setPos(this.x + this.width, this.y + this.height * .25);
    this.leftTopEye.setPos(this.x, this.y + this.height * .75);
    this.leftBottomEye.setPos(this.x, this.y + this.height * .25);
  }
}