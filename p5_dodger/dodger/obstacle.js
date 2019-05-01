class Obstacle {
  constructor(side) {
    this.color = 'red';
    this.width = 64;
    this.height = this.width;
    let rng = random();

    if (side === 'right') {
      this.x = width - this.width;
      if (rng < 0.5) {
        this.y = height - this.height;
      } else {
        this.y = height - (this.height * 2);
      }
      this.velocityX = -5;
      this.velocityY = 0;
    } else if (side === 'left') {
      this.x = 0;
      if (rng < 0.5) {
        this.y = height - this.height;
      } else {
        this.y = height - (this.height * 2);
      }
      this.velocityX = 5;
      this.velocityY = 0;
    } else if (side === 'top') {
      this.x = random(width - this.width);
      this.y = 0;
      this.velocityX = 0;
      this.velocityY = 3;
    }
  }

  show () {
    fill(this.color);
    square(this.x, this.y, this.width);
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
}