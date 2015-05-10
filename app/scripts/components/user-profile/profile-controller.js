(function () {

    'use strict';

    angular.module('pineappleclub.user-profile', [])
    .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = [];

    function UserProfileController() {
        var that = this;

        that.updateFn = function () {
            console.log("A save here.");
        };

        that.updateFnB = function () {
            console.log("B save here.");
        };

        that.saveXX = function () {
            console.log("save here.");
        };
    }

}());