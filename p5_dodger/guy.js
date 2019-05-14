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
  }
}