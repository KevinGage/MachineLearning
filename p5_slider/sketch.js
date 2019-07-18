let guy;
let walls;
let obstacles;
let boundaries;
let score;
let highscore;

function setup() {
  // put setup code here
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');
  background(0);

  let leftWall = new Boundary(0, 0, 0, height);
  let rightWall = new Boundary(width, 0, width, height);
  let topWall = new Boundary(0, 0, width, 0);
  let bottomWall = new Boundary(0, height, width, height);
  walls = [leftWall, rightWall, topWall, bottomWall];

  boundaries = [];

  guy = new Guy();
  obstacles = [];
  score = 0;
  highscore = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  // put drawing code here
  background(0);

  if(keyIsDown(LEFT_ARROW) || keyIsDown(65)){
    guy.left();
  } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)){
    guy.right();
  }

  if(keyIsDown(UP_ARROW) || keyIsDown(65)){
    guy.up();
  } else if (keyIsDown(DOWN_ARROW) || keyIsDown(68)){
    guy.down();
  }

  guy.update();
  guy.show();

  if (frameCount % 20 == 0) {
    let rng = random(4);
    if (rng < 1) {
      obstacles.push(new Obstacle('left'));
    } else if (rng < 2) {
      obstacles.push(new Obstacle('right'));
    } else if (rng < 3) {
      obstacles.push(new Obstacle('top'));
    } else {
      obstacles.push(new Obstacle('bottom'));
    }
  }

  score ++;
  if (score > highscore) {
    highscore = score;
  }

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].update();
    obstacles[i].show();

    if (obstacles[i].offscreen()) {
      obstacles.splice(i, 1);
    }

    if (obstacles[i].hits(guy)) {
      score = 0;
    }
  }

  boundaries = [];

  for (let wall of walls) {
    boundaries.push(wall);
  }

  for (let obstacle of obstacles) {
    boundaries.push(obstacle.leftBorder);
    boundaries.push(obstacle.rightBorder);
    boundaries.push(obstacle.topBorder);
    boundaries.push(obstacle.bottomBorder);
  }

  guy.look(boundaries);

  push();
  fill('yellow');
  text('Score: '+ score, 0, 20);
  text('High Score: '+ highscore, 0, 40);
  pop();
}