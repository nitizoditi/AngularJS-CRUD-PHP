
function isUserAsAdmin(){
	var isUserAdmin = false;
}

function isUserAsCustomer(){
	var isUserCustomer = false;
}

function isUserAsPublicUser(){
	var isUserPublicUser = false;
}

function checkUserLogin(){
	var isUserLogin = false;
	
	console.log("js:checkUserLogin()");
	var formTarget = "controller/user-login.php";

	var request = $.ajax({
	  method: "POST",
	  url: formTarget,
	  data: { },
	  dataType: "json"
	})

	request
	  .done(function( data ) {
	  	//console.dir(data);
	    if(data['num_rows']=="1" || data['num_rows'] == 1){
			isUserLogin = true;
	    }
	    else{
	    }
		
		showNHideControl(isUserLogin);
	  
	  
	  });
	  return isUserLogin;
}

function getLoginInfo(){}

function showNHideControl(isUserLogin){
	console.log("showHideControl: "+isUserLogin)
		  if(isUserLogin){
			  $(".loginButton").hide();
			  $(".requireLogin").show();
		  }
		  else{
			  $(".loginButton").show();
			  $(".requireLogin").hide();
		  }
}

function redirectToHomePage(){
	//var isLogin = false;
	
	//isLogin = checkUserLogin();
	
	
	//if(isLogin){
	//    	window.location.replace('main-menu.html');
	//}else{
	//    	window.location.replace('index.html');
	//}
	
	window.location.replace('index.html');
}
function redirectToLoginPage(){
	//var isLogin = false;
	
	//isLogin = checkUserLogin();
	
	
	//if(isLogin){
	//    	window.location.replace('login.html');
	//}else{
	//    	window.location.replace('index.html');
	//}
	window.location.replace('login.html');
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

$(function() {
	var nickName = getCookie("nickName");
	$(".user_nickName").text(nickName);
});
