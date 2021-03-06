class Guy {
  constructor(brain, noMutate) {
    this.width = 20;
    this.height = this.width * 2;
    this.y = height - (this.height + 20);
    this.x = (width / 2) - (this.width / 2);
    this.gravity = 0.4;
    this.lift = -10;
    this.speed = 1;
    this.velocityY = 0;
    this.velocityX = 0;
    this.maxVelocityX = 10;
    this.maxVelocityY = 20;
    this.friction = 0.9;
    this.score = 0;
    this.fitness = 0;

    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      if (!noMutate) {
        this.brain.mutate(0.05);
      }
    } else {
      //Nerual network 4 inputs 8 hidden nodes 4 outputs
      this.brain = new NeuralNetwork(9, 16, 32, 16, 4);
    }

    this.color = this.getColor();
  }

  copy() {
    return new Guy(this.brain);
  }

  show() {
    fill(this.color);
    rect(this.x, this.y, this.width, this.height);
  }

  think(obstacles) {
    //Info about closet obstacle moving down
    let movingDownX = width;
    let movingDownY = height;
    let movingDownDist = height;

    //Info about closet obstacle moving left
    let movingLeftX = width;
    let movingLeftY = height;
    let movingLeftDist = width;
    let onGround = this.onGround();

    //Find closest obstacles
    for (let i = 0; i < obstacles.length; i++) {
      if (obstacles[i].velocityY > 1) {
        let diffMovingDown = dist(this.x + (this.width / 2), this.y, (obstacles[i].x + obstacles[i].width / 2), obstacles[i].y);

        if (diffMovingDown < movingDownDist) {
          movingDownDist = diffMovingDown;
          movingDownX = obstacles[i].x;
          movingDownY = obstacles[i].y;
        }
      } else if (obstacles[i].velocityX < 1) {
        let diffMovingLeft = dist(this.x + (this.width / 2), this.y, (obstacles[i].x + obstacles[i].width / 2), obstacles[i].y);

        if (diffMovingLeft < movingLeftDist) {
          movingLeftDist = diffMovingLeft;
          movingLeftX = obstacles[i].x;
          movingLeftY = obstacles[i].y;
        }
      }
    }

    //Create neural network inputs
    let inputs = [];

    //Think about self
    inputs[0] = map(this.x, 0, width, 0, 1);
    inputs[1] = onGround;
    inputs[2] = map(this.velocityX, this.velocityX * -1, this.maxVelocityX, 0, 1);

    //Think about closest obstacle moving down
    inputs[3] = map(movingDownX, 0, width, 0, 1);
    inputs[4] = map(movingDownY, 0, height, 0, 1);
    inputs[5] = map(movingDownDist, 0, height, 0, 1);

    //Think about closest obstacle moving left
    inputs[6] = map(movingLeftX, 0, width, 0, 1);
    inputs[7] = map(movingLeftY, height - 40, height - 20, 0, 1);
    inputs[8] = map(movingLeftDist, -1 * width, width, 0, 1);

    // Get the outputs from the network
    let output = this.brain.predict(inputs);

    //Make movement decisions
    if (output[0] > 0.5) {
      this.left();
    }
    if (output[1] > 0.5) {
      this.right();
    }
    if (output[2] > 0.5) {
      this.up();
    }
    if (output[3] > 0.5) {
      this.duck();
    } else {
      this.stand();
    }
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

  onGround() {
    if (this.y === height - this.height){
      return 1;
    } else {
      return 0;
    }
  }

  offScreen() {
    if (this.x < 0 || this.x + this.width > width) {
      return true;
    } else {
      return false;
    }
  }

  stand() {
    this.height = this.width * 2;
  }

  update() {
    //apply gravity and move up and down
    this.velocityY += this.gravity;

    if (this.velocityY > this.maxVelocityY) {
      this.velocityY = this.maxVelocityY;
    }

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

    this.score++;
  }

  dispose() {
    this.brain.dispose();
  }

  getColor() {
    let colorCode = [255,255,255];
    const weightValues = this.brain.getWeights();

    let colorVal0 = 0;
    let colorVal1 = 0;
    let colorVal2 = 0;
    for (let weight of weightValues[0]) {
      colorVal0 += weight;
    }
    for (let weight of weightValues[2]) {
      colorVal1 += weight;
    }
    for (let weight of weightValues[4]) {
      colorVal2 += weight;
    }

    colorCode[0] = map(colorVal0, -1, 1, 0, 255);
    colorCode[1] = map(colorVal1, -1, 1, 0, 255);
    colorCode[2] = map(colorVal2, -1, 1, 0, 255);
    
    return colorCode;
  }
}