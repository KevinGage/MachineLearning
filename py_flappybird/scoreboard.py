import pyglet.app

class scoreboard():
  def __init__(self, x, y, batch):
    self.score = 0
    self.highscore = 0
    self.x = x
    self.y = y
    self.batch = batch

    self.score_label = pyglet.text.Label(f'Score: {self.score}',
      font_name='Times New Roman',
      font_size=10,
      x=self.x, y=self.y,
      anchor_x='left', anchor_y='center',
      batch=batch)

    self.high_score_label = pyglet.text.Label(f'High Score: {self.highscore}',
      font_name='Times New Roman',
      font_size=10,
      x=self.x, y=self.score_label.y - 15,
      anchor_x='left', anchor_y='center',
      batch=batch)

  def set_score(self, score):
    self.score = score
    if score > self.highscore:
      self.highscore = score
    
    self.score_label.text = f'Score: {score}'
    self.high_score_label.text = f'High Score: {self.highscore}'