import pyglet.app

class bird():
  def __init__(self, x, y, max_y, batch, size = 25 ):
    self.score = 0
    self.high_score = 0
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

    # draw using an image
    # self.image = pyglet.resource.image('images/bird.png')

    # draw using vertex list.  more efficient than manually drawing primitives
    # but less efficient than batches
    # self.vertex_list = pyglet.graphics.vertex_list(4,
    #   ('v2f', corners),
    #   ('c3B', colors)
    # )

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
  
  # experimented with different ways of drawing.
  # according to the documentation the most efficient is using a batch
  # here are other examples of drawing
  # def draw(self):
    # was drawing with an image
    # self.image.blit(self.x, self.y)

    # manually draw a parimitive polygon
    # pyglet.graphics.draw(4, pyglet.gl.GL_POLYGON, 
    #   ('v2f', (self.x, self.y, self.x, self.y + self.size, self.x + self.size, self.y + self.size, self.x + self.size , self.y)), 
    #   ('c3B', (255, 255, 0, 255, 255, 0, 255, 255, 0, 255, 255, 0))
    # )
    
    # manually draw again.  this time a quad and with cleaner syntax
    # corners = (self.x, self.y, self.x, self.y + self.size, self.x + self.size, self.y + self.size, self.x + self.size , self.y)
    # color_pairs = (255,255,0) * int(len(corners)/2)

    # pyglet.graphics.draw(4, pyglet.gl.GL_QUADS, ('v2f', corners), ('c3B', color_pairs))


    # drawing a quad using vertex list.  More efficient than manually drawing primitives
    # but less efficient than batches
    # self.vertex_list.vertices = self.get_corners()
    # self.vertex_list.draw(pyglet.gl.GL_QUADS)

  def setScore(self, newScore):
    self.score = newScore
    if newScore > self.high_score:
      self.high_score = newScore