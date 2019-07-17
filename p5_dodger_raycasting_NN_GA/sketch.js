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
let speedSpan;
let currentScore = 0;
let highScore = 0;
let currentScoreSpan;
let highScoreSpan;
let generationSpan;
let aliveSpan;
let gameLogicCounter = 0;

let lastObstacleMovingLeft = -150;
let lastObstacleMovingRight = -150;
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

  // Use cpu for tensor flow instead of gpu because this game is simple and I'm running it on laptops
  tf.setBackend('cpu');

  // Setup walls
  let leftWall = new Boundary(0, 0, 0, height);
  let rightWall = new Boundary(width, 0, width, height);
  let topWall = new Boundary(0, 0, width, 0);
  let bottomWall = new Boundary(0, height * 2 , width, height * 2);
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
    obstacles.push(new Obstacle('center'));
    lastObstacleMovingDown = 0;
  }

  for (let n = 0; n < cycles; n++) {
    //Spawn obstacles
    if (lastObstacleMovingDown > 150 && random() < 0.01) {
      obstacles.push(new Obstacle('top'));
      lastObstacleMovingDown = 0;
    } else {
      lastObstacleMovingDown++;
    }
    if (lastObstacleMovingLeft > 90 && random() < 0.01 ) {
      obstacles.push(new Obstacle('right'));
      lastObstacleMovingLeft = 0;
    } else {
      lastObstacleMovingLeft++;
    }

    if (lastObstacleMovingRight > 90 && random() < 0.01 ) {
      obstacles.push(new Obstacle('left'));
      lastObstacleMovingRight = 0;
    } else {
      lastObstacleMovingRight++;
    }

    if (lastObstacleMovingLeft == -1) {
      obstacles.push(new Obstacle('right_low'));
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
    guys[i].look(boundaries);
  }

  if (guys.length == 0) {
    currentScore = 0;
    lastObstacleMovingDown = 0;
    nextGeneration(bestBrain);
    generationCount++;
    gameLogicCounter = 0;
    lastObstacleMovingLeft = -150;
    lastObstacleMovingRight = -150;
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