var socket = io.connect(null, {port: 5000, rememberTransport: false});
$(document).ready(function(){

	socket.on('connect', function() {
		console.log("In connect");
		socket.emit('connect', {});
	});

	socket.on('text', function(data) {
		$('textLog').value += data.msg + '\m';
	});

	$('textBox').keypress(function(e) {
		if (e == 13) {
			var message = $('textBox').val();
			console.log('sending message' + message);
			$('textBox').val('');
			socket.emit('rec_message', {msg: message});
		}
	});

	$('submit').click(function() {
		var message = $('textBox').val();
		$('textBox').val('');
		socket.emit('rec_message', {msg: message});	
	});
});




