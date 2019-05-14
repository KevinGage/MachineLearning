var guy;
var walls;
var obstacles;
var score;
var highscore;

function setup() {
  // put setup code here
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');
  background(0);

  let leftWall = new Boundary(1, 1, 1, height - 1);
  let rightWall = new Boundary(width - 1, 1, width - 1, height - 1);
  let topWall = new Boundary(1, 1, width - 1, 1);
  walls = [leftWall, rightWall, topWall];

  guy = new Guy();
  obstacles = [];
  score = 0;
  highscore = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (keyCode === UP_ARROW || key === 'w') {
    guy.up();
  }  
}

function draw() {
  // put drawing code here
  background(0);

  if(keyIsDown(LEFT_ARROW) || keyIsDown(65)){
    guy.left();
  } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)){
    guy.right();
  }

  if(keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    guy.duck();
  } else {
    guy.stand();
  }

  guy.update();
  guy.show();

  for (let i = 0; i < walls.length; i++) {
    walls[i].show();
    guy.look(walls[i]);
  }

  if (frameCount % 100 == 0) {
    let rng = random(3);
    if (rng < 1) {
      obstacles.push(new Obstacle('left'));
    } else if (rng < 2) {
      obstacles.push(new Obstacle('right'));
    } else {
      obstacles.push(new Obstacle('top'));
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

  push();
  fill('yellow');
  text('Score: '+ score, 0, 20);
  text('High Score: '+ highscore, 0, 40);
  pop();
}