import pyglet.app

class bird():
  def __init__(self, x, y):
    self.x = x
    self.y = y
    self.image = pyglet.resource.image('bird.png')
  
  def setPosition(self, x, y):
    self.x = x
    self.y = y
  
  def draw(self):
    self.image.blit(self.x, self.y)