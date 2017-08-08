from flask import Blueprint, render_template, request, session
from flask_socketio import join_room, emit, rooms
from .. import socketio

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
    emit('setCharChoice', {'html': htmlElem, 'fileLoc': fileLoc},
                            room=user)

@socketio.on('selectItem', namespace='/loadout')
def selectItem(message):
    info = message['msg'].split(",")
    user = info[0]
    htmlElem = info[1]
    fileLoc = info[2]
    emit('setCharChoice', {'html': htmlElem, 'fileLoc': fileLoc}, 
                            room=user)
@socketio.on('readyUp', namespace='/loadout')
def readyUp(message):
    pass

@socketio.on('sendMove', namespace='/game')
def sendMove(message):
    pass


class Game:
    def __init__(self, clientone, clienttwo):
        self.playerone = clientone
        self.playertwo = clienttwo

    