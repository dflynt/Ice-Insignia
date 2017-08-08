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
    print(message)

@socketio.on('readyUp', namespace='/loadout')
def readyUp(message):
    pass

@socketio.on('selectItem', namespace='/loadout')
def selectItem(message):
    print(message)

@socketio.on('sendMove', namespace='/game')
def sendMove(message):
    pass


class Game:
    def __init__(self, clientone, clienttwo):
        self.playerone = clientone
        self.playertwo = clienttwo

    