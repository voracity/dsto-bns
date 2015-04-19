'use strict'; // so that using undeclared variables will cause an error 

/**
 * The root elgameAngApp module.
 *
 * @type {elgameAngApp|*|{}}
 */
var elgameAngApp = elgameAngApp || {};

/**
 * @ngdoc module
 * @name elgameControllers
 *
 * @description
 * Angular module for controllers.
 *
 */
elgameAngApp.controllers = angular.module('elgameControllers', ['ui.bootstrap', 'ngSanitize', 'ui.select', 'smart-table']);

/**
 * @ngdoc controller
 * @name RootCtrl
 *
 * @description
 * The root controller having a scope of the body element and methods used in the application wide
 * such as user authentications.
 *
 */
elgameAngApp.controllers.controller('RootCtrl', function ($scope, $location, oauth2Provider) {

	$scope.is_backend_ready = true;
	
    /**
     * Returns if the viewLocation is the currently viewed page.
     *
     * @param viewLocation
     * @returns {boolean} true if viewLocation is the currently viewed page. Returns false otherwise.
     */
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
    
    /**
     * Returns the OAuth2 signedIn state.
     *
     * @returns {oauth2Provider.signedIn|*} true if signedIn, false otherwise.
     */
    $scope.getSignedInState = function () {
        return oauth2Provider.signedIn;
    };

    /**
     * Calls the OAuth2 authentication method.
     */
    $scope.signIn = function () {
        oauth2Provider.signIn(function () {
            gapi.client.oauth2.userinfo.get().execute(function (resp) {
                $scope.$apply(function () {
                    if (resp.email) {
                        oauth2Provider.signedIn = true;
                        sessionStorage.setItem("signedIn", true);
                        $scope.alertStatus = 'success';
                        $scope.rootMessages = 'Logged in with ' + resp.email;
                    }
                });
            });
        });
    };

    /**
     * Render the signInButton and restore the credential if it's stored in the cookie.
     * (Just calling this to restore the credential from the stored cookie, the button is hidden). 
     */
    $scope.initSignInButton = function () {
        gapi.signin.render('signInButton', {
            'callback': function () {
                if (gapi.auth.getToken() && gapi.auth.getToken().access_token) {
                    $scope.$apply(function () {
                        oauth2Provider.signedIn = true;
                    });
                }
            },
            'clientid': oauth2Provider.CLIENT_ID,
            'cookiepolicy': 'single_host_origin',
            'scope': oauth2Provider.SCOPES
        });
    };

    /**
     * Logs out the user.
     */
    $scope.signOut = function () {
        oauth2Provider.signOut();
        $scope.alertStatus = 'success';
        $scope.rootMessages = 'Logged out';
    };

    /**
     * Collapses the navbar on mobile devices.
     */
    $scope.collapseNavbar = function () {
        angular.element(document.querySelector('.navbar-collapse')).removeClass('in');
    };

});

/**
 * @ngdoc controller
 * @name OAuth2LoginModalCtrl
 *
 * @description
 * The controller for the modal dialog that is shown when an user needs to login to achieve some functions.
 *
 */
elgameAngApp.controllers.controller('OAuth2LoginModalCtrl',
    function ($scope, $modalInstance, $rootScope, oauth2Provider) {
        $scope.signInViaModal = function () {
            oauth2Provider.signIn(function () {
                gapi.client.oauth2.userinfo.get().execute(function (resp) {
                    $scope.$root.$apply(function () {
                        oauth2Provider.signedIn = true;
                        sessionStorage.setItem("signedIn", true);
                        $scope.$root.alertStatus = 'success';
                        $scope.$root.rootMessages = 'Logged in with ' + resp.email;
                    });

                    $modalInstance.close();
                });
            });
        };
    });


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
    
    /**
     * Tests if $scope.bnvariable is valid.
     * @param NewVariableForm the form object from the edit_variables.html page.
     * @returns {boolean|*} true if valid, false otherwise.
     */
    $scope.isValidVariable = function (NewVariableForm) {
        return !NewVariableForm.$invalid
    }; 
    
    // setup a new bnvariable object that can be selected to create a new variable and add to the list 
	$scope.bnvariableAsync = {selected : {
								'uniqueId' : -1, 
								'name' : "New Variable", 
								'label' : "", 
								'states' : "" }
	}; 
	$scope.bnvariablesAsync = [$scope.bnvariableAsync.selected];
	
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
        	'states' : $scope.bnvariableAsync.selected.states 
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
        
});

/**
 * This filter is required for ui-select to work, their comments were: 
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */
elgameAngApp.controllers.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  }
});

