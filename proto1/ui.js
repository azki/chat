/*jslint regexp:false,nomen:false*/
/*global io4chat*/
(function() {
	var socket, dockDiv, dockBtnDiv, wrapDiv, chatDiv, chatInput;
	socket = io4chat.connect("http://azki.org:8080/chat");

	if (document.body) {
		var uiHtml = [
				'<style type="text/css">',
				'.workspace-chat{position:absolute;width:240px;height:24px;z-index:10000;bottom:0;right:0;-webkit-transition:height .2s ease-in;-moz-transition:height .2s ease-in;transition:height .2s ease-in;}',
				'.workspace-chat.active{height:320px}',
				'.workspace-chat .dock{font-size:14px;font-weight:600;color:#fff;height:24px;line-height:24px;text-indent:5px;border-radius:3px 0 0 0;background:-webkit-gradient(linear, left top, left bottom, color-stop(0, #ffa615), color-stop(0.847, #c56121));background:-webkit-linear-gradient(top, #ffa615 0%, #c56121 84.7%);background:-moz-linear-gradient(top, #ffa615 0%, #c56121 84.7%);background:-o-linear-gradient(top, #ffa615 0%, #c56121 84.7%);background:-ms-linear-gradient(top, #ffa615 0%, #c56121 84.7%);background:linear-gradient(top, #ffa615 0%, #c56121 84.7%);cursor:pointer;text-shadow:1px 0 1px rgba(0,0,0,0.3)}',
				'.workspace-chat .toggle{font-size:18px;right:9px;top:0;width:16px;position:absolute;}',
				'.workspace-chat .toggle.active{top:-2px;right:5px;}',
				'.workspace-chat .toggle.active:before{content:"-"}',
				'.workspace-chat .toggle:before{content:"+"}',
				'.workspace-chat .wrapper{height:296px;background:#fff;}',
				'.workspace-chat .wrapper.active{display:block}',
				'.workspace-chat .messages{height:257px;margin:5px;overflow-y:auto;width:auto}',
				'.workspace-chat .kdinput{margin:5px;width:230px}',
				'.workspace-chat .chat-item{height:auto;margin-bottom:3px;}',
				'.workspace-chat .chat-item .avatarview{float:left;margin-right:6px}',
				'.workspace-chat .chat-item .username{font-weight:600;margin-bottom:3px}',
				'.workspace-chat .chat-item .items-container{width:190px;font-size:12px}',
				'input.kdinput.text,textarea.kdinput.text{display:block;border:1px solid #d7d7d7;outline:none;height:24px;line-height:20px;padding:2px 4px;background-color:#fff;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;-webkit-box-shadow:0 1px 0 #fff;-moz-box-shadow:0 1px 0 #fff;box-shadow:0 1px 0 #fff;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;}',
				'input.kdinput.text:hover,textarea.kdinput.text:hover{border:1px solid #aaa}',
				'input.kdinput.text:focus,textarea.kdinput.text:focus{border:1px solid #7dbef1;-webkit-box-shadow:0 0 3px rgba(125,190,241,0.7);-moz-box-shadow:0 0 3px rgba(125,190,241,0.7);box-shadow:0 0 3px rgba(125,190,241,0.7)}',
				'.kdinput.hitenterview{resize:none;overflow:hidden;background-image:url("../images/kd.hitenterview.inactive.png");background-color:transparent;background-repeat:no-repeat;background-position:right bottom;}',
				'.kdinput.hitenterview.active{background-image:url("../images/kd.hitenterview.active.png")}',
				'</style>',
				'<div class="dock">Chat<div class="toggle"></div></div>',
				'<div class="wrapper">',
				'<div class="messages">',
				'</div>',
				'<input type="text" class="text hitenterview" placeholder=""/>',
				'</div>', ].join("\n");
		wrapDiv = document.createElement('div');
		wrapDiv.className = "workspace-chat";
		wrapDiv.innerHTML = uiHtml;
		dockDiv = wrapDiv.getElementsByTagName("div")[0];
		dockBtnDiv = wrapDiv.getElementsByTagName("div")[1];
		chatDiv = wrapDiv.getElementsByTagName("div")[3];
		chatInput = wrapDiv.getElementsByTagName("input")[0];

		var isShowing = false;
		dockDiv.onclick = function() {
			isShowing = !isShowing;
			if (isShowing) {
				wrapDiv.className = "workspace-chat active";
				dockBtnDiv.className = "toggle active";
			} else {
				wrapDiv.className = "workspace-chat";
				dockBtnDiv.className = "toggle";
			}
		};
		chatInput.onkeydown = function(event) {
			if (event.keyCode === 13) {
				socket.emit("msg", {
					text : chatInput.value
				});
				chatInput.value = "";
				return false;
			}
		};
		document.body.appendChild(wrapDiv);
	} else {
		alert("insert in body tag plz..");
	}
	socket.on("connect", function() {
		// console.log("connect");
		});
	socket.on("disconnect", function() {
		// console.log("disconnect");
		});
	socket.on("join", function(data) {
		var msgP = document.createElement("p");
		msgP.style.color = "blue";
		msgP.innerHTML = "join : " + data.writer;
		chatDiv.appendChild(msgP);
		chatDiv.scrollTop = chatDiv.clientHeight;
	});
	socket.on("leave", function(data) {
		var msgP = document.createElement("p");
		msgP.style.color = "red";
		msgP.innerHTML = "leave : " + data.writer;
		chatDiv.appendChild(msgP);
		chatDiv.scrollTop = chatDiv.clientHeight;
	});

	var chatHtml = [
			'<a class="avatarview" href="#" style="width: 30px; height: 30px; background-image: url(https://www.koding.com/images/defaultavatar/default.avatar.30.png);"><cite></cite></a>',
			'<div class="username"></div>', '<div class="items-container">',
			'<div></div>', '</div>' ].join("\n");
	socket.on("msg", function(data) {
		var msgDiv = document.createElement("div");
		msgDiv.className = "chat-item";
		msgDiv.innerHTML = chatHtml;
		var writerDiv = msgDiv.getElementsByTagName("div")[0];
		writerDiv.innerHTML = data.writer;
		var contentsDiv = msgDiv.getElementsByTagName("div")[2];
		contentsDiv.innerHTML = data.text.replace(/</g, "&lt;");
		chatDiv.appendChild(msgDiv);
		chatDiv.scrollTop = chatDiv.scrollHeight;
	});
}());