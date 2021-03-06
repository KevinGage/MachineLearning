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

  # Create window with resolution of 800 x 600
  window = pyglet.window.Window(800, 600, 'flappy bird')
  if DEBUG:
    fps_display = pyglet.window.FPSDisplay(window=window)

  # Create the main drawing batch for vertices
  main_batch = pyglet.graphics.Batch()

  # create the player / agent at center of screen
  agent = bird(25 ,window.height / 2, window.height, main_batch)

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

    agent.game_over()

  # logic to run every 1 / 120 seconds
  def updateScore(dt):
    global last_pipe
    global pipes

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
    agent.update()

    # update score
    scoreboard.set_score(agent.score)

    # check for game over
    if agent.y > 0:
      agent.set_score(agent.score + 1)
    else:
      game_over()

    for p in pipes:
      p.update()
      if ((agent.x + agent.size) > p.x) and (agent.x < (p.x + PIPE_WIDTH)):
        if ((agent.y < p.y) or ((agent.y + agent.size) > (p.y + PIPE_GAP))):
          game_over()

  pyglet.clock.schedule_interval(updateScore, 1 / 120)

  # handle key presses
  @window.event
  def on_key_press(symbol, modifiers):
      if symbol == key.SPACE:
          agent.jump()

  # do on every redraw of window
  @window.event
  def on_draw():
    window.clear()
    main_batch.draw()
    if DEBUG:
      fps_display.draw()

  # run app
  pyglet.app.run()