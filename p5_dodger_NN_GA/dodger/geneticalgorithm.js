function nextGeneration(bestBrain) {
  calculateFitness();

  for (let i = 0; i < totalPopulation - 1; i++) {
    guys[i] = pickOne();
  }

  guys.push(new Guy(bestBrain, true));

  for (let i = 0; i < lastGeneration.length; i++) {
    lastGeneration[i].dispose();
  }

  obstacles = [];
  lastGeneration = [];
}

function calculateFitness() {
  let sum = 0;
  for (let guy of lastGeneration) {
    sum += guy.score;
  }
  for (let guy of lastGeneration) {
    guy.fitness = guy.score / sum;
  }
}

function pickOne() {
  var index = 0;
  var r = random(1);

  while (r > 0) {
    r = r - lastGeneration[index].fitness;
    index++;
  }
  index--;

  let guy = lastGeneration[index];
  let child = new Guy(guy.brain);
  return child;
}