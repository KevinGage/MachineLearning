class Guy {
  constructor(brain) {
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
      this.brain.mutate(0.1);
    } else {
      // Inputs
        // this.x
        // this.y
        // this.velocityY
        // this.velocityX
        // Some others for obstacles???
      // Hidden layer???
      // Outputs
        // move left
        // move right
        // jump
        // duck
      this.brain = new NeuralNetwork(9, 12, 4);
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
    //this is junk right now.
    // Just finds closest obstacles location and trajectory
    let closestDiffTotal = Infinity;
    let closestDiffX = Infinity;
    let closestDiffY = Infinity;
    let closestVelocityX = 0;
    let closestVelocityY = 0;
    let closesObstacle;

    for (let i = 0; i < obstacles.length; i++) {
      let diffX = obstacles[i].x - this.x;

      if (diffX < 0) {
        diffX = abs(diffX) - obstacles[i].width;
      }

      let diffY = obstacles[i].y - this.y;

      if (diffY < 0) {
        diffY = abs(diffY) - obstacles[i].height;
      }

      let diff = diffX + diffY;

      if (diff < closestDiffTotal) {
        closesObstacle = obstacles[i];
        closestDiffTotal = diff;
        closestDiffX = closesObstacle.x;
        closestDiffY = closesObstacle.y;
        closestVelocityX = closesObstacle.velocityX;
        closestVelocityY = closesObstacle.velocityY;
      }
    }

    if (closestDiffTotal != Infinity) {
      //Create neural network inputs
      let inputs = [];

      inputs[0] = map(this.x, 0, width, 0, 1);
      inputs[1] = map(this.y, 0, height, 0, 1);
      inputs[2] = map(this.velocityX, (-1 * this.maxVelocityX), this.maxVelocityX, 0, 1);
      inputs[3] = map(this.velocityY, this.lift, this.maxVelocityY, 0, 1);
      inputs[4] = map(closestDiffTotal, 0, height + width, 0, 1);
      inputs[5] = map(closestDiffX, 0, width, 0, 1);
      inputs[6] = map(closestDiffY, 0, height, 0, 1);
      inputs[7] = map(closestVelocityX, -1 * closesObstacle.maxVelocityX, closesObstacle.maxVelocityX, 0, 1);
      inputs[8] = map(closestVelocityY, 0, closesObstacle.maxVelocityY, 0, 1);
    
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
    for (let weight of weightValues[1]) {
      colorVal1 += weight;
    }
    for (let weight of weightValues[2]) {
      colorVal2 += weight;
    }

    colorCode[0] = map(colorVal0, (-1 * weightValues[0].length), weightValues[0].length, 0, 255);
    colorCode[1] = map(colorVal1, (-1 * weightValues[1].length), weightValues[1].length, 0, 255);
    colorCode[2] = map(colorVal2, (-1 * weightValues[2].length), weightValues[2].length, 0, 255);
    
    return colorCode;
  }
}