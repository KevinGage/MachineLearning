import pyglet.app

class pipe():
  # x and y should be top left point of bottom quad
  def __init__(self, x, y, width, gap, velocity, window_height, batch ):
    self.x = x
    self.y = y
    self.width = width
    self.gap = gap
    self.velocity = velocity
    self.window_height = window_height

    self.bottom_vertex_list = batch.add(4, pyglet.gl.GL_QUADS, None,
      ('v2f', self.get_corners()[1]),
      ('c3B', (0,255,0) * 4)
    )

    self.top_vertex_list = batch.add(4, pyglet.gl.GL_QUADS, None,
      ('v2f', self.get_corners()[0]),
      ('c3B', (0,255,0) * 4)
    )

  def update(self):
    self.x -= self.velocity

    self.top_vertex_list.vertices = self.get_corners()[0]
    self.bottom_vertex_list.vertices = self.get_corners()[1]

  # return array with 2 values
  # val 0 is vertices for top quad
  # val 1 is vertices for bottom quad
  def get_corners(self):
    top = (self.x, self.y + self.gap, self.x + self.width, self.y + self.gap, self.x + self.width, self.window_height, self.x, self.window_height)
    bottom = (self.x, self.y, self.x + self.width, self.y, self.x + self.width, 0, self.x, 0)
    return [top, bottom]

  def delete(self):
    self.top_vertex_list.delete()
    self.bottom_vertex_list.delete()