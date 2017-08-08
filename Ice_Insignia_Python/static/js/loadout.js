//this JSFiddle is a god send
//https://jsfiddle.net/drzaus/mP8kY/
var socket;
$(document).ready(function() {

	var cookieString = document.cookie;
	var cookieArray = cookieString.split(";");
	var username = cookieArray[0].substring(9);
    var enemyname = cookieArray[1].substring(10);
    alert("Username: " + username + " Enemy name: " + enemyname);

    var p1username = document.getElementById("playerOneName");
    p1username.innerHTML = username;

    var p2username = document.getElementById("playerTwoName");
    p2username.innerHTML = enemyname;

	socket = io.connect('http://' + document.domain + ":" + 
                          location.port + '/loadout');
    
	socket.on('connect', function() { //the socket receives 'connect'
		socket.emit('joinedGameLobby', {msg: username}); //the socket sends 'joined' with JSON
    });
    
    socket.on('setCharChoice', function(data) {
        var htmlElementIDToAppend = data.html;
        htmlElementIDToAppend.substring(13);
        var fileLoc = data.fileLoc;
        switch(htmlElementIDToAppend) {
            case "SlotOne":
                var elementSlot = document.getElementById("playerTwoCharSlotOne");
                var imgElement = document.createElement("IMG");
                imgElement.src = data.fileLoc;
                elementSlot.append(imgElement);

            case "SlotTwo":
                var elementSlot = document.getElementById("playerTwoCharSlotTwo");
                var imgElement = document.createElement("IMG");
                imgElement.src = data.fileLoc;
                elementSlot.append(imgElement);

            case "SlotThree":
                var elementSlot = document.getElementById("playerTwoCharSlotThree");
                var imgElement = document.createElement("IMG");
                imgElement.src = data.fileLoc;
                elementSlot.append(imgElement);

            case "SlotFour":
                var elementSlot = document.getElementById("playerTwoCharSlotFour");
                var imgElement = document.createElement("IMG");
                imgElement.src = data.fileLoc;
                elementSlot.append(imgElement);

            case "SlotFive":
                var elementSlot = document.getElementById("playerTwoCharSlotFive");
                var imgElement = document.createElement("IMG");
                imgElement.src = data.fileLoc;
                elementSlot.append(imgElement);
        }
    });

    socket.on('setItemChoice', function(data) {
        var htmlElementIDToAppend = data.html;
        htmlElementIDToAppend.substring(13);        
        var fileLoc = data.fileLoc;
        switch(htmlElementIDToAppend) {
            case "SlotOne":
                var elementSlot = document.getElementById("playerTwoItemSlotOne");
                var imgElement = document.createElement("IMG");
                imgElement.src = data.fileLoc;
                elementSlot.append(imgElement);

            case "SlotTwo":
                var elementSlot = document.getElementById("playerTwoItemSlotTwo");
                var imgElement = document.createElement("IMG");
                imgElement.src = data.fileLoc;
                elementSlot.append(imgElement);

            case "SlotThree":
                var elementSlot = document.getElementById("playerTwoItemSlotThree");
                var imgElement = document.createElement("IMG");
                imgElement.src = data.fileLoc;
                elementSlot.append(imgElement);

            case "SlotFour":
                var elementSlot = document.getElementById("playerTwoItemSlotFour");
                var imgElement = document.createElement("IMG");
                imgElement.src = data.fileLoc;
                elementSlot.append(imgElement);

            case "SlotFive":
                var elementSlot = document.getElementById("playerTwoItemSlotFive");
                var imgElement = document.createElement("IMG");
                imgElement.src = data.fileLoc;
                elementSlot.append(imgElement);
        }        
    });

    socket.on('readyUp', function(data) {

    });

    $("#readyBtn").click(function() {
        var charSlots = document.getElementsByClassName("p1charSlot");
        var itemSlots = document.getElementsByClassName("p1itemSlot");
        var hasEmptyCharSlots = false;
        var hasEmptyItemSlots = false;

        for(var i = 0; i < charSlots.length; i++) {
            if(charSlots[i] == null) {
                hasEmptyCharSlots = true;
                alert("You must have 5 characters.");
                break;
            }
            if(itemSlots[i] == null) {
                hasEmptyItemSlots = true;
                alert("You must have an item for each character.");
                break;
            }  
        }
        if(hasEmptyCharSlots == false && hasEmptyItemSlots == false) {
            socket.emit('readyUp', {msg: username});
        }
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

            socket.emit('selectChar', {msg: enemyname + "," + 
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
            socket.emit('selectItem', {msg: enemyname + "," + slotInserted + "," + fileLoc});
            //send to enemy so I know which room to send info to in game.py
        }
    });
});