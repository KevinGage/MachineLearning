import pyglet.app
from pyglet.window import key
from bird import bird

window = pyglet.window.Window(800, 600, 'flappy bird')

agent = bird(0,0)

score = 0
highScore = 0

score_label = pyglet.text.Label(f'Score: {score}',
  font_name='Times New Roman',
  font_size=10,
  x=0, y=window.height - 20,
  anchor_x='left', anchor_y='center')

high_score_label = pyglet.text.Label(f'High Score: {highScore}',
  font_name='Times New Roman',
  font_size=10,
  x=0, y=score_label.y - 15,
  anchor_x='left', anchor_y='center')

def updateScore(dt):
  global score
  global highScore

  score += 1
  if score > highScore:
    highScore = score
  
  score_label.text = f'Score: {score}'
  high_score_label.text = f'High Score: {highScore}'

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