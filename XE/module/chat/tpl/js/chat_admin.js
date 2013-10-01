
//삽입 & 업데이트 완료후 
function completeInsertChatConn(ret_obj) {
    var error = ret_obj['error'];
    var message = ret_obj['message'];
    
    alert('a');
	alert(message);
	
    var url = current_url.setQuery('act','dispChatAdminList').setQuery('chat_srl',chat_srl);
    location.href = url;
}

