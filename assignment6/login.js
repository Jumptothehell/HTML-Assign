window.onload = loginLoad;
function loginLoad(){
	var form = document.getElementById("myLogin");
    form.onsubmit = checkLogin;
}

function checkLogin(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const form_username = urlParams.get('username');
	const form_password = urlParams.get('password');

	var username = document.forms["myLogin"]["username"];
	var password = document.forms["myLogin"]["password"];

	if(username.value === form_username && password.value === form_password){
		alert("Log in!")
	}else{
		alert("Username or Password is wrong. Please try again.")
		return false
	}
	//ถ้าตรวจสอบแล้วพบว่ามีการ login ไม่ถูกต้อง ให้ return false ด้วย
}

			