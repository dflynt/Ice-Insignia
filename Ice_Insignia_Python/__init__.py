from flask import Flask
from flask_socketio import SocketIO, emit, send

socketio = SocketIO()

def create_app(debug=False):
	app = Flask(__name__)
	app.debug = debug
	from .main import main as main_blueprint
	app.register_blueprint(main_blueprint)

	socketio.init_app(app)
	return app