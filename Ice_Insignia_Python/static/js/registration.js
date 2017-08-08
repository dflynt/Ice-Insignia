$(document).ready(function() {
	var firstNameLblError = document.getElementById("FName_Error");
	var lastNameLblError = document.getElementById("LName_Error");
	var userLblError = document.getElementById("UName_Error");
	var emailLblError = document.getElementById("Email_Error");
	var fName_input = document.getElementById(String(0));
	var lName_input = document.getElementById(String(1));
	var pass_input = document.getElementById(String(3));
	var username_input = document.getElementById(String(2));
	var email_input = document.getElementById(String(4));
	
	$("#submitForm").on("click", function() {
		var form = document.getElementById("regisForm");
		var userInfo = [];
		userInfo.push(form.elements[0].value); //first name
		userInfo.push(form.elements[1].value); //last name
		userInfo.push(form.elements[2].value); //username
		userInfo.push(form.elements[3].value); //password
		userInfo.push(form.elements[4].value); //email
	
		var checkName = /^([a-zA-z]*)$/; //no digit, nonalphanumeric, or whitespace char
		var checkUsername = /^[a-zA-z0-9]*$/; //only alphanumeric
		var checkEmail = /^(([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+)?$/;

		var fName_Check = false;
		var lName_Check = false;
		var user_Check = false;
		var email_Check = false;


		//Check first name
		if(checkName.test(userInfo[0])) {
			//if previous input was invalid, reset CSS values to correct input
			fName_input.style.borderColor = "DeepSkyBlue"; 
			firstNameLblError.style.visibility = "hidden";
			fName_Check = true;			
		}
		else {
			fName_input.style.borderColor = "red";
			firstNameLblError.style.visibility = "visible";
			fName_Check = false;	
		}

		//Check last name
		if(checkName.test(userInfo[1])) {
			lName_input.style.borderColor = "DeepSkyBlue";
			lastNameLblError.style.visibility = "hidden";
			lName_Check = true;
		}
		else{
			lName_input.style.borderColor = "red";
			lastNameLblError.style.visibility = "visible";
			lName_Check = false;
		}

		//check username
		if(checkUsername.test(userInfo[2])) {
			user_Check = true;
			username_input.style.borderColor = "DeepSkyBlue";
			userLblError.style.visibility = "hidden";			
		}
		else {
			username_input.style.borderColor = "red";
			userLblError.style.visibility = "visible";
			userLblError.innerHTML = "No special characters or numbers";
			user_Check = false;
		}

		//not checking password

		//check email
		if(checkEmail.test(userInfo[4])) {
		 	email_Check= true;
			email_input.style.borderColor = "DeepSkyBlue";
			emailLblError.style.visibility = "hidden";		 		
		}
		else {
			email_input.style.borderColor = "red";
			emailLblError.style.visibility = "visible";
			emailLblError.innerHTML = "Invalid email";
			email_Check = false;
		}

		//if everything passes, hide labels and send
		//information to createAccount()
		if(fName_Check && lName_Check && user_Check && email_Check) {
				//fail-safe to ensure no buggy labels when input is valid
			firstNameLblError.style.visibility = "hidden";
			lastNameLblError.style.visibility = "hidden";
			userLblError.style.visibility = "hidden";
			emailLblError.style.visibility = "hidden";

				//send account info to method with ajax call
			createAccount(userInfo[0].trim(), userInfo[1].trim(), userInfo[2].trim(),
						  userInfo[3].trim(), userInfo[4].trim());
		}
		else {
			return false; //cancels submission
		}
	});

	var createAccount = function(fname, lname, username, password, email) {
		var info = {"first_name":fname, "last_name":lname, "username":username,
					   "passw":password, "email":email};
		var	jsonInfo = JSON.stringify(info);
		$.ajax({
			url: "/register",
			type: "POST",
			data: jsonInfo,
			async: false,
			contentType: "application/json;",
			success: function(response) {
				if(response === "duplicate-username") {
					//changes border of field just related to username
					//reveals label related to username
					console.log(response);
					userLblError.innerHTML = "Username already taken.";
					userLblError.style.visibility = "visible";
					username_input.style.borderColor = "red"; 
				}
				if(response === "duplicate-email") {
					//changes border of field just related to email
					//reveals label related to email
					console.log(response);
					emailLblError.innerHTML = "This email has already been registered.";
					emailLblError.style.visibility = "visible";				
					email_input.style.borderColor = "red";
				}
				if(response === "duplicate-username_email"){
					//changes border of both username and email
					//reveals label related to both username and email					
					console.log(response);					
					userLblError.innerHTML = "Username already taken.";
					userLblError.style.visibility = "visible";
					username_input.style.borderColor = "red"; 

					emailLblError.innerHTML = "This email has already been registered.";
					emailLblError.style.visibility = "visible";				
					email_input.style.borderColor = "red";
				}
				if(response === "success"){
					console.log(response);
					//clear all labels and input forms
					$('label').each(function(){
 						$(this).css('visibility',"hidden");
					});

					$("form#regisForm :input").each(function(){
 						$(this).css('borderColor', "DeepSkyBlue");
						$(this).val("");
					});

				}
			}
			error: function(response) {
				console.log(response);
			}
		});
	}
});