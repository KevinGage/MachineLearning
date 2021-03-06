const totalPopulation = 150;
let walls;
let boundaries;
let guys = [];
let lastGeneration = [];
let generationCount = 0;
let obstacles = [];
let score;
let highscore;
let speedSlider;
let hideEverything;
let showDebug;
let speedSpan;
let currentScore = 0;
let highScore = 0;
let currentScoreSpan;
let highScoreSpan;
let generationSpan;
let aliveSpan;
let gameLogicCounter = -100;

let lastObstacleMovingLeft = -150;
let lastObstacleMovingRight = -150;
let lastObstacleMovingDown = 0;
let lastObstacleMovingUp = 0;

let pauseButton;
let resumeButton;
let saveButton;
let loadButton;
let jsonUpload;
let weightsUpload;

let bestBrain = {};

function setup() {
  // put setup code here
  var canvas = createCanvas(550, 550);
  canvas.parent('canvascontainer');
  speedSlider = select('#speedSlider');
  hideEverything = select('#he');
  showDebug = select('#db');
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

  // Use cpu for tensor flow instead of gpu because this game is simple and I'm running it on laptops
  tf.setBackend('cpu');

  // Setup walls
  let leftWall = new Boundary(0, 0, 0, height);
  let rightWall = new Boundary(width, 0, width, height);
  let topWall = new Boundary(0, 0, width, 0);
  let bottomWall = new Boundary(0, height, width, height);
  walls = [leftWall, rightWall, topWall, bottomWall];

  // Create the first generation of guys
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
    obstacles.push(new Obstacle('center_top'));
    lastObstacleMovingDown = 0;
  } else if (gameLogicCounter == 100) {
    obstacles.push(new Obstacle('center_right'));
    lastObstacleMovingRight = 0;
  }

  for (let n = 0; n < cycles; n++) {
    //Spawn obstacles
    if (lastObstacleMovingDown > 150 && random() < 0.01) {
      obstacles.push(new Obstacle('top'));
      lastObstacleMovingDown = 0;
    } else {
      lastObstacleMovingDown++;
    }
    if (lastObstacleMovingUp > 150 && random() < 0.01) {
      obstacles.push(new Obstacle('bottom'));
      lastObstacleMovingUp = 0;
    } else {
      lastObstacleMovingUp++;
    }
    if (lastObstacleMovingLeft > 150 && random() < 0.01 ) {
      obstacles.push(new Obstacle('right'));
      lastObstacleMovingLeft = 0;
    } else {
      lastObstacleMovingLeft++;
    }
    if (lastObstacleMovingRight > 150 && random() < 0.01 ) {
      obstacles.push(new Obstacle('left'));
      lastObstacleMovingRight = 0;
    } else {
      lastObstacleMovingRight++;
    }

    boundaries = [];

    for (let wall of walls) {
      boundaries.push(wall);
    }

    //Update obstacles
    for (let i = 0; i < obstacles.length; i++) {
      obstacles[i].update();

      if (obstacles[i].offscreen()) {
        obstacles.splice(i, 1);
      } else {
        boundaries.push(obstacles[i].leftBorder);
        boundaries.push(obstacles[i].rightBorder);
        boundaries.push(obstacles[i].topBorder);
        boundaries.push(obstacles[i].bottomBorder);
      }
    }

    //Update guys
    for (let i = guys.length - 1; i >= 0; i--) {
      let guy = guys[i];

      if (guy.score > currentScore) {
        currentScore = guy.score;
      }

      guy.think(boundaries);
      guy.update();

      if (guy.offScreen()) {
        if (currentScore > highScore) {
          highScore = currentScore;
          bestBrain = guy.brain.copy();
        }
        let deadGuy = guys.splice(i, 1)[0];
        lastGeneration.push(deadGuy);
        continue;
      }

      for (let j = 0; j < obstacles.length; j++) {
        if (obstacles[j].hits(guy)) {
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

  if (!hideEverything.checked()) {
    //Draw everything
    currentScoreSpan.html(currentScore);
    highScoreSpan.html(highScore);
    aliveSpan.html(guys.length);

    for (let i = 0; i < obstacles.length; i++) {
      obstacles[i].show();
    }

    for (let i = 0; i < guys.length; i++) {
      guys[i].show();
      if(showDebug.checked()) {
        guys[i].look(boundaries);
      }
    }
  }

  if (guys.length == 0) {
    currentScore = 0;
    highScoreSpan.html(highScore);
    lastObstacleMovingDown = 0;
    nextGeneration(bestBrain);
    generationCount++;
    gameLogicCounter = 0;
    lastObstacleMovingLeft = -150;
    lastObstacleMovingRight = -150;
    generationSpan.html(generationCount);
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
}

function pause() {
  noLoop();
}

function resume() {
  loop();
}