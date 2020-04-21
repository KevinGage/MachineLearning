from dueling_dqn_keras import Agent
import numpy as np
import gym
import matplotlib.pyplot as plt

if __name__ == '__main__':
  env = gym.make('LunarLander-v2')
  
  render = True
  n_games = 400
  ACTIONS = env.action_space.n

  agent = Agent(n_actions=ACTIONS, gamma=0.99, epsilon=1, lr=1e-3, input_dims=[8], epsilon_dec=1e-3, mem_size=100000, batch_size=64, epsilon_end=0.01, fc1_dims=128, fc2_dims=128, replace=100)

  scores, eps_history = [], []

  for i in range(n_games):
    done = False
    score = 0
    observation = env.reset()

    while not done:
      action = agent.choose_action(observation)
      next_observation, reward, done, info = env.step(action)
      score += reward
      agent.store_transition(observation, action, reward, next_observation, done)
      observation = next_observation
      agent.learn()
      if render:
        env.render()
    
    eps_history.append(agent.epsilon)
    scores.append(score)

    avg_score = np.mean(scores[-100:])
    print('episode ', i, 'score %.1f' % score, 
          'average score last 100 games %.1f' % avg_score, 
          'epsilon %2f' % agent.epsilon)
  
  plt.plot(scores)
  plt.ylabel('scores')
  plt.xlabel('episodes')
  plt.show()