'use strict'; // so that using undeclared variables will cause an error 

/**
 * @fileoverview
 * Provides methods for The Elicitation Game UI and interaction with the
 * Elicitation Game API (elgameapi).
 *
 * @author nick.meinhold@gmail.com (Nick Meinhold)
 */

/** global namespace for this project. */
var elgame = elgame || {};

/**
 * Stores a variable via the API.
 * @param {string} name Name of the variable.
 * @param {string} label Human readable label.
 */
elgame.storeVariable = function(name, label) {
  gapi.client.elgameapi.storeVariable(
		  {'name': name},
		  {'label': label}).execute(
      function(resp) {
        if (!resp.code) {
          //elgame.outputDisplayName(resp.displayName);
        } else {
          window.alert(resp.message);
        }
      });
};


/**
 * Initializes the application.
 * @param {string} apiRoot Root of the API's path.
 */
elgame.init = function(apiRoot) {
  // Loads the OAuth and elgame APIs asynchronously, and triggers login
  // when they have completed.
  var apisToLoad;
  var callback = function() {
    if (--apisToLoad == 0) {
      angular.bootstrap(document, ['elgameAngApp']); // Bootstrap the angular module after loading the 
		// Google libraries so the Google JavaScript library is ready in the angular modules.
    }
  }

  apisToLoad = 2; // must match number of calls to gapi.client.load()
  gapi.client.load('elgameapi', 'v1', callback, apiRoot);
  gapi.client.load('oauth2', 'v2', callback);
};

/**
 * @ngdoc object
 * @name elgameAngApp
 * @requires $routeProvider
 * @requires conferenceControllers
 * @requires ui.bootstrap
 *
 * @description
 * Root app, which routes and specifies the partial html and controller depending on the url requested.
 *
 */
var angApp = angular.module('elgameAngApp',
    ['elgameControllers', 'ngRoute']).config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/questions', {
                    templateUrl: '/partials/questions.html',
                    controller: 'ShowQuestionsCtrl'
                }).
                when('/edit_variables', {
                    templateUrl: '/partials/edit_variables.html',
                    controller: 'EditVariablesCtrl'
                }).
                when('/conference/create', {
                    templateUrl: '/partials/create_conferences.html',
                    controller: 'CreateConferenceCtrl'
                }).
                when('/conference/detail/:websafeConferenceKey', {
                    templateUrl: '/partials/conference_detail.html',
                    controller: 'ConferenceDetailCtrl'
                }).
                when('/profile', {
                    templateUrl: '/partials/profile.html',
                    controller: 'MyProfileCtrl'
                }).
                when('/', {
                    templateUrl: '/partials/home.html'
                }).
                otherwise({
                    redirectTo: '/'
                });
        }]);

/**
 * @ngdoc service
 * @name oauth2Provider
 *
 * @description
 * Service that holds the OAuth2 information shared across all the pages.
 *
 */
angApp.factory('oauth2Provider', function ($modal) {
    var oauth2Provider = {
        CLIENT_ID: '301169776727-fafp837c210nmefpi29phjnrpcmq58j7.apps.googleusercontent.com',
        SCOPES: 'email',
        signedIn: false
    };

    /**
     * Calls the OAuth2 authentication method.
     */
    oauth2Provider.signIn = function (callback) {
        gapi.auth.signIn({
            'clientid': oauth2Provider.CLIENT_ID,
            'cookiepolicy': 'single_host_origin',
            'accesstype': 'online',
            'approveprompt': 'auto',
            'scope': oauth2Provider.SCOPES,
            'callback': callback
        });
    };

    /**
     * Logs out the user.
     */
    oauth2Provider.signOut = function () {
        gapi.auth.signOut();
        // Explicitly set the invalid access token in order to make the API calls fail.
        gapi.auth.setToken({access_token: ''})
        oauth2Provider.signedIn = false;
    };

    /**
     * Shows the modal with Google+ sign in button.
     *
     * @returns {*|Window}
     */
    oauth2Provider.showLoginModal = function() {
        var modalInstance = $modal.open({
            templateUrl: '/partials/login.modal.html',
            controller: 'OAuth2LoginModalCtrl'
        });
        return modalInstance;
    };

    return oauth2Provider;
});

/**
 * @ngdoc constant
 * @name HTTP_ERRORS
 *
 * @description
 * Holds the constants that represent HTTP error codes.
 *
 */
angApp.constant('HTTP_ERRORS', {
    'UNAUTHORIZED': 401
});
