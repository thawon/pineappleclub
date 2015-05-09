(function () {

    'use strict';

    angular.module('pineappleclub.auth-service', [
        'ngCookies'
    ])
    .factory('AuthService', AuthService);

    AuthService.$inject = [
        '$cookieStore',
        '$http'
    ];

    function AuthService($cookieStore, $http) {

        var authService = {
            login: login,
            logout: logout,
            authenticated: authenticated,
            isAuthenticated: isAuthenticated,
            isAuthorized: isAuthorized,
            getCurrentUser: getCurrentUser
        };

        return authService;

        function setCurrentUser(user) {
            localStorage.setItem('user', JSON.stringify(user));
        }

        function login(credentials) {
            return $http.post('/api/login', credentials)
                .then(function (res) {
                    var data = res.data;

                    if (data.success) {
                        setCurrentUser(data.user);
                    }

                    return data;
                });
        };

        function logout() {
            return $http.post('/api/logout')
                .then(function (res) {
                    var data = res.data;

                    if (data.success) {
                        localStorage.removeItem('user');
                    }

                    return data;
                });
        };

        function authenticated() {

            localStorage.removeItem('user');

            return $http.post('/api/authenticated')
                .then(function (res) {
                    var data = res.data;
                    if (data.success) {
                        setCurrentUser(data.user);
                    }

                    return data;
                });
        };

        function isAuthenticated() {
            return !!authService.getCurrentUser();
        };

        function isAuthorized(authorizedRoles) {
            var currentUser = authService.getCurrentUser()

            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }

            return (authService.isAuthenticated()
                    && authorizedRoles.indexOf(currentUser.userRole) !== -1);
        };

        function getCurrentUser() {
            var user = localStorage.getItem('user');

            return (user) ? JSON.parse(user) : null;
        }

    }

}());