/**
 * @ngdoc controller
 * @name ViewAnswersCtrl
 *
 * @description
 * A controller used for the ViewAnswers page.
 */
elgameAngApp.controllers.controller('ViewAnswersCtrl', function ($scope, $log, oauth2Provider, HTTP_ERRORS) {

        /**
         * The array holding answers that were downloaded.
         * @type {{}|*}
         */
        $scope.answerFrequenciesAsync = $scope.answerFrequenciesAsync || []; 

        /**
         * Invokes the elgameAngApp.retrieveAnswerFequencies API.
         *
         * @param transactionForm the fscope.transaction     
         * */ 
    	$scope.loading = true;
    	gapi.client.elgameapi.retrieveAnswerFrequencies().execute(function (resp) {
    		$scope.$apply(function () {
    			$scope.loading = false;
                if (resp.error) {
                    // The request has failed.
                    var errorMessage = resp.error.message || '';
                    $scope.messages = 'Failed to retreive answer frequencies : ' + errorMessage;
                    $scope.alertStatus = 'warning';
                    $log.error($scope.messages + ' Answer Frequencies : ' + JSON.stringify($scope.transaction));

                    if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                        oauth2Provider.showLoginModal();
                        return;
                    }
                } else {
                    // The request has succeeded.
                    $scope.messages = resp.items.length + ' answerFrequency rows  were retreived.';
                    $scope.alertStatus = 'success';
                    $scope.submitted = false;
                    $scope.transaction = {};
                    $log.info($scope.messages + ' : ' + JSON.stringify(resp.result));
                    
                    $scope.answerFrequenciesAsync = resp.items; 
                }
            });
    	});
        
});