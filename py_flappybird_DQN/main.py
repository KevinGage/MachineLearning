from dueling_dqn_keras import Agent
import pyglet.app
import random
from pyglet.window import key
from bird import bird
from pipe import pipe
from scoreboard import scoreboard

if __name__ == '__main__':
  # Setup contant variables
  DEBUG = False

  PIPE_FREQUENCY = 100
  PIPE_WIDTH = 60
  PIPE_GAP = 150
  PIPE_VELOCITY = 6
  last_pipe = 0
  pipes = []

  n_games = 100
  # Jump or do nothing
  ACTIONS = 2

  # input dimensions
  # bird.x, bird.y, bird.velocity, closets pipe.x, closest pipe.y

  agent = Agent(n_actions=ACTIONS, gamma=0.99, epsilon=1, lr=1e-3, input_dims=[5], epsilon_dec=1e-3, mem_size=100000, batch_size=64, epsilon_end=0.01, fc1_dims=128, fc2_dims=128, replace=100)
  scores, eps_history = [], []

  # Create window with resolution of 800 x 600
  window = pyglet.window.Window(800, 600, 'flappy bird')
  if DEBUG:
    fps_display = pyglet.window.FPSDisplay(window=window)

  # Create the main drawing batch for vertices
  main_batch = pyglet.graphics.Batch()

  # create the player / agent at center of screen
  bird = bird(25 ,window.height / 2, window.height, main_batch)

  # create scoreboard
  scoreboard = scoreboard(0, window.height - 20, main_batch)

  # define game over reset
  def game_over():
    global last_pipe
    global pipes

    for p in pipes:
      p.delete()
    
    pipes = []
    last_pipe = 0

    bird.game_over()

  # logic to run every 1 / 120 seconds
  def updateScore(dt):
    global last_pipe
    global pipes

    # handle no pipe condition
    pipe_x = window.width
    pipe_y = window.height / 2
    if len(pipes) > 0:
      pipe_x = pipes[0].x
      pipe_y = pipes[0].y

    # bird.x, bird.y, bird.velocity, closets pipe.x, closest pipe.y
    observation = [bird.x, bird.y, bird.velocity, pipe_x, pipe_y]
    action = agent.choose_action(observation)

    if action == 0:
      bird.jump()

    # remove offscreen pipes
    pipes_off_screen = [index for index,value in enumerate(pipes) if value.x < (-1 * PIPE_WIDTH)]

    for p in pipes_off_screen:
      pipes[p].delete()
      pipes.pop(p)

    # add a new pipe if it is due
    if last_pipe % PIPE_FREQUENCY == 0:
      rand_height = random.randint(0, window.height - PIPE_GAP)
      new_pipe = pipe(window.width, rand_height, PIPE_WIDTH, PIPE_GAP, PIPE_VELOCITY, window.height, main_batch)
      pipes.append(new_pipe)
      last_pipe = 0

    last_pipe += 1

    # move agent
    bird.update()

    # update score
    scoreboard.set_score(bird.score)

    done = False
    reward = 1

    # check for game over
    if bird.y <= 0:
      done = True

    if bird.y + bird.size >= bird.max_y:
      done = True

    for p in pipes:
      p.update()
      if ((bird.x + bird.size) > p.x) and (bird.x < (p.x + PIPE_WIDTH)):
        if ((bird.y < p.y) or ((bird.y + bird.size) > (p.y + PIPE_GAP))):
          done = True

    if not done:
      bird.set_score(bird.score + reward)
    else:
      reward = -100
      game_over()
    
    # handle no pipe condition
    pipe_x = window.width
    pipe_y = window.height / 2
    if len(pipes) > 0:
      pipe_x = pipes[0].x
      pipe_y = pipes[0].y

    next_observation = [bird.x, bird.y, bird.velocity, pipe_x, pipe_y]
    agent.store_transition(observation, action, reward, next_observation, done)
    agent.learn()

  pyglet.clock.schedule_interval(updateScore, 1 / 120)


  # handle key presses
  @window.event
  def on_key_press(symbol, modifiers):
      if symbol == key.SPACE:
          bird.jump()

  # do on every redraw of window
  @window.event
  def on_draw():
    window.clear()
    main_batch.draw()
    if DEBUG:
      fps_display.draw()

  # run app
  pyglet.app.run()