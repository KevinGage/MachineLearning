import tensorflow as tf
import tensorflow.keras as keras
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.models import load_model
import numpy as np

# Dueling Deep Q Network
# Handles the estimation of the action/value function
# Dims = dimensions
class DuelingDeepQNetwork(keras.Model):
  # init function for the class.  takes in 
  # possible number of actions
  # fully connected layer1 dimensions
  # fully connected layer2 dimensions
  def __init__(self, n_actions, fc1_dims, fc2_dims):
    super(DuelingDeepQNetwork, self).__init__()
    self.dense1 = keras.layers.Dense(fc1_dims, activation='relu')
    self.dense2 = keras.layers.Dense(fc2_dims, activation='relu')
    # A Deep Q network would just have a Q output layer here with an output for each possible action
    self.V = keras.layers.Dense(1, activation=None) # Dingle output for Value for the state, or set of states.
    self.A = keras.layers.Dense(n_actions, activation=None) # Advantage layer.  The advantage of each action for each state or set of states.  Similar to the Q value.  How much reward you might get for each action.  One output for each possible action

  # function to pass data through the neural network.
  # Basically feed forward but data goes through dense1, then dense 2, then splits into V and A.
  # Both V and A give outputs.
  # Then use V and A to calculate Q and return it 
  def call(self, state):
    x = self.dense1(state) # pass through dense layer 1
    x = self.dense2(x) # pass through dense layer 2
    V = self.V(x) # get V (Value) from the value layer
    A = self.A(x) # get A (Advantage) from the advantage layer
  
    # Get the Q value based on V and A
    # Can't just add them together.  This is a forumla for getting Q from V and A
    Q = (V + (A - tf.math.reduce_mean(A, axis=1, keepdims=True)))
    return Q

  # function for just getting advantage layer output
  # used for chosing actions
  # The author of the tutorial says this might be unnecisary.  Might be able to just use Q for chosing actions.  Maybe experiment
  def advantage(self, state):
    x = self.dense1(state) # pass through dense layer 1
    x = self.dense2(x) # pass through dense layer 2
    A = self.A(x) # get A (Advantage) from the advantage layer

    return A


# Replay Buffer
# Keeps track of the state, action, reward, new_state, and terminal_reward transitions
# So basically track what happened when taking an action at a given state
# Used for training nueral network
# If we don't buffer history then during training the network gets adjusted too much for what just happened and forgets past experiences.
class ReplayBuffer():
  # init functions.  takes a max size for the buffer and an input shape
  def __init__(self, max_size, input_shape):
    # mem_size is basically number of memories
    self.mem_size = max_size
    # counter for tracking current position in replay buffer
    self.mem_cntr = 0

    # Create a numpy array of zeros with the size of memsize by input shape. 
    # so with a mem size of 2 we would have 2 arrays, each with all state values at that point in time.
    self.state_memory = np.zeros((self.mem_size, *input_shape), dtype=np.float32)
    # Create another numpy array of the same size for new state memory.
    # this tracks what the new state was after taking an action
    self.new_state_memory = np.zeros((self.mem_size, *input_shape), dtype=np.float32)
    # Create a numpy array to store the int of action taken
    self.action_memory = np.zeros(self.mem_size, dtype=np.int32)
    # Create a numpy array to store the reward given after the transition
    self.reward_memory = np.zeros(self.mem_size, dtype=np.float32)
    # this environment gives bool values for if the game ended (terminal)
    self.terminal_memory = np.zeros(self.mem_size, dtype=np.bool)

  # function for adding new transitions into the memory
  def store_transition(self, state, action, reward, new_state, done):
    index = self.mem_cntr % self.mem_size
    self.state_memory[index] = state
    self.new_state_memory[index] = new_state
    self.action_memory[index] = action
    self.reward_memory[index] = reward
    self.terminal_memory[index] = done

    self.mem_cntr += 1

  # function to fetch (sample) a batch of memories to use for training
  def sample_buffer(self, batch_size):
    # don't want to fetch empty memories from buffer
    # so if the memory counter is less than it's max size only fetch up to that point
    max_mem = min(self.mem_cntr, self.mem_size) 
    # get a random batch up to the mem_cntr, or up to mem_size if it's full
    # don't sample the same memory more than one (replace=False)
    batch = np.random.choice(max_mem, batch_size, replace=False)

    # get all the values from the batches
    states = self.state_memory[batch]
    new_states = self.new_state_memory[batch]
    actions = self.action_memory[batch]
    rewards = self.reward_memory[batch]
    dones = self.terminal_memory[batch]

    return states, actions, rewards, new_states, dones



# Agent
class Agent():
  # init function takes in
  # lr (high learning rate means that each update will introduce a large change to the current state-action value. A small learning rate means that each update has a more subtle change. Modifying the learning rate will change how the agent explores the environment and how quickly it determines the final Q values)
  # gamma (how much to discount future rewards. Lower gamma means lower reward for future actions vs actions now)
  # n_actions (number of possible actions)
  # epsilon (chance to explore vs take best action. higher = more exploring)
  # epsilon_dec (the ammount to decrement epsilon so the agent explores less over time)
  # epsilon_end (the min value of epsilon so the agent always explores a little)
  # batch_size (how many memories to fetch from buffer in a batch)
  # input_dims (input dimensions)
  # mem_size (the max size for replay memory)
  # fname (file name for storing the model)
  # fc1_dims (deep neural network fully connected layer 1 dimensions)
  # fc2_dims (deep neural network fully connected layer 2 dimensions)
  # replace (how many steps to wait before updating weights in target network with weights in evaluation network.)
  def __init__(self, lr, gamma, n_actions, epsilon, batch_size,
               input_dims, epsilon_dec=1e-3, epsilon_end=0.01, 
               mem_size=100000, fname='dueling_dqn.h5', fc1_dims=128,
               fc2_dims=128, replace=100):
    # save possible actions
    self.action_space = [i for i in range(n_actions)]
    
    self.gamma = gamma
    self.epsilon = epsilon
    self.batch_size = batch_size
    self.eps_dec = epsilon_dec
    self.eps_min = epsilon_end
    self.fname = fname
    self.replace = replace

    # ENABLE TENSORFLOW EAGER EXECUTION.
    # THIS IS REQUIRED BUT WASNT IN DEMO
    # NOT SURE WHAT IT DOES
    tf.enable_eager_execution()

    # keep track of learn step so we know when to use replace function
    self.learn_step_counter = 0
    # create the memory buffer
    self.memory = ReplayBuffer(mem_size, input_dims)

    # create eval NN (used to evaluate Q values for possiblea actions)
    self.q_eval = DuelingDeepQNetwork(n_actions, fc1_dims, fc2_dims)
    # create target network (used to generate targets for cost function.)
    # in other words it's guessing values to train towards to make the NN more accurate
    # this is the network whos weights are not changed until replace is reached 
    self.q_next = DuelingDeepQNetwork(n_actions, fc1_dims, fc2_dims)

    #compile the networks
    self.q_eval.compile(optimizer=Adam(learning_rate=lr), loss='mean_squared_error')
    self.q_next.compile(optimizer=Adam(learning_rate=lr), loss='mean_squared_error')

  # Create an interface function between the agent and its memory
  def store_transition(self, state, action, reward, new_state, done):
    self.memory.store_transition(state, action, reward, new_state, done)
  
  # function to chose action based on current state of the environment
  def choose_action(self, observation):
    # if exploring
    if np.random.random() < self.epsilon:
      action = np.random.choice(self.action_space)
    # else take greedy action
    else:
      # get the current state
      state = np.array([observation])
      # get the advantage layer output from the q_eval NN.  Basically get the Q values for all actions
      actions = self.q_eval.advantage(state)
      # get the action with the best Q value
      action = tf.math.argmax(actions, axis=1).numpy()[0]

    return action
  
  # define a learning function
  def learn(self):
    # if we haven't filled up memory buffer enough for a batch don't learn.
    # Just do stuff to fill up memory
    if self.memory.mem_cntr < self.batch_size:
      return

    # have we executed enough steps to replace weighs in target NN?
    if self.learn_step_counter % self.replace == 0:
      self.q_next.set_weights(self.q_eval.get_weights())
    
    # get a batch of memories to train with
    states, actions, rewards, new_states, dones = self.memory.sample_buffer(self.batch_size)

    # get q values
    q_pred = self.q_eval(states)
    # pass the next states to the target network to calculate the best possible action
    q_next = tf.math.reduce_max(self.q_next(new_states), axis=1, keepdims=True).numpy()

    q_target = np.copy(q_pred)

    # for each state in batch 
    for idx, terminal in enumerate(dones):
      # look at done flags.  If done the reward is zero because the game is done
      if terminal:
        q_next[idx] = 0.0
      
      # getting a target value for each action in the current state in the batch
      # do this by combining reward, gamma, and next action reward with this formula
      q_target[idx, actions[idx]] = rewards[idx] + self.gamma*q_next[idx]

    # train the NN using the batch of target values
    self.q_eval.train_on_batch(states, q_target)

    # Adjust epsilon unless it's already at it's minimum
    self.epsilon = self.epsilon - self.eps_dec if self.epsilon > self.eps_min else self.eps_min

    self.learn_step_counter += 1

  # function to save the model
  def save_model(self):
    self.q_eval.save(delf.model_file)
  
  # function to load a saved model
  def load_model(self):
    self.q_eval = load_model(self.model_file)