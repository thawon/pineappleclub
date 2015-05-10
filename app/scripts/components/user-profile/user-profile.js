(function () {

    'use strict';

    angular.module('pineappleclub.user-profile', [
        'pineappleclub.entity-detail-container',
        'pineappleclub.expandable-container'
    ])
    .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = [
        'UserService'
    ];

    function UserProfileController(UserService) {
        var that = this;

        that.user = null;

        UserService.getUsers()
            .then(function (user) {
                that.user = user;
                user.fullname;
            });

        that.updateFn = function () {
            UserService.save();
        };

        that.updateFnB = function () {
            console.log('B save here.');
        };

        that.saveXX = function () {
            console.log('save here.');
        };
    }

}());