<?php

    class keyManager extends ModuleObject {

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
			$okeyManagerAdminController = &getAdminController('keyManager');

			if(!$oModuleModel->isIDExists($this->module)) $okeyManagerAdminController->keyManagerModuleRegister();

            return new Object(0, 'success_updated');
        }

        function recompileCache() {
        }

    }
?>