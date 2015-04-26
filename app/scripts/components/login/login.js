(function () {

    'use strict';

    angular.module('pineappleclub.login', [
        'pineappleclub.auth-service',
        'pineappleclub.state-service',
        'pineappleclub.user-service',
        'pineappleclub.auth-events-constant',
        'pineappleclub.string-constant'
    ])
        .controller('LoginController', LoginController);

    LoginController.$inject = [
        '$rootScope', 
        '$cookieStore',
        'AuthService',
        'StateService',
        'UserService',
        'AUTH_EVENTS',
        'STRING'
    ];

    function LoginController($rootScope, $cookieStore, AuthService,
        StateService, UserService, AUTH_EVENTS, STRING) {
        
        var that = this;

        that.credentials = {
            email: STRING.empty,
            password: STRING.empty
        };

        that.errorMessage = null;

        that.login = function (credentials) {
            AuthService.login(credentials)
            .then(function (res) {
                var user = AuthService.getCurrentUser();

                UserService.setCurrentUser(user);

                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

                goDashboard();
            });
        }

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function () {
            that.errorMessage = 'The email or password you entered is incorrect.';
        });

        if (AuthService.isAuthenticated()) {
            // use has signed in, redirect to home page
            goDashboard();
        }

        function goDashboard() {
            StateService.changeState('dashboard');
        }
    }

}());