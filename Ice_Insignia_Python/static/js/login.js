$(document).ready(function() {
	var form = document.getElementById("loginForm");
	var username_input = document.getElementById(String(0));
	var password_input = document.getElementById(String(0));	
	var invalidLoginError = document.getElementById("invalidlogin");
	var passLblError = document.getElementById("invalidpass");
	var userInfo = [];
	
	$("#submitLoginForm").on("click", function(e) {
		e.preventDefault();
		userInfo.push(form.elements[0].value); //first name
		userInfo.push(form.elements[1].value); //last name
		attemptLogin(userInfo[0], userInfo[1]);
	});

	$(document).keypress(function(e) {
		if(e.which == 13 && userInfo[0] != null && userInfo[1] != null) {
			e.preventDefault();
			var userInfo = [];
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
						form.submit();
					}
					/*
					console.log(response);
					$('label').each(function(){
 						$(this).css('visibility',"hidden");
					});

					$("form#loginForm :input").each(function(){
 						$(this).css('borderColor', "DeepSkyBlue");
						$(this).val("");
					});
					*/
				else if(response === "invalid-login") {
					console.log(response);
					invalidLoginError.style.visibility = "visible";
				}

			}
		});
	};
});