import pyglet.app

class bird():
  def __init__(self, x, y, max_y):
    self.score = 0
    self.high_score = 0
    self.x = x
    self.y = y
    self.max_y = max_y
    self.image = pyglet.resource.image('images/bird.png')
    self.gravity = 0.6
    self.lift = 10
    self.velocity = 0

  def update(self):
    self.velocity -= self.gravity
    self.y += self.velocity

    if (self.y < 0):
      self.y = 0
      self.velocity = 0
    
    if (self.y > self.max_y):
      self.y = self.max_y
  
  def jump(self):
    self.velocity = self.lift
  
  def draw(self):
    self.image.blit(self.x, self.y)
  
  def setScore(self, newScore):
    self.score = newScore
    if newScore > self.high_score:
      self.high_score = newScore