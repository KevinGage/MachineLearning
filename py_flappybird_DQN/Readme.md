This is an attempt to slove my python flappy bird with Deep Reinforcement Learning.

I will be using the Dueling Deep Q Networks to based on the example I used to solve LunarLander

# Setup

Create a python environment and install pre-requisits to use

* create environment ```python3 -m venv {env name}```
* activate environment ```source {env name}\bin\activate```
* install requirements.txt ```pip3 install -r requirements.txt```

# Train

1. There are already saved weights in 'solved_weights.h5'. Delete or rename this if you want to train your own weights.
2. Set target score in train.py. It is 10000 by default
3. ```source {env name}\bin\activate```
4. ```python ./train.py```
5. After the agent hits the target score a new solved_weights file will be created.

# Play game with saved weights

1. Make sure there is a 'solved_weights.h5' file in the current path
3. ```source {env name}\bin\activate```
4. ```python ./solved.py```