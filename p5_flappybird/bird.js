class Bird {
  constructor() {
    this.y = height / 2;
    this.x = 64;
    this.width = 64;
    this.height = this.width;
    this.gravity = 0.6;
    this.lift = -10;
    this.velocity = 0;
  }

  show() {
    fill('yellow');
    square(this.x, this.y, this.width);
  }

  up() {
    this.velocity = this.lift;
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    //cant go off bottom of screen
    if (this.y >= height - this.height){
      this.y = height - this.height;
      this.velocity = 0;
    }

    //cant go off top of screen
    if (this.y <= 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }

  die() {
    
  }
}