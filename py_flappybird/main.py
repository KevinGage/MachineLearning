import pyglet.app
from pyglet.window import key
from bird import bird

window = pyglet.window.Window(800, 600, 'flappy bird')

agent = bird(0,0)

score_label = pyglet.text.Label(f'Score: {agent.score}',
  font_name='Times New Roman',
  font_size=10,
  x=0, y=window.height - 20,
  anchor_x='left', anchor_y='center')

high_score_label = pyglet.text.Label(f'High Score: {agent.high_score}',
  font_name='Times New Roman',
  font_size=10,
  x=0, y=score_label.y - 15,
  anchor_x='left', anchor_y='center')

def updateScore(dt):
  agent.setScore(agent.score + 1)

  score_label.text = f'Score: {agent.score}'
  high_score_label.text = f'High Score: {agent.high_score}'

pyglet.clock.schedule_interval(updateScore, 0.1)

@window.event
def on_key_press(symbol, modifiers):
    if symbol == key.SPACE:
        agent.setPosition(agent.x, agent.y + 10)

@window.event
def on_draw():
  window.clear()
  agent.draw()
  score_label.draw()
  high_score_label.draw()

pyglet.app.run()