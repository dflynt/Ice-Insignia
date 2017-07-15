from flask import Blueprint, render_template, request, session
from flask_socketio import SocketIO, emit, send, join_room, leave_room
from .. import socketio

clients = []

lobby = Blueprint('lobby', __name__,
					  template_folder='templates')

@socketio.on('connect', namespace='/lobby')
def connect():
	print("Request.namespace: ", end="")
	print(request.sid)
	clients.append(request.sid)
	print(clients)
	room = session.get('room')
	join_room(room)
	emit('text', {'msg': "New user"})
	print(room)
	#emit('message', {'data': "Hello"})

@socketio.on('rec_message')
def receive_message(message):
	print("Received message: " + message)
	room = session.get('room')
	emit('text', {'msg': session.get('name') + ": " + message['msg']}, room=room)