class Bird {
  constructor(brain) {
    this.y = height / 2;
    this.x = 64;
    this.width = 16;
    this.height = this.width;
    this.gravity = 0.4;
    this.lift = -6;
    this.velocity = 0;
    this.score = 0;
    this.fitness = 0;

    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      this.brain.mutate(0.1);
    } else {
      this.brain = new NeuralNetwork(5, 8, 2);
    }
  }

  copy() {
    return new Bird(this.brain);
  }

  show() {
    fill('yellow');
    square(this.x, this.y, this.width);
  }

  think(pipes) {
    let closest = null;
    let record = Infinity;

    for (let i = 0; i < pipes.length; i++) {
      let diff = pipes[i].x - this.x;
      if (diff > 0 && diff < record) {
        record = diff;
        closest = pipes[i];
      }
    }

    if (closest != null) {
      // Now create the inputs to the neural network
      let inputs = [];
      inputs[0] = this.y / height;
      inputs[1] = closest.top / height;
      inputs[2] = closest.bottom / height;
      inputs[3] = closest.x / width;
      inputs[4] = this.velocity / 10;

      // Get the outputs from the network
      let output = this.brain.predict(inputs);
      // Decide to jump or not!
      if (output[0] > output[1]) {
        this.up();
      }
    }
  }

  up() {
    this.velocity = this.lift;
  }

  bottomTop() {
    // Bird dies when hits bottom?
    return (this.y + this.height >= height || this.y < 0);
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    this.score++;
  }

  dispose() {
    this.brain.dispose();
  }
}