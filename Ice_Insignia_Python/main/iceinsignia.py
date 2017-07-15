from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO
from . import main
import psycopg2

conn = psycopg2.connect("dbname = 'accountsdb' user = 'postgres'"
						"host = 'localhost' password = 'yourPassword'")
cur = conn.cursor()

@main.route("/")
def root():
	return render_template("index.html")

@main.route("/howtoplay")
def howToPlay():
	return render_template("howtoplay.html")

@main.route("/registration")
def registration():
	return render_template("registration.html")

@main.route("/login")
def login():
	return render_template("login.html")

@main.route("/checklogin", methods=["POST"])
def checkLogin():
	print("Checking login")
	content = request.get_json()
	cur.execute("SELECT * FROM accountstbl"
				" where username = %s and passw = %s",
				(content["username"], content["passw"]))
	result = cur.fetchall()
	if result:
		print("Logging in to account: ", end="")
		print(result)
		return jsonify("success")
	else:
		return jsonify("invalid-login")

@main.route("/register", methods=["POST"])
def register():
	content = request.get_json()
	cur.execute("SELECT username FROM accountstbl"
				" where username = '%s'" %(content["username"]))
	usernameTuple = cur.fetchall()

	cur.execute("SELECT email FROM accountstbl"
				" where email = '%s'" %(content["email"]))
	emailTuple = cur.fetchall()

	if usernameTuple and emailTuple:
		print("Username and email in use: ", end="")
		print(content)
		return jsonify("duplicate-username_email")
		
	elif usernameTuple: #if record already exists
		print("Username in use: ", end="")
		print(content)
		return jsonify("duplicate-username")

	elif emailTuple:
		print("Email in use: ", end="")
		print(content)
		return jsonify("duplicate-email")
	else:
		cur.execute("INSERT into accountstbl (first_name, last_name, username,"
					" passw, email) VALUES (%s, %s, %s, %s, %s)",
					(content["first_name"], content["last_name"], 
					 content["username"], content["passw"], content["email"]))
		conn.commit()

		print("New Account Registered: ", end="")
		print(content)
		return jsonify("success")

@main.route("/lobby", methods=["POST"])
def lobby():
	print("Sending user to lobby")
	return render_template("lobby.html")
