var socket;
$(document).ready(function() {

	//format of cookie set in login.js line 41 is: 
	//username=x so it needs to be parsed
	var cookieString = document.cookie;
	var cookieArray = cookieString.split(";");
	var username = cookieArray[0];
	username = username.substring(9);

	var textArea = $('#textLog');
	textArea.val("");

	socket = io.connect('http://' + document.domain + ":" + 
						location.port + '/lobby');

	socket.on('connect', function() { //the socket receives 'connect'
		socket.emit('joinedChatLobby', {msg: username}); //the socket sends 'joined' with JSON
	});

	socket.on('printmessage', function(data) {
		textArea.val(textArea.val() + data.msg + "\n");
	});

	socket.on('showUsersList', function(data) {
		for(var index = 0; index < data.length; index++) {
			if(username !== data[index]) {
				$("#userList").append("<a href='#' class = user id = " + data[index] + 
				  ">" + data[index]+ "</a>");
			}
		}
	});

	socket.on('removeUser', function(data) {
		var username = data.msg;
		$("#" + username).remove();
	});

	socket.on('addNewUser', function(data) {
		var username = data.msg;
		$("#userList").append("<a href='#' class = user id = " + 
		  					  username + ">" + username + "</a>");
	});

	socket.on('receiveChallenge', function(data) {
		if(window.confirm(data.msg + " has challenged you to a game.") == true) {
			document.cookie = "enemyname=" + data.msg; //sets cookie for use during game			
			socket.emit('acceptChallenge', {msg: data.msg + "," + username});
			socket.close();
			window.location = "/loadout";			
		}
		else {
			socket.emit('declineChallenge', {msg: data.msg + "," + username});
		}
	});

	socket.on('receiveChallenge_RESULT', function(data) {
		if(data.bool == "true") {
			socket.close();
			document.cookie = "enemyname=" + data.msg; //sets cookie for use during game			
			window.location = "/loadout";			
		}
		else if (data.bool == "false") {
			alert("Challenge declined.");
		}
	});
	//this method and the following on-click function work together
	$("#sendChallenge").on("click", function() {
		var classlist = document.getElementsByClassName("active"); //returns list
		if(classlist.length == 1 && classlist[0].id != username) { //if user selected
			var userToChallenge = classlist[0];
			alert("You will automatically be redirected if they accept your challenege");
			socket.emit('challenge', {msg: userToChallenge.id + "," + username});
		}
	});

	//format below is necessary for dynamically created elements
	//listens for a click on a user in the #userList div
	//users with a class of 'active' have different CSS values compared
	//to those with a value of 'user'
	$(document).on("click", ".user", function() {
		var prevSelected = document.getElementsByClassName("active");
		if(prevSelected.length == 1) { //if already selected a user but want to change
			prevSelected[0].className = "user";
			$(this).removeClass("user");
			$(this).addClass("active");
		}
		else {
			$(this).removeClass("user");
			$(this).addClass("active");
		}
	});

	$('#textBox').keydown(function(e) {
		if(e.keyCode == 13) {
			var message = $('#textBox').val();
			$('#textBox').val('');
			socket.emit('send_message', {msg: username + ": " + message});
		}
	});

	$('#sendMess').click(function() {
		var message = $('#textBox').val();
		$('#textBox').val('');
		socket.emit('send_message', {msg: username + ": " + message});	
	});


	//Disconnect from server if user closes window
	$(window).bind("beforeunload", function(e) {
		//'disconnectUser' works but 'disconnect' doesn't work???
		socket.emit('disconnectUser', {msg: username}, function() {
			socket.disconnect();
		});
	});
});





