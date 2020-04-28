This is an attempt to slove my python flappy bird with Deep Reinforcement Learning.

I will be using the Dueling Deep Q Networks to based on the example I used to solve LunarLander

# Setup

Create a python environment and install pre-requisits to use

* create environment ```python3 -m venv {env name}```
* activate environment ```source {env name}\bin\activate```
* install requirements.txt ```pip3 install -r requirements.txt```

# Play the game yourself
1. ```source {env name}\bin\activate```
2. ```python ./play.py```

# Train
1. There are already saved weights in 'solved_weights.h5' which acheived a score of 10000. Delete or rename this if you want to train your own weights.
2. Set "TARGET_SCORE" in train.py. It is 10000 by default
3. Set "N_GAMES" (max number of games) in train.py.  It is 1000 by default
4. ```source {env name}\bin\activate```
5. ```python ./train.py```
6. After the agent hits the target score a new solved_weights file will be created.

# Play game with saved weights
1. Make sure there is a 'solved_weights.h5' file in the current path
3. ```source {env name}\bin\activate```
4. ```python ./solved.py```