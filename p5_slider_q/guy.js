class Guy {
  constructor(brain, noMutate) {
    this.width = 20;
    this.height = this.width;
    this.y = (height / 2) - (this.height / 2);
    this.x = (width / 2) - (this.width / 2);
    this.color = "blue";
    this.speed = 6;

    this.eyes = [];

    this.upLeftEye = new Eye(this, 0, 0, 270, false, false);
    this.upRightEye = new Eye(this, 1, 0, 270, false, false);
    this.downLeftEye = new Eye(this, 0, 1, 90, false, false);
    this.downRightEye = new Eye(this, 1, 1, 90, false, false);
    this.rightTopEye = new Eye(this, 1, 0, 0, false, false);
    this.rightBottomEye = new Eye(this, 1, 1, 0, false, false);
    this.leftTopEye = new Eye(this, 0, 0, 180, false, false);
    this.leftBottomEye = new Eye(this, 0, 1, 180, false, false);

    this.eyes.push(this.upLeftEye);
    this.eyes.push(this.upRightEye);
    this.eyes.push(this.downLeftEye);
    this.eyes.push(this.downRightEye);
    this.eyes.push(this.rightTopEye);
    this.eyes.push(this.rightBottomEye);
    this.eyes.push(this.leftTopEye);
    this.eyes.push(this.leftBottomEye); 
  }

  // think(boundaries) {
  //   // Get all distances from eyes to their closest boundaries
  //   // If there are 8 eyes this should be 8 distances
  //   let closestBoundaryDisatances = [];

  //   for (let eye of this.eyes) {
  //     let smallestDistance = Infinity;
  //     let closestPoint = null;

  //     for (let boundary of boundaries) {
  //       let pt = eye.check(boundary);
  //       if (pt) {
  //         let distance = dist(eye.pos.x, eye.pos.y, pt.x, pt.y);
  //         if (distance < smallestDistance) {
  //           smallestDistance = distance
  //           closestPoint = pt;
  //         }
  //       }
  //     }
  //     if (closestPoint) {
  //       //This isn't a great way to normalize the distances.
  //       const noramlizedDistance = map(dist(closestPoint.x, closestPoint.y, eye.pos.x, eye.pos.y), 0, width, 0, 1);
  //       closestBoundaryDisatances.push(noramlizedDistance);
  //     }
  //   }

  //   // Create neural network inputs
  //   let inputs = [];

  //   // Think about self
  //   // Get own x position
  //   inputs[0] = map(this.x, 0, width - this.width, 0, 1);
  //   // Get own y position
  //   inputs[1] = map(this.y, 0, height - this.height, 0, 1);

  //   // Think about each eyes boundary distance.  Assuming 8
  //   inputs[2] = closestBoundaryDisatances[0];
  //   inputs[3] = closestBoundaryDisatances[1];
  //   inputs[4] = closestBoundaryDisatances[2];
  //   inputs[5] = closestBoundaryDisatances[3];
  //   inputs[6] = closestBoundaryDisatances[4];
  //   inputs[7] = closestBoundaryDisatances[5];
  //   inputs[8] = closestBoundaryDisatances[6];
  //   inputs[9] = closestBoundaryDisatances[7];

  //   // Now think about all of the previous positions
  //   // This allows for detection of movement direction
  //   // During the first loop there is no history so just reuse same values

  //   if (!this.previousInputs){
  //     this.previousInputs = [];

  //     for (let input of inputs) {
  //       this.previousInputs.push(input);
  //     }
  //   }

  //   inputs[10] = this.previousInputs[0];
  //   inputs[11] = this.previousInputs[1];
  //   inputs[12] = this.previousInputs[2];
  //   inputs[13] = this.previousInputs[3];
  //   inputs[14] = this.previousInputs[4];
  //   inputs[15] = this.previousInputs[5];
  //   inputs[16] = this.previousInputs[6];
  //   inputs[17] = this.previousInputs[7];
  //   inputs[18] = this.previousInputs[8];
  //   inputs[19] = this.previousInputs[9];


  //   // Get the outputs from the network
  //   let output = this.brain.predict(inputs);

  //   // Remember inputs for next time
  //   this.previousInputs[0] = inputs[0];
  //   this.previousInputs[1] = inputs[1];
  //   this.previousInputs[2] = inputs[2];
  //   this.previousInputs[3] = inputs[3];
  //   this.previousInputs[4] = inputs[4];
  //   this.previousInputs[5] = inputs[5];
  //   this.previousInputs[6] = inputs[6];
  //   this.previousInputs[7] = inputs[7];
  //   this.previousInputs[8] = inputs[8];
  //   this.previousInputs[9] = inputs[9];
  //   this.previousInputs[10] = inputs[10];
  //   this.previousInputs[11] = inputs[11];
  //   this.previousInputs[12] = inputs[12];
  //   this.previousInputs[13] = inputs[13];
  //   this.previousInputs[14] = inputs[14];
  //   this.previousInputs[15] = inputs[15];
  //   this.previousInputs[16] = inputs[16];

  //   // Make movement decisions
  //   if (output[0] > 0.5) {
  //     this.left();
  //   }
  //   if (output[1] > 0.5) {
  //     this.right();
  //   }
  //   if (output[2] > 0.5) {
  //     this.up();
  //   }
  //   if (output[3] > 0.5) {
  //     this.down();
  //   }
  // }

  show() {
    fill(this.color);
    rect(this.x, this.y, this.width, this.height);
  }

  up() {
    this.y -= this.speed;
  }

  down() {
    this.y += this.speed;
  }

  left() {
    this.x -= this.speed;
  }

  right() {
    this.x += this.speed;
  }

  offScreen() {
    if (this.x <= 0 || this.x + this.width >= width || this.y <= 0 || this.y + this.height >= height) {
      return true;
    } else {
      return false;
    }
  }

  look(boundaries) {
    push();
    stroke(255);
    let points = [];

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
        points.push(closestPoint);
      }
    }

    for (let point of points) {
      ellipse(point.x, point.y, 10, 10);
    }

    pop();
  }

  update() {
    //Update eye position
    for (let eye of this.eyes) {
      eye.setPos();
    }
  }
}