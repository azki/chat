<?php
class chatAdminView extends chat {

	function init() {
		// 관리자 템플릿 파일의 경로 설정 (tpl)
		$template_path = sprintf("%stpl/", $this -> module_path);
		$this -> setTemplatePath($template_path);
	}

	function dispChatAdminList() {
		$oChatAdminModel = &getAdminModel('chat');

		// chat 설정 load; 
		$chat_info = $oChatAdminModel -> getInfoByChatSrl($chat_srl);
		Context::set('chat_info', $chat_info);

		$this -> setTemplateFile('index');
	}

}
?>