<?php
    class keyManagerController extends keyManager {

        function init() {
        }
		
		function procKeyManagerInsert () {
			 // request 값을 모두 받음
            $obj = Context::getRequestVars();
			$logged_info = Context::get('logged_info');
			
			// 현재 모듈번호 확인
			$obj->module_srl = Context::get('module_srl');
			$args->user_id = $logged_info->user_id;
			
			//keyManager model 정보가져오기 
             $okeyManagerModel = &getModel('keyManager');
			 if($args->domain) {
			 	$
                 $keyManager_info = $okeyManagerModel->getTargetKeyInfo($args->domain, $args->user_id);
                 if($keyManager_info->domain != $args->domain) {
                 	// 존재하지 않는 도메인 
	             	
					$args->user_id = $logged_info->user_id;
					$args->keyManager_key = md5($args->domain);
					$args->keyManager_srl = getNextSequence();
					$output = executeQuery('keyManager.insertKey', $args);
					$this->setMessage('success_registed');
                 } else {
                 	// 이미존재하는 도메인 키 
                 }
             }
		}
    }
?>


