// Here are the inputs that I think I will use
// each of the eye to point distances for 8 eyes.  So 8 numbers between 0 and width
// the previous values of all 8 eyes
// player x and player y
// the previous values of player x and player y
// goal x and goal y

// So state array should look like this
// [a1, b1, c1, d1, e1, f1, g1, h1, a2, b2, c2, d2, e2, f2, g2, h2, x1, y1, x2, y2, gx, gy]

// Here are the rewards that I think I will use
// player moves and doesnt die, -1
// player moves and colides with boundary, -2000
// player moves and colides with goal, +2000

// Here are rules of the game
// player spawns in middle
// each turn player must move, so x4 decision options
// blocks spawn randomly
// if player colides with boundary simulation ends
// if player colides with goal simulation ends

const learningRate = 0.1;
const discount = 0.95;
const episodes = 25000;
let currentEpisode = 1;
let episodeReward = 0;
const showEvery = 2000;
let never_solved = true;
let epsilon = 0.5;
const startEpsilonDecaying = 1;
const endEpsilonDecaying = Math.floor(episodes / 2);
const epsilonDecayValue = epsilon / (endEpsilonDecaying - startEpsilonDecaying);

const epRewards = []
const aggrEpRewards = {'ep': [], 'avg': [], 'min': [], 'max': []}

let player;
let goal;
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

let render = false;

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

  // Add a goal
  goal = new Goal();

  // Create random Q Table
  const adjustedHeight = height - player.height;
  const adjustedWidth = width - player.width;

  // trying with only current state, not previous state
  // still too big for javascript in the browser :(
  qTable = new QTable([[0,adjustedHeight], [0,adjustedWidth], 
    [0,adjustedHeight], [0,adjustedWidth], 
    [0,adjustedHeight], [0,adjustedWidth], 
    [0,adjustedHeight], [0,adjustedWidth], 
    [0,adjustedHeight], [0,adjustedWidth], 
    [0,height - goal.height], [0,width - goal.width]], 
    20, 4, -2000, 2000);
}

function draw() {
  // put drawing code here
  background(0);

  if (currentEpisode % showEvery == 0) {
    render = true;
  } else {
    render = false;
  }

  spawnObstacle();

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

  // BUILD CURRENT STATE OBJECT HERE!!!!!
  // {}

  // Decide if should explore
  if (Math.random() > epsilon) {
    // Take best action
  } else {
    // Take random action
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
  goal.show();
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

function spawnObstacle() {
  if (gameLogicCounter == 0) {
    obstacles.push(new Obstacle('center_top'));
    lastObstacleMovingDown = 0;
  } else if (gameLogicCounter == 100) {
    obstacles.push(new Obstacle('center_right'));
    lastObstacleMovingRight = 0;
  }

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
}

function saveQTable() {
  
}

function loadQTable() {
  
}