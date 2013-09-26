<?php
    class chatAPI extends chat {


        function getMemberName(&$oModule) {
            //Context::get(key) - 해당 key의 값을 가져옴 ;
            //Context::set(key, value) - mapping;
            //unset($member_info->password) - member_info에 있는 password 프로퍼티 삭제;

            //$oMemberModel = &getModel('member'); //member의 모듈가져옴 
            //$member_info = $oMemberModel->getMemberInfoByMemberSrl(4); //member의 getMemberInfoByMemberSrl의 함수(쿼리) 호출 

            //Context::set('member_info', $member_info);

            //$this->setTemplateFile('getMemberName');
			Context::setRequestMethod('JSON');
			$member_srl = Context::get('user');
			
			$oMemberModel = &getModel('member');
			$member_info = $oMemberModel->getMemberInfoByMemberSrl(4);
			$oModule->add('name',$member_info->user_name); 
        }
		
		
    }
?>