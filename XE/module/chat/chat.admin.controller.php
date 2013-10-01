<?php
    class chatAdminController extends chat {

        function init() {
        }

        function procChatAdminInsert() {

			//요청 정보 다가져오기 
            $args = Context::getRequestVars();

			//chat model 정보가져오기 
            $oChatAdminModel = &getAdminModel('chat');
			
			if($args->chat_srl) {
                $chat_info = $oChatAdminModel->getInfoByChatSrl($args->chat_srl);
                if($chat_info->chat_srl != $args->chat_srl) unset($args->chat_srl);
            }
			
			//해당 모듈이 없으면 삽입.
            if(!$args->chat_srl) {
				$args->chat_srl = 1;
				$output = executeQuery('chat.insertChat', $args);
                $msg_code = 'success_registed';

				$output->add('chat_srl', $args->chat_srl);

			//있으면 update
			} else {

                $output = executeQuery('chat.updateChat', $args);
                $msg_code = 'success_updated';

                $cache_file = sprintf("./files/cache/chat/%d.cache.php", $chat_info->chat_srl);
                if(file_exists($cache_file)) FileHandler::removeFile($cache_file);
            }

            if(!$output->toBool()) return $output;
 
            $this->setMessage($msg_code);
        }

		function chatModuleRegister() {
			
			$oModuleController = &getController('module');
			$oModuleModel = &getModel('module');

			$ouput = $oModuleModel->isIDExists($this->module);

			if(!$output) {

				$site_module_info = Context::get('site_module_info');
				$args->site_srl = $site_module_info->site_srl;
				$args->mid = $this->module;
				$args->module = $this->module;
				$args->browser_title = $this->module;
				
				$output = $oModuleController->insertModule($args);

				$module_srl = $output->get('module_srl');
				Context::set('target_module_srl', $module_srl);
				Context::set('editor_height', '200');
				Context::set('enable_autosave', 'N');

				$oEditorController = &getController('editor');
				$oEditorController->procEditorInsertModuleConfig();
			}
		}
	}
?>