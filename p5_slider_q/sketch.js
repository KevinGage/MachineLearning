const learningRate = 1;
const discount = 0.95;
const episodes = 25000;
const showEvery = 2000;
let never_solved = false;
let epsilon = 0.5;
const startEpsilonDecaying = 1;
const endEpsilonDecaying = Math.floor(episodes / 2);
const epsilonDecayValue = epsilon / (endEpsilonDecaying - startEpsilonDecaying);

// DETERMINE SIZE OF Q TABLE
// Here are the inputs that I think I will use
// each of the eye to point distances for 8 eyes.  So 8 numbers between 0 and width
// the previous values of all 8 eyes
// player x and player y
// the previous values of player x and player y
// goal x and goal y

// Here are the rewards that I think I will use
// player moves and doesnt die, -1
// player moves and colides with boundary, -200
// player moves and colides with goal, +200

// Here are rules of the game
// player spawns in middle
// each turn player must move, so x4 decision options
// blocks spawn randomly
// if player colides with boundary simulation ends
// if player colides with goal simulation ends

let player;
let walls;
let boundaries;
let obstacles = [];
let score;
let highscore;
let showDebug;
let speedSpan;
let currentScore = 0;
let highScore = 0;
let currentScoreSpan;
let highScoreSpan;
let episodeSpan;
let gameLogicCounter = -100;

let lastObstacleMovingLeft = -150;
let lastObstacleMovingRight = -150;
let lastObstacleMovingDown = 0;
let lastObstacleMovingUp = 0;

let pauseButton;
let resumeButton;
let saveButton;
let loadButton;
let qTableUpload;

function setup() {
  // put setup code here
  var canvas = createCanvas(550, 550);
  canvas.parent('canvascontainer');
  showDebug = select('#db');
  episodeSpan = select('#ep');
  currentScoreSpan = select('#cs');
  highScoreSpan = select('#hs');

  saveButton = select('#saveButton');
  saveButton.mousePressed(saveQTable);
  qTableUpload = document.getElementById('qtbl');
  loadButton = select('#loadButton');
  loadButton.mousePressed(loadQTable);

  // Setup walls
  let leftWall = new Boundary(0, 0, 0, height);
  let rightWall = new Boundary(width, 0, width, height);
  let topWall = new Boundary(0, 0, width, 0);
  let bottomWall = new Boundary(0, height, width, height);
  walls = [leftWall, rightWall, topWall, bottomWall];

  // Add player
  player = new Guy();

  // Create random Q Table
  qTable = new QTable([[0,height], [0,width], [0,height], [0,width]], 20, 4, -200, 200);
}

function draw() {
  // put drawing code here
  background(0);

  if (gameLogicCounter == 0) {
    obstacles.push(new Obstacle('center_top'));
    lastObstacleMovingDown = 0;
  } else if (gameLogicCounter == 100) {
    obstacles.push(new Obstacle('center_right'));
    lastObstacleMovingRight = 0;
  }

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

  // Update player
  player.update();

  if (player.offScreen()) {

  }

  for (let j = 0; j < obstacles.length; j++) {
    if (obstacles[j].hits(player)) {
      
    }
  }

  gameLogicCounter++;

  //Draw everything
  highScoreSpan.html(highScore);

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].show();
  }

  player.show();
  if(showDebug.checked()) {
    player.look(boundaries);
  }

  /*
  RESET
  currentScore = 0;
  highScoreSpan.html(highScore);
  lastObstacleMovingDown = 0;
  nextGeneration(bestBrain);
  generationCount++;
  gameLogicCounter = 0;
  lastObstacleMovingLeft = -150;
  lastObstacleMovingRight = -150;
  episodeSpan.html("");
  */
}

function saveQTable() {
  
}

function loadQTable() {
  
}