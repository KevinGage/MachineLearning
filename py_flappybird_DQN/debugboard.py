import pyglet.app
import numpy as np

class debugboard():
  def __init__(self, x, y, batch):
    self.game_count = 1
    self.x = x
    self.y = y
    self.batch = batch
    self.scores = [0]

    self.game_count_label = pyglet.text.Label(f'Game number: {self.game_count}',
      font_name='Times New Roman',
      font_size=10,
      x=self.x, y=self.y,
      anchor_x='left', anchor_y='center',
      batch=batch)
    
    self.average_score_label = pyglet.text.Label(f'Average over last 100: 0',
      font_name='Times New Roman',
      font_size=10,
      x=self.x, y=self.y - 15,
      anchor_x='left', anchor_y='center',
      batch=batch)

  def set_metrics(self, game_count, score):
    self.game_count = game_count

    self.game_count_label.text = f'Game number: {self.game_count}'

    self.scores.append(score)

    avg_score = int(round(np.mean(self.scores[-100:]), 0))
    self.average_score_label.text = f'Average over last 100: {avg_score}'