$(document).ready(function() {
	var form = document.getElementById("loginForm");
	var usernameInput = document.getElementById("usernameInput");
	var passwordInput = document.getElementById("passwordInput");
	var invalidLoginError = document.getElementById("invalidlogin");
	var passLblError = document.getElementById("invalidpass");
	var userInfo = [];
	
	$("#submitLoginForm").on("click", function(e) {
		e.preventDefault();
		if(usernameInput.value != "" && passwordInput.value != "") {
			userInfo = []; //reset array to erase previous incorrect attempts
			userInfo.push(form.elements[0].value); //first name
			userInfo.push(form.elements[1].value); //last name
			attemptLogin(userInfo[0], userInfo[1]);
		}
	});

	$(document).keypress(function(e) {
		if(e.which == 13 && usernameInput.value != "" && passwordInput.value != "") {
			userInfo = [];
			userInfo.push(form.elements[0].value); //first name
			userInfo.push(form.elements[1].value); //last name
			attemptLogin(userInfo[0], userInfo[1]);
		}
	});

	var attemptLogin = function(username, password) {
		var info = {"username": username, "passw": password};
		var jsonInfo = JSON.stringify(info);
		$.ajax({
			url: "/checklogin",
			type: "POST",
			data: jsonInfo,
			async: false,
			contentType: "application/json",
			success: function(response) {
				if(response === "success") {
						console.log(response);
						//set username as a cookie as identifier on the server/lobby
						document.cookie = "username=" + username;
						form.submit();
					}
				else if(response === "invalid-login") {
					console.log(response);
					invalidLoginError.style.visibility = "visible";
				}

			}
		});
	};
});