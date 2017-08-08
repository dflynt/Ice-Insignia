from flask import Blueprint, render_template, request, session
from flask_socketio import join_room, emit, rooms
from .. import socketio

clientsDict = {} #dictionary instead of list for easy class information access. O(1)
			 	 #key = username, value = Client(username, socket ID)

clientsList = [] #list for sending connected usernames to new client
				 #because it's not easy to send a dictionary through json

@socketio.on('joinedChatLobby', namespace='/lobby')
#Previously had a TypeError saying I wasn't providing the message positional
#argument but I was. Still confused on that.
def joinServer(message):
	username = message['msg'] #username of new client
	clientsDict[username] = Client(username, request.sid)
	clientsList.append(username)
	join_room(username) #newly connected client has their own 
						#room for sending challenges/specific messages
						#Example below in line 28

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
	receiver = players[0] #who received the message
	sender = players[1] #who sent the message
	print(sender + " sent a challenge to " + receiver)

	#send a challenge message to the one being challenged
	emit('receiveChallenge', {'msg': sender}, room=receiver)

@socketio.on('acceptChallenge', namespace='/lobby')
def acceptChallenge(message):
	players = message['msg'].split(",") ##weaboutthatcopyandpastelife
	sender = players[0] #who received the challenge
	receiver = players[1] #who sent the challenge
	emit('receiveChallenge_RESULT', {'msg': receiver + " has accepted your challenege.",
		 'bool': "true"}, room=sender)
	

@socketio.on('declineChallenge', namespace='/lobby')
def declineChallenge(message):
	players = message['msg'].split(",") ##steadypastin'
	sender = players[0]
	receiver = players[1]
	emit('receiveChallenge_RESULT', {'msg': receiver + " has declined your challenege.",
		 'bool': "false"}, room=sender)

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
		return self.socketID