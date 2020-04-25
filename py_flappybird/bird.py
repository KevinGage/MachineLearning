import pyglet.app

class bird():
  def __init__(self, x, y):
    self.score = 0
    self.high_score = 0
    self.x = x
    self.y = y
    self.image = pyglet.resource.image('images/bird.png')
  
  def setPosition(self, x, y):
    self.x = x
    self.y = y
  
  def draw(self):
    self.image.blit(self.x, self.y)
  
  def setScore(self, newScore):
    self.score = newScore
    if newScore > self.high_score:
      self.high_score = newScore