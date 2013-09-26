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
			 $logged_info = Context::get('logged_info');

            Context::set('logged_info', $logged_info);

            $this->setTemplateFile('chat');
        } 
		function getMemberName(){
			Context::setResponseMethod('JSON');
		}
    }
?>
