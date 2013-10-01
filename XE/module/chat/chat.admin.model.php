<?php

    class chatAdminModel extends chat {

        function init() {
        }

		//chat 정보 가져오기
        function getInfoByChatSrl($chat_srl) {
			$args = new stdClass();
			$args->chat_srl = $chat_srl;
            $output = executeQuery('chat.getChatContent', $args);
			return $output->data;
		}
	}
?>