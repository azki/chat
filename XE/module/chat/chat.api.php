<?php
    class chatAPI extends chat {

        function getMemberName(&$oModule) {
            //Context::get(key) - 해당 key의 값을 가져옴 ;
            //Context::set(key, value) - mapping;
            //unset($member_info->password) - member_info에 있는 password 프로퍼티 삭제;

			Context::setRequestMethod('JSON');
			$member_srl = Context::get('user');
			
			$oMemberModel = &getModel('member');
			$member_info = $oMemberModel->getMemberInfoByMemberSrl($member_srl);
			
			//nick_name : 정보 출력 
			$oModule->add('name',$member_info->nick_name); 
        }
		
		
    }
?>