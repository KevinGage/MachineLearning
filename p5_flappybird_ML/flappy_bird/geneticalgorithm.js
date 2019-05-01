function nextGeneration() {
  console.log('next generation');
  calculateFitness();

  //console.log(savedBirds.length);
  for (let i = 0; i < totalPopulation; i++) {
    birds[i] = pickOne();

    //pretty sure I'm leaking memory because I am not disposing the savedBirds tensors
    //When I try disposing them I end up crashing with "already dispose" message after a seemingly random number of iterations
    // console.log([i]);
    // console.log(savedBirds[i].brain);

    // savedBirds[i].dispose();

  }

  pipes = [];
  savedBirds = [];
}

function calculateFitness() {
  let sum = 0;
  for (let bird of savedBirds) {
    sum += bird.score;
  }
  for (let bird of savedBirds) {
    bird.fitness = bird.score / sum;
  }
}

function pickOne() {
  var index = 0;
  var r = random(1);

  while (r > 0) {
    r = r - savedBirds[index].fitness;
    index++;
  }
  index--;

  let bird = savedBirds[index];
  let child = new Bird(bird.brain);
  return child;
}