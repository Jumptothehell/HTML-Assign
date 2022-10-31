window.onload = pageLoad;
var username= "";
var timer = null;
var d =  new Date();


function pageLoad(){
	var x = document.getElementById("submitmsg");
	x.onclick = sendMsg;
	var x = document.getElementById("clickok")
	x.onclick = setUsername;
}

function setUsername(){
	var x = document.getElementById("userInput");
	 username = x.value;
	var x = document.getElementById("username");
	x.innerHTML = username;
	timer = setInterval (loadLog, 3000);//Reload file every 3000 ms
	document.getElementById("submitmsg").disabled = false;
	document.getElementById("clickok").disabled = true;
	readLog();
}

function loadLog(){
	readLog();
}

function sendMsg(){
	//get msg
	var msg_text = document.getElementById("userMsg").value;
	document.getElementById("userMsg").value = "";
	writeLog(msg_text);
}

//ทำให้สมบูรณ์
const writeLog = (async (msg_text) => {
	let wr_ = await fetch("/", {
		method: "POST",
		headers: {
			'Accept': 'application/sjson',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			time: d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
			user:username,
			message:msg_text
		})
	});
	let content = await wr_.json();
	console.log(content);
});

//ทำให้สมบูรณ์
const readLog = (async () => {
	let read_ = await fetch("/", {
		method: "POST",
		headers: {
			'Accept': 'application/sjson',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			time: d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
			user:username,
			message:msg
		})
	});
	let readcontent = await read_.json();
	console.log(readcontent);
});

// รับ msg ที่เป็น JS object ที่อ่านมาได้จาก file
function postMsg(msg){
	var x = document.getElementById("chatbox");
	while(x.firstChild){
		x.removeChild(x.lastChild);
	}
	for(var item of msg.dataMsg){
		var div_d = document.createElement("div");
		div_d.className = "message";
		var timemsg = document.createTextNode("("+ item.time+") ");
		var boldmsg = document.createElement("b");
		boldmsg.innerHTML = item.user;
		var textmsg = document.createTextNode(": "+item.message);
		
		div_d.append(timemsg,boldmsg,textmsg);
		div_d.appendChild(document.createElement("br"));
		x.appendChild(div_d);
	}
	checkScroll();
}


function checkScroll(){
	var chatbox = document.getElementById('chatbox');
	var scroll = chatbox.scrollTop+chatbox.clientHeight === chatbox.scrollHeight;
	if (!scroll) {
    	chatbox.scrollTop = chatbox.scrollHeight;
  	}
}
