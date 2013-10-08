<?php
    class keyManagerView extends keyManager {

        function init() {
             // module_srl이 있으면 미리 체크하여 존재하는 모듈이면 module_info 세팅
            $module_srl = Context::get('module_srl');
            if(!$module_srl && $this->module_srl) {
                $module_srl = $this->module_srl;
                Context::set('module_srl', $module_srl);
            }

            // module model 객체 생성 
            $oModuleModel = &getModel('module');

            // module_srl이 넘어오면 해당 모듈의 정보를 미리 구해 놓음
			// 모듈의 브라우저 타이틀, 관리자, 레이아웃 등 xe_modules table의 값과 정보
            if($module_srl) {
                $module_info = $oModuleModel->getModuleInfoByModuleSrl($module_srl);
				$this->module_info = $module_info;
				Context::set('module_info',$module_info);
            }

            // 스킨 경로를 미리 template_path 라는 변수로 설정함
            // 스킨이 존재하지 않는다면 default로 변경
            $template_path = sprintf("%sskins/%s/",$this->module_path, $this->module_info->skin);
            if(!is_dir($template_path)||!$this->module_info->skin) {
                $this->module_info->skin = 'default';
                $template_path = sprintf("%sskins/%s/",$this->module_path, $this->module_info->skin);
            }
			
			
            $this->setTemplatePath($template_path);
			
        }
		
		function dispKeyManagerContentList() {
			
			// 보기 권한 체크
            //if(!$this->grant->view) return $this->dispBookMessage('msg_not_permitted');
			
			
			// 내용 작성시 검증을 위해 사용되는 XmlJSFilter  
            Context::addJsFilter($this->module_path.'tpl/filter', 'insert_key.xml');
			// 콜백 함수를 처리하는 javascript 
            Context::addJsFile($this->module_path.'tpl/js/keyManager.js');
			
            $this->setTemplateFile('keyList');
        } 
    }
?>
