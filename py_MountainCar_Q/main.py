#!/usr/bin/python3
import gym
import numpy as np

# import the game
env = gym.make("MountainCar-v0")
# reset and initialize the game
env.reset()

# define a learning rate
LEARNING_RATE = 0.1

# how important are future rewards over current rewards?
DISCOUNT = 0.95

# how many episodes to run through
EPISODES = 25000

# how many episodes to wait before show debug output
SHOW_EVERY = 2000
NEVER_SOLVED = True

# define size of observation space
# env.observation_space.high returns all of the highest possible state values
# each sample will have x data points where x is the number of values returned by the games state
# in this game the state has 2 values.  position and speed
# so the observation space will be 20 * 2 = 40
DISCRETE_OS_SIZE = [20] * len(env.observation_space.high)

# now get the lowest and highest possible value for each state variable
# split that range into 20 equal ranges
# in this case there are 2 state values
# val1: -1.2 through 0.6
# val2: -.07 through 0.07
# So split those ranges into 20 equal ranges and get
# val1: 20 ranges of length 0.09
# val2: 20 ranges of length 0.007 
DISCRETE_OS_WIN_SIZE = (env.observation_space.high-env.observation_space.low) / DISCRETE_OS_SIZE

# epsilon is the chance to perform exploring actions instead of best action
# higher = more exploring
epsilon = 0.5
START_ESPILON_DECAYING = 1
END_ESPILON_DECAYING = EPISODES // 2
EPSILON_DECAY_VALUE = epsilon / (END_ESPILON_DECAYING - START_ESPILON_DECAYING)

# initialize random q table
# in this particular game the reward value is always -1 until you reach goal.
# then the reward is 0
# so make the q table values between -2 and 0
# 
# make the table x3 dimensions
# the first two dimensions are from DISCRETE_OS_SIZE.  So in this case 20 x 20
# the third dimension is the number of possible actons the player can take in the game
# so in this example 3
# so in this example it looks a little like this
# | 0                                                | 1                                               | 2
# | [all 20 possible values][all 20 possible values] |[all 20 possible values][all 20 possible values] |[all 20 possible values][all 20 possible values]
q_table = np.random.uniform(low=-2, high=0, size=(DISCRETE_OS_SIZE + [env.action_space.n]))

# define a function that takes in a game state
# it returns a tupple that contains the current state positions fit into the window ranges 
def get_discrete_state(state):
    discrete_state = (state - env.observation_space.low) / DISCRETE_OS_WIN_SIZE
    return tuple(discrete_state.astype(np.int))


for episode in range(EPISODES):
    # show debug output
    if episode % SHOW_EVERY== 0:
        render = True
        print(f"Showing episode: {episode}")
    else:
        render = False

    # reset the game and get initial state
    discrete_state = get_discrete_state(env.reset())

    done = False

    while not done:
        # decide if should explore
        if np.random.random() > epsilon:
            # take the best action
            # the possible actions in the game are
            # 0: 
            # 1: 
            # 2: move right
            # look up the record in the q table for the current state
            # that record will have 3 values for the 3 possible actions
            # get the highest of the 3 values and perform that action
            action = np.argmax(q_table[discrete_state])
        else:
            #take a random action
            action = np.random.randint(0, env.action_space.n)
        
        # perform an action in the game and receive the new state, reward, and done information
        new_state, reward, done, _ = env.step(action)

        # convert the new state to the window ranges
        new_discrete_state = get_discrete_state(new_state)

        # visualize the game
        if render:
            env.render()

        if not done:
            # get the best next possible action
            max_future_q = np.max(q_table[new_discrete_state])

            # get current q value from table for the action that was taken
            current_q = q_table[discrete_state + (action, )]

            # formula for calculating new q value based on action taken
            new_q = (1 - LEARNING_RATE) * current_q + LEARNING_RATE * (reward + DISCOUNT * max_future_q)
            
            # update the q table with the new q value for the action that was taken
            q_table[discrete_state+(action, )] = new_q
        
        # if got the reward
        elif new_state[0] >= env.goal_position:
            # update the q table with the success value of 0, which is the best case
            q_table[discrete_state + (action,)] = 0
            if NEVER_SOLVED == True:
                print(f"Success on episode {episode}")
                NEVER_SOLVED = False

        discrete_state = new_discrete_state

    # If in the exploring rangle of episodes reduce the explore rate
    if END_ESPILON_DECAYING >= episode >= START_ESPILON_DECAYING:
        epsilon -= EPSILON_DECAY_VALUE

env.close()