<?php
    class keyManagerAdminController extends keyManager {

        function init() {}

		function keyManagerModuleRegister() {
			
			$oModuleController = &getController('module');
			$oModuleModel = &getModel('module');

			$ouput = $oModuleModel->isIDExists($this->module);

			if(!$output) {
				$args->mid = $this->module;
				$args->module = $this->module;
				$args->browser_title = $this->module;
				$output = $oModuleController->insertModule($args);
			}
		}
	}
?>