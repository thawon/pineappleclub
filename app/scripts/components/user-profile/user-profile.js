(function () {

    'use strict';

    angular.module('pineappleclub.user-profile', [
        'pineappleclub.entity-detail-container',
        'pineappleclub.expandable-container',
        'pineappleclub.user-profile-service'
    ])
    .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = [
        'UserProfileService'
    ];

    function UserProfileController(UserProfileService) {
        var that = this;

        that.user = null;

        UserProfileService.getUsers()
            .then(function (user) {
                that.user = user;
                user.fullname;
            });

        that.updateFn = function () {
            UserProfileService.save();
        };

        that.updateFnB = function () {
            console.log('B save here.');
        };

        that.saveXX = function () {
            console.log('save here.');
        };
    }

}());