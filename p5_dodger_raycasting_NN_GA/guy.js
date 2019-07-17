class Guy {
  constructor(brain, noMutate) {
    this.width = 20;
    this.height = this.width * 2;
    this.y = height - (this.height + 1);
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

    this.eyes = [];

    this.upLeftEye = new Eye(this, 0, 0, 270);
    this.upCenterEye = new Eye(this, 0.5, 0, 270),
    this.upRightEye = new Eye(this, 1, 0, 270);
    this.downLeftEye = new Eye(this, 0, 1, 90);
    this.downCenterEye = new Eye(this, 0.5, 1, 90);
    this.downRightEye = new Eye(this, 1, 1, 90);
    this.rightFloatingEye = new Eye(this, 1, -.25, 0);
    this.rightTopEye = new Eye(this, 1, .25, 0);
    this.rightBottomEye = new Eye(this, 1, .75, 0);
    this.leftFloatingEye = new Eye(this, 0, -.25, 180);
    this.leftTopEye = new Eye(this, 0, .25, 180);
    this.leftBottomEye = new Eye(this, 0, .75, 180);

    this.eyes.push(this.upLeftEye);
    this.eyes.push(this.upCenterEye);
    this.eyes.push(this.upRightEye);
    this.eyes.push(this.downLeftEye);
    this.eyes.push(this.downCenterEye);
    this.eyes.push(this.downRightEye);
    this.eyes.push(this.rightFloatingEye);
    this.eyes.push(this.rightTopEye);
    this.eyes.push(this.rightBottomEye);
    this.eyes.push(this.leftFloatingEye);
    this.eyes.push(this.leftTopEye);
    this.eyes.push(this.leftBottomEye);

    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      if (!noMutate) {
        this.brain.mutate(0.05);
      }
    } else {
      //Nerual network 4 inputs 8 hidden nodes 4 outputs
      this.brain = new NeuralNetwork(30, 60, 60, 4);
    }

    this.color = this.getColor();
  }

  getColor() {
    let colorCode = [255,255,255];
    const weightValues = this.brain.getWeights();

    // console.log(JSON.stringify(weightValues[0]));
    // noLoop();
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

    // return 'green';
  }

  think(boundaries) {
    let onGround = this.onGround();

    // Get all distances from eyes to their closest boundaries
    // If there are 12 eyes this should be 12 distances
    let closestBoundaryDisatances = [];

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
        closestBoundaryDisatances.push(dist(closestPoint.x, closestPoint.y, eye.pos.x, eye.pos.y));
      }
    }

    // Create neural network inputs
    let inputs = [];

    // Think about self
    // Get own x position
    inputs[0] = map(this.x, 0, width - this.width, 0, 1);
    // Get own y position, remember ducking...
    inputs[1] = map(this.y, 0, height, 0, 1);
    // Useful to know if on ground for jumping and ducking
    inputs[2] = onGround;

    // Think about each eyes boundary distance.  Assuming 12
    inputs[3] = closestBoundaryDisatances[0];
    inputs[4] = closestBoundaryDisatances[1];
    inputs[5] = closestBoundaryDisatances[2];
    inputs[6] = closestBoundaryDisatances[3];
    inputs[7] = closestBoundaryDisatances[4];
    inputs[8] = closestBoundaryDisatances[5];
    inputs[9] = closestBoundaryDisatances[6];
    inputs[10] = closestBoundaryDisatances[7];
    inputs[11] = closestBoundaryDisatances[8];
    inputs[12] = closestBoundaryDisatances[9];
    inputs[13] = closestBoundaryDisatances[10];
    inputs[14] = closestBoundaryDisatances[11];

    // Now think about all of the previous positions
    // This allows for detection of movement direction
    // During the first loop there is no history so just reuse same values

    if (!this.previousInputs){
      this.previousInputs = [];

      for (let input of inputs) {
        this.previousInputs.push(input);
      }
    }

    inputs[15] = this.previousInputs[0];
    inputs[16] = this.previousInputs[1];
    inputs[17] = this.previousInputs[2];
    inputs[18] = this.previousInputs[3];
    inputs[19] = this.previousInputs[4];
    inputs[20] = this.previousInputs[5];
    inputs[21] = this.previousInputs[6];
    inputs[22] = this.previousInputs[7];
    inputs[23] = this.previousInputs[8];
    inputs[24] = this.previousInputs[9];
    inputs[25] = this.previousInputs[10];
    inputs[26] = this.previousInputs[11];
    inputs[27] = this.previousInputs[12];
    inputs[28] = this.previousInputs[13];
    inputs[29] = this.previousInputs[14];

    // Get the outputs from the network
    let output = this.brain.predict(inputs);

    // Remember inputs for next time
    this.previousInputs[0] = inputs[0];
    this.previousInputs[1] = inputs[1];
    this.previousInputs[2] = inputs[2];
    this.previousInputs[3] = inputs[3];
    this.previousInputs[4] = inputs[4];
    this.previousInputs[5] = inputs[5];
    this.previousInputs[6] = inputs[6];
    this.previousInputs[7] = inputs[7];
    this.previousInputs[8] = inputs[8];
    this.previousInputs[9] = inputs[9];
    this.previousInputs[10] = inputs[10];
    this.previousInputs[11] = inputs[11];
    this.previousInputs[12] = inputs[12];
    this.previousInputs[13] = inputs[13];
    this.previousInputs[14] = inputs[14];

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

  copy() {
    return new Guy(this.brain);
  }

  dispose() {
    this.brain.dispose();
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

  onGround() {
    if (this.y === height - this.height){
      return 1;
    } else {
      return 0;
    }
  }

  offScreen() {
    if (this.x == 0 || this.x + this.width == width) {
      return true;
    } else {
      return false;
    }
  }

  look(boundaries) {
    // push();
    // stroke(255);
    // let points = [];

    // for (let eye of this.eyes) {
    //   let smallestDistance = Infinity;
    //   let closestPoint = null;

    //   for (let boundary of boundaries) {
    //     let pt = eye.check(boundary);
    //     if (pt) {
    //       let distance = dist(eye.pos.x, eye.pos.y, pt.x, pt.y);
    //       if (distance < smallestDistance) {
    //         smallestDistance = distance
    //         closestPoint = pt;
    //       }
    //     }
    //   }
    //   if (closestPoint) {
    //     points.push(closestPoint);
    //   }
    // }

    // for (let point of points) {
    //   ellipse(point.x, point.y, 10, 10);
    // }

    // pop();
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

    //Update eye position
    for (let eye of this.eyes) {
      eye.setPos();
    }

    this.score++;
  }
}