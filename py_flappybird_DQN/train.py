from dueling_dqn_keras import Agent
import numpy as np
from game import game
import matplotlib.pyplot as plt

if __name__ == '__main__':
  # Setup contant variables
  PIPE_FREQUENCY = 100
  PIPE_WIDTH = 60
  PIPE_GAP = 150
  PIPE_VELOCITY = 6
  WINDOW_WIDTH = 800
  WINDOW_HEIGHT = 600
  DEBUG = True

  TARGET_SCORE = 10000
  N_GAMES = 1000

  scores, eps_history = [], []
  saved_network = False

  # Jump or do nothing
  ACTIONS = 2

  env = game(WINDOW_WIDTH, WINDOW_HEIGHT, False , PIPE_FREQUENCY, PIPE_WIDTH, PIPE_GAP, PIPE_VELOCITY, DEBUG)

  # input dimensions
  # bird.y, bird.velocity, closets pipe.x, closest pipe.y
  agent = Agent(n_actions=ACTIONS, gamma=0.99, epsilon=1, lr=1e-3, input_dims=[4], epsilon_dec=1e-4, mem_size=100000, batch_size=128, epsilon_end=0.001, fc1_dims=128, fc2_dims=128, replace=200)

  print(1e-3)

  # Training loop
  for i in range(N_GAMES):
    done = False
    score = 0
    # bird.y, bird.velocity, closets pipe.x, closest pipe.y
    observation = env.reset()

    while not done:
      action = agent.choose_action(observation)
      next_observation, reward, done, info = env.step(action)
      score += reward
      agent.store_transition(observation, action, reward, next_observation, done)
      observation = next_observation
      agent.learn()

    eps_history.append(agent.epsilon)
    scores.append(score)
    
    avg_score = np.mean(scores[-100:])
    print('episode ', i, 'score %.1f' % score, 
          'average score last 100 games %.1f' % avg_score, 
          'epsilon %2f' % agent.epsilon)

    if score > TARGET_SCORE:
      print('Target score reached!')
      print('Saving model')
      agent.save_model()
      saved_network = True
      break

  if not saved_network:
    print('Number of games reached')
    print('Saving model')
    agent.save_model()

  plt.plot(scores)
  plt.ylabel('scores')
  plt.xlabel('episodes')
  plt.show()