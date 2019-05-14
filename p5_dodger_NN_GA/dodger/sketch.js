const totalPopulation = 150;
let guys = [];
let lastGeneration = [];
let generationCount = 0;
let obstacles = [];
let score;
let highscore;
let speedSlider;
let speedSpan;
let currentScore = 0;
let highScore = 0;
let currentScoreSpan;
let highScoreSpan;
let generationSpan;
let aliveSpan;
let gameLogicCounter = 0;

let lastObstacleMovingLeft = -150;
let lastObstacleMovingDown = 0;

let pauseButton;
let resumeButton;
let saveButton;
let loadButton;
let jsonUpload;
let weightsUpload;

let bestBrain = {};

function setup() {
  // put setup code here
  var canvas = createCanvas(640, 480);
  canvas.parent('canvascontainer');
  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');
  generationSpan = select('#gen');
  aliveSpan = select('#al');
  currentScoreSpan = select('#cs');
  highScoreSpan = select('#hs');

  pauseButton = select('#pauseButton');
  pauseButton.mousePressed(pause);
  resumeButton = select('#resumeButton');
  resumeButton.mousePressed(resume);

  saveButton = select('#saveButton');
  saveButton.mousePressed(saveGuyBrain);
  jsonUpload = document.getElementById('sm');
  weightsUpload = document.getElementById('sw');
  loadButton = select('#loadButton');
  loadButton.mousePressed(loadGuyBrain);

  //Use cpu for tensor flow instead of gpu because this game is simple and I'm running it on laptops
  tf.setBackend('cpu');

  for (let i = 0; i < totalPopulation; i++) {
    let guy = new Guy();
    guys[i] = guy;
  }
}

function draw() {
  // put drawing code here
  background(0);

  let cycles = speedSlider.value();
  speedSpan.html(cycles);

  if (gameLogicCounter == 0) {
    obstacles.push(new Obstacle('center'));
    lastObstacleMovingDown = 0;
  }

  for (let n = 0; n < cycles; n++) {
    //Spawn obstacles
    if (random() < 0.01 && lastObstacleMovingDown > 150) {
      obstacles.push(new Obstacle('top'));
      lastObstacleMovingDown = 0;
    } else {
      lastObstacleMovingDown++;
    }
    if (random() < 0.01 && lastObstacleMovingLeft > 90) {
      obstacles.push(new Obstacle('right'));
      lastObstacleMovingLeft = 0;
    } else {
      lastObstacleMovingLeft++;
    }

    if (lastObstacleMovingLeft == -1) {
      obstacles.push(new Obstacle('right_low'));
    }

    //Update obstacles
    for (let i = 0; i < obstacles.length; i++) {
      obstacles[i].update();

      if (obstacles[i].offscreen()) {
        obstacles.splice(i, 1);
      }
    }

    //Update guys
    for (let i = guys.length - 1; i >= 0; i--) {
      let guy = guys[i];

      if (guy.score > currentScore) {
        currentScore = guy.score;
      }

      guy.think(obstacles);
      guy.update();

      if (guys[i].offScreen()) {
        if (currentScore > highScore) {
          highScore = currentScore;
          bestBrain = guy.brain.copy();
        }
        let deadGuy = guys.splice(i, 1)[0];
        lastGeneration.push(deadGuy);
        continue;
      }

      for (let j = 0; j < obstacles.length; j++) {
        if (obstacles[j].hits(guys[i])) {
          if (currentScore > highScore) {
            highScore = currentScore;
            bestBrain = guy.brain.copy();
          }
          let deadGuy = guys.splice(i, 1)[0];
          lastGeneration.push(deadGuy);
          break;
        }
      }
    }

    gameLogicCounter++;
  }

  //Draw everything
  currentScoreSpan.html(currentScore);
  highScoreSpan.html(highScore);
  generationSpan.html(generationCount);
  aliveSpan.html(guys.length);

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].show();
  }

  for (let i = 0; i < guys.length; i++) {
    guys[i].show();
  }

  if (guys.length == 0) {
    currentScore = 0;
    lastObstacleMovingDown = 0;
    nextGeneration(bestBrain);
    generationCount++;
    gameLogicCounter = 0;
    lastObstacleMovingLeft = -150;
  }

}

function saveGuyBrain() {
  bestBrain.save();
}

function loadGuyBrain() {
  noLoop();
  let loadedGuy = new Guy();
  loadedGuy.brain.load(jsonUpload.files[0], weightsUpload.files[0]);
  loadedGuy.score = currentScore;
  guys.push(loadedGuy);
  loop();
}

function pause() {
  noLoop();
}

function resume() {
  loop();
}