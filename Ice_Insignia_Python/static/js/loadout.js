//this JSFiddle is a god send
//https://jsfiddle.net/drzaus/mP8kY/
var socket;
$(document).ready(function() {

	var cookieString = document.cookie;
	var cookieArray = cookieString.split(";");
	var username = cookieArray[0].substring(9);
    var enemyname = cookieArray[1].substring(10);
    alert("Username: " + username + " Enemy name: " + enemyname);
    
	socket = io.connect('http://' + document.domain + ":" + 
                          location.port + '/loadout');
    
	socket.on('connect', function() { //the socket receives 'connect'
		socket.emit('joinedGameLobby', {msg: username}); //the socket sends 'joined' with JSON
    });
    
    socket.on('setCharChoice', function(data) {
        alert(data);
    });

    socket.on('setItemChoice', function(data) {
        alert(data);
    });

    socket.on('readyUp', function(data) {

    });

    socket.on('enemyName', function(data) {
        var enemyUsername = data.msg;
	    document.cookie = "enemyUsername=" + enemyUsername; //save enemy name as cookie for next page
    });

    $("#readyBtn").click(function() {
        
    });

    $(".classIcon").draggable({
        currItemDragging: $(this).attr("id"),
        helper: 'clone',
        cursor: 'move',
        revertDuration: 0,
    });

    $(".p1charSlot").droppable({
        accept: ".classIcon",
        drop: function(event, ui) {
            var $item = ui.draggable.clone();
            $(this).addClass('has-drop').html($item).children();

            var slotInserted = $item.parent().get(0).id;
            var fileLoc = $item.children().attr('src'); //get the file location to send to other player 

            socket.emit('selectChar', {msg: "enemyUsername" + "," + 
                                       slotInserted + "," + fileLoc});
            //use enemyUsername so we know which room to send info to in game.py
            //we are sending:
            //The enemy name to specify the room in game.py
            //html element that was has a new icon
            //file location so it can be added            
        }
    });

    $(".itemIcon").draggable({
        currItemDragging: $(this).attr("id"),
        helper: 'clone',
        cursor: 'move',
        revertDuration: 0
    });

    $(".p1itemSlot").droppable({
        accept: ".itemIcon",
        drop: function(event, ui) {
            var $item = ui.draggable.clone();
            $(this).addClass('has-drop').html($item);
            var slotInserted = $item.parent().get(0).id;
            var fileLoc = $item.children().attr('src'); //get the file location to send to other player            
            socket.emit('selectItem', {msg: enemyUsername + "," + slotInserted + "," + fileLoc});
            //send to enemy so I know which room to send info to in game.py
        }
    });
});