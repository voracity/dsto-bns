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
 * Client ID of the application (from the APIs Console).
 * @type {string}
 */
elgame.CLIENT_ID =
    '301169776727-fafp837c210nmefpi29phjnrpcmq58j7.apps.googleusercontent.com';

/**
 * Scopes used by the application.
 * @type {string}
 */
elgame.SCOPES =
    'https://www.googleapis.com/auth/userinfo.email';

/**
 * Whether or not the user is signed in.
 * @type {boolean}
 */
elgame.signedIn = false;

/**
 * Loads the application UI after the user has completed auth. 
 * Also retrieves the profile. 
 */
elgame.userAuthed = function() {
  var request = gapi.client.oauth2.userinfo.get().execute(function(resp) {
    if (!resp.code) {
      elgame.signedIn = true;
//      document.getElementById('signinButton').innerHTML = 'Sign out';
//      document.getElementById('setDisplayName').disabled = false;
//      document.getElementById('storeVariable').disabled = false;
      elgame.getProfile(); 
    }
  });
};

/**
 * Handles the auth flow, with the given value for immediate mode.
 * @param {boolean} mode Whether or not to use immediate mode.
 * @param {Function} callback Callback to call on completion.
 */
elgame.signin = function(mode, callback) {
  gapi.auth.authorize({client_id: elgame.CLIENT_ID,
      scope: elgame.SCOPES, immediate: mode}, callback);
};

/**
 * Presents the user with the authorization popup.
 */
elgame.auth = function() {
  if (!elgame.signedIn) {
    elgame.signin(false, elgame.userAuthed);
  } else {
    elgame.signedIn = false;
//    document.getElementById('signinButton').innerHTML = 'Sign in';
//    document.getElementById('setDisplayName').disabled = true;
//    document.getElementById('storeVariable').disabled = true;
    elgame.outputDisplayName('Not logged in.'); 
  }
};

/**
 * Sets the display name in the banner.
 * param {Object} profile Profile with display name.
 */
elgame.outputDisplayName = function(name) {
  document.getElementById('displayName').innerHTML = name;
};

/**
 * Sets the user's display name via the API.
 * @param {string} name Display name for the profile.
 */
elgame.setDisplayName = function(name) {
  gapi.client.elgameapi.setDisplayName({'name': name}).execute(
      function(resp) {
        if (!resp.code) {
          elgame.outputDisplayName("Welcome "+resp.displayName);
        } else {
          window.alert(resp.message);
        }
      });
};

/**
 * Retrieves the profile for the current user via the API.
 * Also sets the display name. 
 */
elgame.getProfile = function() {
  gapi.client.elgameapi.getProfile().execute(
      function(resp) {
        if (!resp.code) {
          elgame.outputDisplayName("Welcome "+resp.displayName);
        } else {
          window.alert(resp.message);
        }
      });
};

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
 * Enables the button callbacks in the UI.
 */
elgame.enableButtons = function() {

//  document.getElementById('setDisplayName').onclick = function() {
//    elgame.setDisplayName(
//    		document.getElementById('dispName').value); 
//  }
//
//  document.getElementById('storeVariable').onclick = function() {
//    elgame.storeVariable(
//        document.getElementById('name').value,
//        document.getElementById('label').value);
//  }
//  
//  document.getElementById('signinButton').onclick = function() {
//    elgame.auth();
//  }
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
      elgame.enableButtons();
      elgame.signin(true, elgame.userAuthed); 
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

