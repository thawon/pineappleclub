(function () {

    'use strict';

    angular.module('pineappleclub.user-profile', [
        'pineappleclub.entity-detail-container',
        'pineappleclub.expandable-container',
        'pineappleclub.user-profile-service',
        'pineappleclub.data-service',
        'pineappleclub.user-service'
    ])
    .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = [
        'UserProfileService',
        'DataService',
        'UserService'
    ];

    function UserProfileController(UserProfileService, DataService, UserService) {
        var that = this,
            currentUser = UserService.getCurrentUser();

        that.user = null;

        UserProfileService.getUser(currentUser._id)
            .then(function (user) {
                that.user = user;
            });

        that.save = DataService.saveChanges();
        that.fail = function (error) {
            var x;
            x = 1;
        }

        that.updateFnB = function () {
            console.log('B save here.');
        };

        that.saveXX = function () {
            console.log('save here.');
        };
    }

}());