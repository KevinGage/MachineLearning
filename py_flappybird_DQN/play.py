import pyglet.app
from pyglet.window import key
from game import game

if __name__ == '__main__':
  # Setup contant variables
  PIPE_FREQUENCY = 100
  PIPE_WIDTH = 60
  PIPE_GAP = 150
  PIPE_VELOCITY = 6
  WINDOW_WIDTH = 800
  WINDOW_HEIGHT = 600
  DEBUG = False

  # Create window with resolution of 800 x 600
  window = pyglet.window.Window(WINDOW_WIDTH, WINDOW_HEIGHT, 'flappy bird')
  # Create the main drawing batch for vertices
  main_batch = pyglet.graphics.Batch()

  # Create the game instance
  env = game(WINDOW_WIDTH, WINDOW_HEIGHT, main_batch , PIPE_FREQUENCY, PIPE_WIDTH, PIPE_GAP, PIPE_VELOCITY, DEBUG)

  # Show FPS counter
  if DEBUG:
    fps_display = pyglet.window.FPSDisplay(window=window)

  # logic to run every 1 / 120 seconds
  def updateScore(dt):
    env.step(0)

  pyglet.clock.schedule_interval(updateScore, 1 / 120)

  # handle key presses
  @window.event
  def on_key_press(symbol, modifiers):
    if symbol == key.SPACE:
      env.step(1)

  # do on every redraw of window
  @window.event
  def on_draw():
    window.clear()
    main_batch.draw()
    if DEBUG:
      fps_display.draw()

  # run app
  pyglet.app.run()