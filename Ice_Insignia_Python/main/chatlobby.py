from flask import Blueprint, render_template, request, session
from flask_socketio import join_room, emit, rooms
from .. import socketio

clientsDict = {} #dictionary instead of list for easy class information access. O(1)
			 	 #key = username, value = Client(username, socket ID)

clientsList = [] #list for sending connected usernames to new client
				 #because it's not easy to send a dictionary through json

@socketio.on('joined', namespace='/lobby')
#Previously had a TypeError saying I wasn't providing the message positional
#argument but I was. Still confused on that.
def joinServer(message):
	username = message['msg'] #username of new client
	clientsDict[username] = Client(username, request.sid)
	clientsList.append(username)
	join_room(username) #newly connected client has their own 
						#room for sending challenges/specific messages
						#Example below in the emit('showUsersList') line

	emit('printmessage', {'msg': username + " connected to server."}, broadcast=True)

	#add new client to username-list of all previously connected clients
	emit('addNewUser', {'msg': username}, broadcast=True)

	#send already-connected users to the new client
	emit('showUsersList', clientsList, room=username)

@socketio.on('send_message', namespace='/lobby')
def sendMessage(message):
	print("Received message: " + message['msg'])

	emit('printmessage', message, broadcast=True)

@socketio.on('challenge', namespace='/lobby')
def sendChallenege(message):
	players = message['msg'].split(",")
	receiver = players[0]
	sender = players[1]
	print(sender + " sent a challenge to " + receiver)

	#send a challenge message to the one being challenged
	emit('receiveChallenge', {'msg': sender}, room=receiver)

#disconnectUser works but disconnect doesn't?
@socketio.on('disconnectUser', namespace='/lobby')
def disconnectClient(message):
	username = message['msg']
	print(username + " has disconnected.")
	del clientsDict[username]
	clientsList.remove(username)

	emit('printmessage', {'msg': username + " has disconnected."}, broadcast=True)

	emit('removeUser', {'msg': username}, broadcast=True)


class Client:
	def __init__(self, username, socketID):
		self.username = username
		self.socketID = socketID

	def getUsername():
		return self.username
	def getSocketID():
		return self.socketID74  