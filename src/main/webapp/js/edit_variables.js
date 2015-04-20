/**
 * @ngdoc controller
 * @name EditVariablesCtrl
 *
 * @description
 * A controller used for the new_variable page, where a variable can be created and stored. 
 */
elgameAngApp.controllers.controller('EditVariablesCtrl', function ($scope, $log, oauth2Provider, HTTP_ERRORS) {
	
	/**
     * A bnvariable object used to save a variable via the API.
     * @type {{}|*}
     */
    $scope.bnvariable = $scope.bnvariable || {}; 
    
    $scope.newTier = $scope.newTier || {}; 
    
    /**
     * Tests if $scope.bnvariable is valid.
     * @param NewVariableForm the form object from the edit_variables.html page.
     * @returns {boolean|*} true if valid, false otherwise.
     */
    $scope.isValidVariable = function (NewVariableForm) {
        return !NewVariableForm.$invalid
    }; 
    $scope.isValidTier = function (NewTierForm) {
        return !NewTierForm.$invalid
    }; 
    
    // setup a new bnvariable object that can be selected to create a new variable and add to the list 
	$scope.bnvariableAsync = {selected : {
								'uniqueId' : -1, 
								'name' : "New Variable", 
								'label' : "", 
								'states' : "" }
	}; 
	$scope.bnvariablesAsync = [$scope.bnvariableAsync.selected];
	
	$scope.tiersAsync = []; 
	
	/**
     * Invokes the elgameapi.retreiveVariables API call.
     * @param 
     * @returns {|*} array of bnvariable objects. 
     */
	gapi.client.elgameapi.retrieveVariables().execute(function (resp) {
        $scope.$apply(function () {
            $scope.loading = false;
            if (resp.error) {
                // The request has failed.
                var errorMessage = resp.error.message || '';
                $scope.messages = 'Failed to retreive variables : ' + errorMessage;
                $scope.alertStatus = 'warning';
                $log.error($scope.messages + ' BNVariables : ' + JSON.stringify($scope.transaction));

                if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                    oauth2Provider.showLoginModal();
                    return;
                }
            } else {
                // The request has succeeded.
                $scope.messages = 'The variables were retreived.';
                $scope.alertStatus = 'success';
                $scope.submitted = false;
                $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                $scope.bnvariablesAsync = $scope.bnvariablesAsync.concat(resp.result.items); 
            }
            
        });
	});
	
	/**
     * Invokes the elgameapi.retreiveTiers API call.
     * @param 
     * @returns {|*} array of tier objects. 
     */
	gapi.client.elgameapi.retrieveTiers().execute(function (resp) {
        $scope.$apply(function () {
            $scope.loading = false;
            if (resp.error) {
                // The request has failed.
                var errorMessage = resp.error.message || '';
                $scope.messages = 'Failed to retreive tiers : ' + errorMessage;
                $scope.alertStatus = 'warning';
                $log.error($scope.messages + ' Tiers : ' + JSON.stringify($scope.transaction));

                if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                    oauth2Provider.showLoginModal();
                    return;
                }
            } else {
                // The request has succeeded.
                $scope.messages = 'The tiers were retreived.';
                $scope.alertStatus = 'success';
                $scope.submitted = false;
                $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                $scope.tiersAsync = resp.result.items; 
            }
            
        });
	});

    /**
     * Invokes the elgameapi.saveVariable API.
     * @param NewVariableForm the $scope.bnvariable     
     * */
    $scope.saveVariable = function (NewVariableForm) {
        if (!$scope.isValidVariable(NewVariableForm)) {
            return;
        }
        
        $scope.loading = true;
        gapi.client.elgameapi.saveVariable({
        	'uniqueId' : $scope.bnvariableAsync.selected.uniqueId || null, 
        	'name' : $scope.bnvariableAsync.selected.name, 
        	'label' : $scope.bnvariableAsync.selected.label, 
        	'states' : $scope.bnvariableAsync.selected.states, 
        	'tierLevel' : $scope.tiersAsync.selected.level 
        })
        	.execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        // The request has failed.
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to save a new variable : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages + ' Variable : ' + JSON.stringify($scope.transaction));

                        if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                            oauth2Provider.showLoginModal();
                            return;
                        }
                    } else {
                        // The request has succeeded.
                        $scope.messages = 'The variable has been saved in the datastore: ' + resp.result.name;
                        $scope.alertStatus = 'success';
                        $scope.submitted = false;
                        $scope.bnvariable = {};
                        // setup a new bnvariable object that can be selected to create a new variable and add to the list 
                    	$scope.bnvariableAsync = {selected : {
                    								'uniqueId' : -1, 
                    								'name' : "New Variable", 
                    								'label' : "", 
                    								'states' : "" }
                    	}; 
                    	$scope.bnvariablesAsync = [$scope.bnvariableAsync.selected].concat($scope.bnvariablesAsync);
                        $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                    }
                    
                });
            });
    };
    
    
    /**
     * Invokes the elgameapi.saveTier API.
     * @param NewTierForm with model object $scope.newTier      
     * */
    $scope.saveTier = function (NewTierForm) {
        if (!$scope.isValidTier(NewTierForm)) {
            return;
        }
        
        $scope.loading = true;
        gapi.client.elgameapi.saveTier({
        	'name' : $scope.newTier.name, 
        	'level' : $scope.newTier.level 
        })
        	.execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        // The request has failed.
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to save a new tier : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages + ' Tier : ' + JSON.stringify($scope.transaction));

                        if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                            oauth2Provider.showLoginModal();
                            return;
                        }
                    } else {
                        // The request has succeeded.
                        $scope.messages = 'The tier has been saved in the datastore: ' + resp.result.name;
                        $scope.alertStatus = 'success';
                        $scope.submitted = false;
                        $scope.newTier = {};
                        $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                    }
                    
                });
            });
    };
        
});

