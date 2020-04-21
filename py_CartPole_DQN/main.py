"""
  Description:
      A pole is attached by an un-actuated joint to a cart, which moves along a frictionless track. The pendulum starts upright, and the goal is to prevent it from falling over by increasing and reducing the cart's velocity.
  Source:
      This environment corresponds to the version of the cart-pole problem described by Barto, Sutton, and Anderson
  Observation: 
      Type: Box(4)
      Num	Observation                 Min         Max
      0	Cart Position             -4.8            4.8
      1	Cart Velocity             -Inf            Inf
      2	Pole Angle                 -24 deg        24 deg
      3	Pole Velocity At Tip      -Inf            Inf
      
  Actions:
      Type: Discrete(2)
      Num	Action
      0	Push cart to the left
      1	Push cart to the right
      
      Note: The amount the velocity that is reduced or increased is not fixed; it depends on the angle the pole is pointing. This is because the center of gravity of the pole increases the amount of energy needed to move the cart underneath it
  Reward:
      Reward is 1 for every step taken, including the termination step
  Starting State:
      All observations are assigned a uniform random value in [-0.05..0.05]
  Episode Termination:
      Pole Angle is more than 12 degrees
      Cart Position is more than 2.4 (center of the cart reaches the edge of the display)
      Episode length is greater than 200
      Solved Requirements
      Considered solved when the average reward is greater than or equal to 195.0 over 100 consecutive trials.
  """

#!/usr/bin/python3
import gym
import numpy as np
from dueling_dqn_keras import Agent


if __name__ == '__main__':
  n_games = 400

  # load the game
  env = gym.make('CartPole-v0')

  # There are two possible actions. Left or Right
  ACTIONS = env.action_space.n

  # There are 4 observations
  # Cart Position,Cart Velocity, Pole Angle, Pole Velocity At Tip
  # So the shape should be (4,Null) meaning 4 values, each with an unknown shape.
  OBSERVATIONS = env.observation_space.shape

  agent = Agent(n_actions=ACTIONS, gamma=0.99, epsilon=1, lr=1e-3, input_dims=[4], epsilon_dec=1e-3, mem_size=100000, batch_size=64, epsilon_end=0.01, fc1_dims=128, fc2_dims=128, replace=100)

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
      env.render()
    
    eps_history.append(agent.epsilon)
    scores.append(score)

    avg_score = np.mean(scores[-100:])
    print('episode ', i, 'score %.1f' % score, 
          'average score last 100 games %.1f' % avg_score, 
          'epsilon %2f' % agent.epsilon)

