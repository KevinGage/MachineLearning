import random
from bird import bird
from pipe import pipe
from scoreboard import scoreboard
from debugboard import debugboard

class game():
  def __init__(self, window_x = 800, window_y = 600, batch = False, pipe_frequency = 100, pipe_width = 60, pipe_gap = 150, pipe_velocity = 6, debug = False ):
    self.window_x = window_x
    self.window_y = window_y
    self.batch = batch
    self.debug = debug
    self.last_pipe = 0
    self.pipes = []
    self.pipe_frequency = pipe_frequency
    self.pipe_width = pipe_width
    self.pipe_gap = pipe_gap
    self.pipe_velocity = pipe_velocity
    self.bird = bird(25, window_x / 2, window_y, batch)

    if not batch == False:
      self.scoreboard = scoreboard(0, window_y - 20, batch)
      if debug:
        self.debugboard = debugboard(window_y - 200, window_x - 20, batch)

  def observation(self):
    # handle no pipe condition
    pipe_x = self.window_x
    pipe_y = self.window_y / 2
    if len(self.pipes) > 0:
      pipe_x = self.pipes[0].x
      pipe_y = self.pipes[0].y

    return [self.bird.y, self.bird.velocity, pipe_x, pipe_y]

  def reset(self):
    if self.debug and not self.batch == False:
      self.debugboard.set_metrics(self.debugboard.game_count + 1, self.bird.score)

    for p in self.pipes:
      p.delete()
    
    self.pipes = []
    self.last_pipe = 0

    self.bird.game_over()

    observation = self.observation()

    return observation

  def step(self, action):
    if action == 1:
      self.bird.jump()

    reward = 1

    # remove offscreen pipes
    pipes_off_screen = [index for index,value in enumerate(self.pipes) if value.x < (-1 * self.pipe_width)]

    for p in pipes_off_screen:
      self.pipes[p].delete()
      self.pipes.pop(p)
      reward += 150

    # add a new pipe if it is due
    if self.last_pipe % self.pipe_frequency == 0:
      rand_height = random.randint(0, self.window_y - self.pipe_gap)
      new_pipe = pipe(self.window_x, rand_height, self.pipe_width, self.pipe_gap, self.pipe_velocity, self.window_y, self.batch)
      self.pipes.append(new_pipe)
      self.last_pipe = 0

    self.last_pipe += 1

    # move agent
    self.bird.update()

    # update score
    if not self.batch == False:
      self.scoreboard.set_score(self.bird.score)

    # check for game over
    done = False

    if self.bird.y <= 0:
      done = True

    if self.bird.y + self.bird.size >= self.bird.max_y:
      done = True

    for p in self.pipes:
      p.update()
      if ((self.bird.x + self.bird.size) > p.x) and (self.bird.x < (p.x + self.pipe_width)):
        if ((self.bird.y < p.y) or ((self.bird.y + self.bird.size) > (p.y + self.pipe_gap))):
          done = True

    if not done:
      self.bird.set_score(self.bird.score + reward)

    else:
      reward = -100
      self.reset()

    observation = self.observation()

    return (observation, reward, done, '')