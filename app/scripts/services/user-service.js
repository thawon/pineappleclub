(function () {

    'use strict';

    angular.module('pineappleclub.user-service', [])
    .factory('UserService', UserService);

    UserService.$inject = [];

    function UserService() {
        var currentUser,
            userService = {
            getCurrentUser: function () {
                return currentUser;
            },
            setCurrentUser: function (user) {
                currentUser = user;
            }
        }

        return userService;
    }

}());