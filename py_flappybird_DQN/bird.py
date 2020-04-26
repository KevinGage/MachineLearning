import pyglet.app

class bird():
  def __init__(self, x, y, max_y, batch, size = 25 ):
    self.score = 0
    self.high_score = 0
    self.start_x = x
    self.start_y = y
    self.x = x
    self.y = y
    self.max_y = max_y
    self.gravity = 0.6
    self.lift = 10
    self.velocity = 0
    self.size = size

    self.vertex_list = batch.add(4, pyglet.gl.GL_QUADS, None,
      ('v2f', self.get_corners()),
      ('c3B', (255,255,0) * 4)
    )

  def update(self):
    self.velocity -= self.gravity
    self.y += self.velocity

    if (self.y < 0):
      self.y = 0
      self.velocity = 0
    
    if (self.y > self.max_y):
      self.y = self.max_y

    self.vertex_list.vertices = self.get_corners()
  
  def get_corners(self):
    return (self.x, self.y, self.x, self.y + self.size, self.x + self.size, self.y + self.size, self.x + self.size , self.y)
  
  def jump(self):
    self.velocity = self.lift
  
  def set_score(self, newScore):
    self.score = newScore
    if newScore > self.high_score:
      self.high_score = newScore
  
  def game_over(self):
    self.score = 0
    self.x = self.start_x
    self.y = self.start_y