var socket;
$(document).ready(function(){

	//format of cookie set in login.js line 41 is: 
	//username=x so it needs to be parsed
	var username = document.cookie.substring(9, document.cookie.length);
	var textArea = $('#textLog');
	textArea.val("");

	socket = io.connect('http://' + document.domain + ":" + 
						location.port + '/lobby');

	socket.on('connect', function() { //the socket receives 'connect'
		socket.emit('joined', {msg: username}); //the socket sends 'joined' with JSON
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
		alert(data.msg + " has challenged you to a game.");
	});
	//this method and the following on click function work together
	$("#sendChallenge").on("click", function() {
		var classlist = document.getElementsByClassName("active"); //returns list

		if(classlist.length == 1 && classlist[0].id != username) { //if user selected
			var userToChallenge = classlist[0];
			socket.emit('challenge', {msg: userToChallenge.id + "," + username});
		}
	});


	//format for dynamically created elements
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


	$(window).bind("beforeunload", function(e) {
		//'disconnectUser' works but 'disconnect' doesn't work???
		socket.emit('disconnectUser', {msg: username}, function() {
			socket.disconnect();
		});
	});
});





