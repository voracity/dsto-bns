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
elgameAngApp.controllers = angular.module('elgameControllers', ['ui.bootstrap']);

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
        $scope.singInViaModal = function () {
            oauth2Provider.signIn(function () {
                gapi.client.oauth2.userinfo.get().execute(function (resp) {
                    $scope.$root.$apply(function () {
                        oauth2Provider.signedIn = true;
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
 * @name ShowQuestionsCtrl
 *
 * @description
 * A controller used for the My Profile page.
 */
elgameAngApp.controllers.controller('ShowQuestionsCtrl',
    function ($scope, $log, oauth2Provider, HTTP_ERRORS) {
        $scope.submitted = false;
        $scope.loading = false;

        /**
         * The initial profile retrieved from the server to know the dirty state.
         * @type {{}}
         */
        $scope.initialProfile = {};

        /**
         * Candidates for the teeShirtSize select box.
         * @type {string[]}
         */
        $scope.teeShirtSizes = [
            'XS',
            'S',
            'M',
            'L',
            'XL',
            'XXL',
            'XXXL'
        ];
    })
;

