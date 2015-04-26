(function () {

    'use strict';

    angular.module('pineappleclub.auth-service', [])
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
            $cookieStore.put('user', user);
        }

        function login(credentials) {
            return $http.post('/login', credentials)
                .then(function (res) {
                    var data = res.data;

                    if (data.success) {
                        setCurrentUser(data.user.local);
                    }

                    return data;
                });
        };

        function logout() {
            return $http.post('/logout')
                .then(function (res) {
                    var data = res.data;

                    if (data.success) {
                        $cookieStore.remove('user');
                    }

                    return data;
                });
        };

        function authenticated() {

            $cookieStore.remove('user');

            return $http.post('/authenticated')
                .then(function (res) {
                    var data = res.data;

                    if (data.success) {
                        setCurrentUser(data.user.local);
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
            var user = $cookieStore.get('user');

            return (user) ? user : null;
        }

    }

}());