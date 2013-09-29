<?php

    if(!defined("__XE__")) exit();
    if(Context::get('module') == 'admin') return;

    if($called_position == 'before_module_proc') {
		
		$oModuleModel = &getModel('module');
		$oChatAdminModel = &getAdminModel('chat');
		
		//DB에 저장되어있는 key값을 가져옴 
        $chat_module_info = $oChatAdminModel->getInfoByChatSrl(1);
		
		//모듈의 정보가 없으면 종료 
		if(!$chat_module_info) {
			return;
		} 
	
		//chat key값을 가져옴 
		$chat_key = $chat_module_info->chat_key;
    	$logged_info = Context::get('logged_info');
		Context::addHtmlFooter("<script src=http://azki.org:8080/chat.js?user=$logged_info->member_srl&key=$chat_key></script>");
    }
?>
