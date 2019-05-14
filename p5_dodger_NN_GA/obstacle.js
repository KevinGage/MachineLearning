class Obstacle {
  constructor(side) {
    this.color = 'blue';
    this.width = 20;
    this.height = this.width;
    let rng = random();
    this.maxVelocityX = 5;
    this.maxVelocityY = 3;

    if (side === 'right') {
      this.x = width - this.width;
      if (rng < 0.5) {
        this.y = height - this.height;
      } else {
        this.y = height - (this.height * 2);
      }
      this.velocityX = -1 * this.maxVelocityX;
      this.velocityY = 0;
    } else if (side == 'right_low') {
      this.x = width - this.width;
      this.y = height - this.height;
      this.velocityX = -1 * this.maxVelocityX;
      this.velocityY = 0;
    } else if (side === 'left') {
      this.x = 0;
      if (rng < 0.5) {
        this.y = height - this.height;
      } else {
        this.y = height - (this.height * 2);
      }
      this.velocityX = this.maxVelocityX;
      this.velocityY = 0;
    } else if (side === 'top') {
      this.width = this.width * 3;
      this.x = random(width - this.width);
      this.y = 0;
      this.velocityX = 0;
      this.velocityY = this.maxVelocityY;
    } else if (side === 'center') {
      this.width = this.width * 3;
      this.x = (width / 2) - (this.width / 2);
      this.y = 0;
      this.velocityX = 0;
      this.velocityY = this.maxVelocityY;
    }
  }

  offscreen() {
    if (this.x < (-1 * this.width)) {
      return true;
    } else if (this.x > width) {
      return true;
    } else if (this.y > height) {
      return true;
    } else {
      return false;
    }
  }

  show () {
    fill(this.color);
    rect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  hits(guy) {
    if (guy.x + guy.width >= this.x && guy.x <= this.x + this.width) {
      if (guy.y + guy.height > this.y && guy.y < this.y + this.height) {
        this.color = 'red';
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}