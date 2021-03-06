from dueling_dqn_keras import Agent
import pyglet.app
from game import game

if __name__ == '__main__':
  # Setup contant variables
  # Must be the same that agent was trained with
  PIPE_FREQUENCY = 100
  PIPE_WIDTH = 60
  PIPE_GAP = 150
  PIPE_VELOCITY = 6
  WINDOW_WIDTH = 800
  WINDOW_HEIGHT = 600
  DEBUG = True
  N_GAMES = 10

  scores, eps_history = [], []

  agent = Agent(n_actions=2, gamma=0.99, epsilon=0, lr=0, input_dims=[4], epsilon_dec=0, mem_size=0, batch_size=0, epsilon_end=0, fc1_dims=128, fc2_dims=128, replace=200)
  agent.load_model()

  # Create window with resolution of 800 x 600
  window = pyglet.window.Window(WINDOW_WIDTH, WINDOW_HEIGHT, 'flappy bird')
  # Create the main drawing batch for vertices
  main_batch = pyglet.graphics.Batch()

  # Create the game instance
  env = game(WINDOW_WIDTH, WINDOW_HEIGHT, main_batch , PIPE_FREQUENCY, PIPE_WIDTH, PIPE_GAP, PIPE_VELOCITY, DEBUG)

  observation = env.reset()
  action = agent.choose_action(observation)

  # logic to run every 1 / 120 seconds
  def updateScore(dt):
    global observation

    action = agent.choose_action(observation)
    next_observation, reward, done, info = env.step(action)
    observation = next_observation

  pyglet.clock.schedule_interval(updateScore, 1 / 120)

  # do on every redraw of window
  @window.event
  def on_draw():
    window.clear()
    main_batch.draw()

  # run app
  pyglet.app.run()