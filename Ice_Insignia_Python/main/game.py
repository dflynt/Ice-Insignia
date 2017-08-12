from flask import Blueprint, render_template, request, session
from flask_socketio import join_room, emit, rooms
from .. import socketio
import random

clientsList = []
@socketio.on('joinedGameLobby', namespace='/loadout')
def joinedGame(message):
    username = message['msg']
    print("New user: " + username)
    clientsList.append(username)
    join_room(username)

@socketio.on('selectChar', namespace='/loadout')
def selectChar(message):
    info = message['msg'].split(",")
    user = info[0] #user to send message to
    htmlElem = info[1] #element that will get the picture
    fileLoc = info[2] #source of the picture
    emit('setCharChoice', {'html': htmlElem, 'fileLoc': fileLoc}, room=user)

@socketio.on('selectItem', namespace='/loadout')
def selectItem(message):
    info = message['msg'].split(",")
    user = info[0]
    htmlElem = info[1]
    fileLoc = info[2]
    emit('setItemChoice', {'html': htmlElem, 'fileLoc': fileLoc}, room=user)

@socketio.on('readyUp', namespace='/loadout')
def readyUp(message):
    print("in readyup")
    playerToGetMessage = message['msg']
    emit('readyUp', {'msg': "start"}, room=playerToGetMessage)

@socketio.on('startCountdown', namespace='/loadout')
def sendCountdownMessage(message):
    mapNumber = random.randint(1, 3)
    info = message['msg'].split(",")
    playerOne = info[0]
    playerTwo = info[1]
    emit('startCountdown', {'msg': mapNumber}, room = playerOne)
    emit('startCountdown', {'msg': mapNumber}, room = playerTwo)

@socketio.on('sendMove', namespace='/game')
def sendMove(message):
    pass


class Game:
    def __init__(self, clientone, clienttwo):
        self.playerone = clientone
        self.playertwo = clienttwo
