(function () {

    'use strict';

    angular.module('pineappleclub.application', [
        'ngProgress',
        'pineappleclub.app-configuration-service',
        'pineappleclub.auth-service',
        'pineappleclub.user-service',
        'pineappleclub.auth-events-constant'
    ])
    .controller('ApplicationController', ApplicationController);

    ApplicationController.$inject = [
        '$rootScope',
        'ngProgress',
        'AppConfigurationService',
        'AuthService',
        'UserService',
        'AUTH_EVENTS'
    ];

    function ApplicationController($rootScope, ngProgress, AppConfigurationService,
        AuthService, UserService, AUTH_EVENTS) {

        var that = this;

        that.setCurrentUser = function (user) {
            UserService.setCurrentUser(user);
        }

        // setting progress bar color
        ngProgress.color(AppConfigurationService.progress.color);

        // check if the user are still logged in from last session.
        AuthService.authenticated()
        .then(function (data) {
            if (data.success) {
                that.setCurrentUser(AuthService.getCurrentUser());
            }
        });

    }

}());