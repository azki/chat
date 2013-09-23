/*jslint regexp:false,nomen:false*/
/*global io4chat*/
(function () {
	var socket, wrapDiv, chatDiv, chatInput;
	socket = io4chat.connect("http://azki.org:12345/chat");
	if (document.body) {
		wrapDiv = document.createElement('div');
		chatDiv = document.createElement('div');
		chatInput = document.createElement('input');
		
		chatDiv.style.background = "#eef";
		chatDiv.style.width = "360px";
		chatDiv.style.height = "360px";
		chatDiv.style.overflow = "scroll";
		
		chatInput.style.background = "#fee";
		chatInput.style.width = "320px";
		chatInput.onkeydown = function (event) {
			if (event.keyCode === 13) {
				socket.emit("msg", {
					text: chatInput.value
				});
				chatInput.value = "";			
				return false;
			}
		};
		wrapDiv.appendChild(chatDiv);
		wrapDiv.appendChild(chatInput);
		document.body.appendChild(wrapDiv);
	} else {
		//TODO
		alert("TODO");
	}
	socket.on("connect", function () {
		//console.log("connect");
	});
	socket.on("disconnect", function () {
		//console.log("disconnect");
	});
	socket.on("join", function (data) {
		var msgP = document.createElement("p");
		msgP.style.color = "blue";
		msgP.innerHTML = "join : " + data.writer;
		chatDiv.appendChild(msgP);
	});
	socket.on("leave", function (data) {
		var msgP = document.createElement("p");
		msgP.style.color = "red";
		msgP.innerHTML = "leave : " + data.writer;
		chatDiv.appendChild(msgP);
	});
	socket.on("msg", function (data) {
		var msgP = document.createElement("p");
		msgP.innerHTML = data.writer + " : " + data.text.replace(/</g, "&lt;");
		chatDiv.appendChild(msgP);
	});
}());