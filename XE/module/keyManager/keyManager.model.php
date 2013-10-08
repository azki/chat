<?php
    class keyManagerModel extends keyManager {

        function init() {
        }
		//chat 정보 가져오기
        function getTargetKeyInfo($domain, $user_id) {
			$args = new stdClass();
			$args->domain = $domain;
			$args->user_id = $user_id;
            $output = executeQuery('keyManager.getTargetKeyInfo', $args);
			return $output->data;
		}
		
    }
?>
