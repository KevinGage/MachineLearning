class Pipe {
  constructor () {
    this.x = width;
    this.width = 80;
    this.speed = -3;
    this.top = random(0, height * 0.7);
    this.bottom = this.top + 256;
    this.color = 'green';
  }

  show () {
    fill(this.color);
    rect(this.x, 0, this.width, this.top);
    rect(this.x, this.bottom, this.width, height - this.bottom);
  }

  update () {
    this.x += this.speed;
  }

  offscreen() {
    return this.x < -1 * this.width
  }

  hits(bird) {
    if (bird.x + (bird.width / 2) >= this.x - (this.width / 2) && bird.x - (bird.width / 2) <= this.x + (this.width / 2)) {
      if (bird.y <= this.top || bird.y + bird.height >= this.bottom) {
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