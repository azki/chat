<?php

    class chat extends ModuleObject {

        function moduleInstall() {

            return new Object();
        }

        function checkUpdate() {
			$oDB = &DB::getInstance();
			$oModuleModel = &getModel('module');

			if(!$oModuleModel->isIDExists($this->module)) return true;

            return false;
        }

        function moduleUpdate() {
			$oDB = &DB::getInstance();
			$oModuleModel = &getModel('module');
			$oChatAdminController = &getAdminController('chat');

			if(!$oModuleModel->isIDExists($this->module)) $oChatAdminController->chatModuleRegister();

            return new Object(0, 'success_updated');
        }

        function recompileCache() {
        }

    }
?>