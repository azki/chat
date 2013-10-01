<?php
    class chatView extends chat {

        function init() {
            $template_path = sprintf("%sskins/%s/",$this->module_path, $this->module_info->skin);
            if(!is_dir($template_path)||!$this->module_info->skin) {
                $this->module_info->skin = 'default';
                $template_path = sprintf("%sskins/%s/",$this->module_path, $this->module_info->skin);
            }
            $this->setTemplatePath($template_path);
        }
		
		function chat() {
			
			$oChatAdminModel = &getAdminModel('chat');
			
			//DB에 저장되어있는 key값을 가져옴 
	        $chat_module_info = $oChatAdminModel->getInfoByChatSrl(1);
			
			//모듈의 정보가 없으면 종료 
			if(!$chat_module_info) {
				return;
			} 
		
			//chat key값을 가져옴 
			$chat_key = $chat_module_info->chat_key;
			
			//로그인 정보가져옴 
			$logged_info = Context::get('logged_info');

			//정보 setting
            Context::set('logged_info', $logged_info);
			Context::set('chat_key', $chat_key);

            $this->setTemplateFile('chat');
        } 
		
		//회원 nick_name 가져오기 
		function getMemberName(){
			Context::setResponseMethod('JSON');
		}
    }
?>
