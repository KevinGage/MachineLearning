class Obstacle {
  constructor(side) {
    this.color = 'blue';
    this.width = 64;
    this.height = this.width;
    let rng = random();

    if (side === 'right') {
      this.x = width - this.width;
      this.y = random(height - this.height);
      this.velocityX = -3;
      this.velocityY = 0;
    } else if (side === 'left') {
      this.x = 0;
      this.y = random(height - this.height);
      this.velocityX = 3;
      this.velocityY = 0;
    } else if (side === 'top') {
      this.x = random(width - this.width);
      this.y = 0;
      this.velocityX = 0;
      this.velocityY = 3;
    } else if (side === 'bottom') {
      this.x = random(width - this.width);
      this.y = height;
      this.velocityX = 0;
      this.velocityY = -3;
    } else if (side === 'center_top') {
      this.x = (width / 2) - (this.width / 2);
      this.y = 0;
      this.velocityX = 0;
      this.velocityY = 3;
    } else if (side === 'center_right') {
      this.x = width - this.width;
      this.y = (height / 2) - (this.height / 2);
      this.velocityX = -3;
      this.velocityY = 0;
    }

    this.leftBorder = new Boundary(this.x, this.y, this.x, this.y + this.height);
    this.rightBorder = new Boundary(this.x + this.width, this.y, this.x + this.width, this.y + this.height);
    this.topBorder = new Boundary(this.x, this.y, this.x + this.width, this.y);
    this.bottomBorder = new Boundary(this.x, this.y + this.height, this.x + this.width, this.y + this.height);

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
    square(this.x, this.y, this.width);
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;

    this.leftBorder.setPos(this.x, this.y, this.x, this.y + this.height);
    this.rightBorder.setPos(this.x + this.width, this.y, this.x + this.width, this.y + this.height);
    this.topBorder.setPos(this.x, this.y, this.x + this.width, this.y);
    this.bottomBorder.setPos(this.x, this.y + this.height, this.x + this.width, this.y + this.height);
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