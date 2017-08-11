//this JSFiddle is a god send
//https://jsfiddle.net/drzaus/mP8kY/
var socket;
var enemyReady = false;
var playerReady = false;
var timeLeft = 5;
$(document).ready(function() {

	var cookieString = document.cookie;
    var cookieArray = cookieString.split(";");
	var username = cookieArray[0].substring(9);
    var enemyname = cookieArray[1].substring(11);

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
        htmlElementIDToAppend = htmlElementIDToAppend.substring(13);
        var fileLoc = data.fileLoc;
        switch(htmlElementIDToAppend) {
            case "SlotOne":
                var elementSlot = document.getElementById("playerTwoCharSlotOne");
                var imgElement = document.createElement("IMG");
                imgElement.src = data.fileLoc;
                console.log("appending " + imgElement);
                elementSlot.append(imgElement);
                break;

            case "SlotTwo":
                var elementSlot = document.getElementById("playerTwoCharSlotTwo");
                var imgElement = document.createElement("IMG");
                imgElement.src = data.fileLoc;
                elementSlot.append(imgElement);
                break;
            
            case "SlotThree":
                var elementSlot = document.getElementById("playerTwoCharSlotThree");
                var imgElement = document.createElement("IMG");
                imgElement.src = data.fileLoc;
                elementSlot.append(imgElement);
                break;

            case "SlotFour":
                var elementSlot = document.getElementById("playerTwoCharSlotFour");
                var imgElement = document.createElement("IMG");
                imgElement.src = data.fileLoc;
                elementSlot.append(imgElement);
                break;
            
            case "SlotFive":
                var elementSlot = document.getElementById("playerTwoCharSlotFive");
                var imgElement = document.createElement("IMG");
                imgElement.src = data.fileLoc;
                elementSlot.append(imgElement);
                break;
        }
    });

    socket.on('setItemChoice', function(data) {
        var htmlElementIDToAppend = data.html;
        htmlElementIDToAppend = htmlElementIDToAppend.substring(13);        
        var fileLoc = data.fileLoc;
        switch(htmlElementIDToAppend) {
            case "SlotOne":
                var elementSlot = document.getElementById("playerTwoItemSlotOne");
                var imgElement = document.createElement("IMG");
                imgElement.src = data.fileLoc;
                elementSlot.append(imgElement);
                break;

            case "SlotTwo":
                var elementSlot = document.getElementById("playerTwoItemSlotTwo");
                var imgElement = document.createElement("IMG");
                imgElement.src = data.fileLoc;
                elementSlot.append(imgElement);
                break;

            case "SlotThree":
                var elementSlot = document.getElementById("playerTwoItemSlotThree");
                var imgElement = document.createElement("IMG");
                imgElement.src = data.fileLoc;
                elementSlot.append(imgElement);
                break;

            case "SlotFour":
                var elementSlot = document.getElementById("playerTwoItemSlotFour");
                var imgElement = document.createElement("IMG");
                imgElement.src = data.fileLoc;
                elementSlot.append(imgElement);
                break;

            case "SlotFive":
                var elementSlot = document.getElementById("playerTwoItemSlotFive");
                var imgElement = document.createElement("IMG");
                imgElement.src = data.fileLoc;
                elementSlot.append(imgElement);
                break;
        }
    });

    socket.on('readyUp', function(data) {
        enemyReady = true;
        if(playerReady) {
            socket.emit('startCountdown', {msg: username + "," + enemyname});
        }
    });

    socket.on('startCountdown', function(data) {
        var mapNumber = data.msg; //load the map decided by the server
        document.cookie = "mapNumber=" + mapNumber;
        var countDownVar = setInterval(countdownFunc, 1000); //update every second
    })

    function countdownFunc() {
        if(timeLeft >= 2) {
        document.getElementById("countDownTimer").innerHTML = "The game will start in " + timeLeft + " seconds";
        }
        else { //only one second left
            document.getElementById("countDownTimer").innerHTML = "The game will start in " + timeLeft + " second";
        }
        timeLeft -= 1;
        if(timeLeft == 0) {
            //set cookies

            window.location = "/game";
        }
    }

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
            playerReady = true;
            socket.emit('readyUp', {msg: enemyname}); //send update to enemy
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
        currItemDragging: $(this).first().attr("id"),
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