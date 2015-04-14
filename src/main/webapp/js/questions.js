/**
 * @ngdoc controller
 * @name ShowQuestionsCtrl
 *
 * @description
 * A controller used for the Questions page.
 */
elgameAngApp.controllers.controller('ShowQuestionsCtrl', function (
		$scope, 
		$log, 
		oauth2Provider, 
		HTTP_ERRORS) 
{
 
	$scope.oneAtATime = true;
	
	$scope.status = {
		    isFirstOpen: false,
		    isFirstDisabled: true
		};
	
	$scope.radioModel = null;
	
	$scope.bnvariablesAsync = [];
	$scope.answersAsync = [];
	
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
	
	gapi.client.elgameapi.retrieveAnswers().execute(function (resp) {
        $scope.$apply(function () {
            $scope.loading = false;
            if (resp.error) {
                // The request has failed.
                var errorMessage = resp.error.message || '';
                $scope.messages = 'Failed to retreive answers : ' + errorMessage;
                $scope.alertStatus = 'warning';
                $log.error($scope.messages + ' Answers : ' + JSON.stringify($scope.transaction));

                if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                    oauth2Provider.showLoginModal();
                    return;
                }
            } else {
                // The request has succeeded.
                $scope.messages = 'The answers were retreived.';
                $scope.alertStatus = 'success';
                $scope.submitted = false;
                $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                $scope.answersAsync = $scope.answersAsync.concat(resp.result.items); 
            }
            
        });
	});

});
