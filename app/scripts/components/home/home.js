(function () {

    'use strict';

    angular.module('pineappleclub.home', [])
        .controller('HomeController', HomeController);

    HomeController.$inject = [];

    function HomeController() {
        var that = this;

        that.animation = 'zoom-animation';
    }

}());