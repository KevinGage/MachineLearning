//https://github.com/CodingTrain/Flappy-Bird-Clone

const totalPopulation = 250;
let birds = [];
let savedBirds = [];
let pipes = [];
let counter = 0;

let speedSlider;
let speedSpan;
let currentScoreSpan;
let highScoreSpan;

let generationCount = 0;
let currentScore = 0;
let highScore = 0;

function setup() {
  // put setup code here
  var canvas = createCanvas(640, 480);
  canvas.parent('canvascontainer');

  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');
  generationSpan = select('#gen');
  currentScoreSpan = select('#cs');
  highScoreSpan = select('#hs');

  //Use cpu for tensor flow instead of gpu because this game is simple and I'm running it on laptops
  tf.setBackend('cpu');

  for (let i = 0; i < totalPopulation; i++) {
    let bird = new Bird();
    birds[i] = bird;
  }
}

function draw() {
  // put drawing code here
  background(0);

  let cycles = speedSlider.value();
  speedSpan.html(cycles);

  for (let n = 0; n < cycles; n++){
    for (let i = pipes.length - 1; i >=0; i--) {
      pipes[i].update();
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    for (let i = birds.length - 1; i >= 0; i--) {
      let bird = birds[i];

      if (bird.score > currentScore) {
        currentScore = bird.score;
      }

      if (currentScore > highScore) {
        highScore = currentScore;
      }

      bird.think(pipes);
      bird.update();

      if (bird.bottomTop()) {
        let deadBird = birds.splice(i, 1)[0];
        savedBirds.push(deadBird);
        break;
      }

      for (let j = 0; j < pipes.length; j++) {
        if (pipes[j].hits(birds[i])) {
          let deadBird = birds.splice(i, 1)[0];
          savedBirds.push(deadBird);
          break;
        }
      }
    }

    if (counter % 150 == 0 || counter == 0) {
      pipes.push(new Pipe());
    }
    counter++;
  }

  currentScoreSpan.html(currentScore);
  highScoreSpan.html(highScore);
  generationSpan.html(generationCount);

  for (let i = 0; i < pipes.length; i++) {
    pipes[i].show();
  }

  for (let i = 0; i < birds.length; i++) {
    birds[i].show();
  }
  if (birds.length == 0) {
    currentScore = 0;
    nextGeneration();
    generationCount++;
  }
}