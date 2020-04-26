import pyglet.app
from pyglet.window import key
from bird import bird

window = pyglet.window.Window(800, 600, 'flappy bird')

main_batch = pyglet.graphics.Batch()

agent = bird(25 ,0, window.height, main_batch)

score_label = pyglet.text.Label(f'Score: {agent.score}',
  font_name='Times New Roman',
  font_size=10,
  x=0, y=window.height - 20,
  anchor_x='left', anchor_y='center',
  batch=main_batch)

high_score_label = pyglet.text.Label(f'High Score: {agent.high_score}',
  font_name='Times New Roman',
  font_size=10,
  x=0, y=score_label.y - 15,
  anchor_x='left', anchor_y='center',
  batch=main_batch)

def updateScore(dt):
  if agent.y > 0:
    agent.setScore(agent.score + 1)
  else:
    agent.setScore(0)

  agent.update()

  score_label.text = f'Score: {agent.score}'
  high_score_label.text = f'High Score: {agent.high_score}'

pyglet.clock.schedule_interval(updateScore, 1 / 120)

@window.event
def on_key_press(symbol, modifiers):
    if symbol == key.SPACE:
        agent.jump()

@window.event
def on_draw():
  window.clear()
  main_batch.draw()

pyglet.app.run()