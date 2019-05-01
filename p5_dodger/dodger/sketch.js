var guy;
var obstacles;

function setup() {
  // put setup code here
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');
  background(0);

  guy = new Guy();
  obstacles = [];
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
  } else if(keyIsDown(RIGHT_ARROW) || keyIsDown(68)){
    guy.right();
  }

  if(keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    guy.duck();
  } else {
    guy.stand();
  }

  guy.update();
  guy.show();
}