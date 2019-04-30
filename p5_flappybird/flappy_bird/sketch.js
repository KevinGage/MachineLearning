//https://github.com/CodingTrain/Flappy-Bird-Clone

var bird;
var pipes;
var score;
var highscore;

function setup() {
  // put setup code here
  score = 0;
  highscore = 0;
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');
  background(0);
  bird = new Bird();
  pipes = [];
  pipes.push(new Pipe());
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key === ' ') {
    bird.up();
  }
}

function mouseClicked() {
  bird.up();
}

function draw() {
  // put drawing code here
  background(0);
  bird.update();
  bird.show();
  score ++;
  if (score > highscore) {
    highscore = score;
  }
  text('Score: '+ score, 0, 20);
  text('High Score: '+ highscore, 0, 40);

  for (var i = pipes.length - 1; i >= 0; i--) {
    pipes[i].update();
    pipes[i].show();

    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }

    if (pipes[i].hits(bird)) {
      score = 0;
      bird.die();
    }
  }

  if (frameCount % 150 == 0) {
    pipes.push(new Pipe());
  }
}