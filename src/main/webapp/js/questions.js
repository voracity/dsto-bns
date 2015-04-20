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
		$filter, 
		oauth2Provider, 
		HTTP_ERRORS) 
{
 
	$scope.oneAtATime = true;
	
	$scope.status = {
		    isFirstOpen: false,
		    isFirstDisabled: true
		};
	
	$scope.bnvariablesAsync = [];
	$scope.answersAsync = [];
	
	$scope.getTotalQuestions = function (causeVariable) {
		
		var total = 0;
	    for(var i = 0; i < $scope.bnvariablesAsync.length; i++){
	        if ($scope.bnvariablesAsync[i].tierLevel > causeVariable.tierLevel) {
	        	total += 1; 
	        }
	    }
	    return total;
		
	}; 
	$scope.getQuestionsAnswered = function (causeVariableId) {
		
		var answersForCounting = $filter('filter')($scope.answersAsync, { bnvariableCause: causeVariableId }); 
		var total = 0;
	    for(var i = 0; i < answersForCounting.length; i++){
	        if (answersForCounting[i].value == true || answersForCounting[i].value == false) {
	        	total += 1; 
	        }
	    }
	    return total;
	}; 
	

	
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
	
	/**
     * Tests if the answer (consisting of various form components) is valid.
     * @param AnswerForm the form object from the questions.html page.
     * @returns {boolean|*} true if valid, false otherwise.
     */
    $scope.isValidAnswer = function (AnswerForm) {
        return !AnswerForm.$invalid
    }; 
	
	/**
     * Invokes the elgameapi.saveAnswer API.
     * @param AnswerForm holds the components that make up the answer 
     *     
     * */
    $scope.saveAnswer = function (AnswerForm, answerIdInput) {
        if (!$scope.isValidAnswer(AnswerForm)) {
            return;
        }
        
        var currentAnswer = $filter('filter')($scope.answersAsync, { uniqueId: answerIdInput })[0]; 
        
        // a comment is not required but null cannot be sent via the API 
        if(!currentAnswer.comment) currentAnswer.comment = ""; 
        
        $scope.loading = true;
        gapi.client.elgameapi.saveAnswer({
        	'uniqueId' : currentAnswer.uniqueId, 
        	'comment' : currentAnswer.comment, 
        	'value' : currentAnswer.value
        })
        	.execute(function (resp) {
                $scope.$apply(function () {
                    $scope.loading = false;
                    if (resp.error) {
                        // The request has failed.
                        var errorMessage = resp.error.message || '';
                        $scope.messages = 'Failed to save the answer : ' + errorMessage;
                        $scope.alertStatus = 'warning';
                        $log.error($scope.messages + ' Answer with id : ' + JSON.stringify(AnswerForm.answerIdInput));

                        if (resp.code && resp.code == HTTP_ERRORS.UNAUTHORIZED) {
                            oauth2Provider.showLoginModal();
                            return;
                        }
                    } else {
                        // The request has succeeded.
                        $scope.messages = 'The answer has been saved in the datastore: ' + resp.result.name; 
                        $scope.alertStatus = 'success'; 
                        $scope.submitted = false; 
                        // give some feedback, eg. show label with 'Saved' 
                        $log.info($scope.messages + ' : ' + JSON.stringify(resp.result)); 
                    }
                    
                });
            });
    };

});
