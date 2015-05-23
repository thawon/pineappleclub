(function () {

    'use strict';

    angular.module('pineappleclub.philosophy', [])
    .controller('PhilosophyController', PhilosophyController);

    PhilosophyController.$inject = [];

    function PhilosophyController() {
        var that = this;

        that.animation = 'zoom-animation';
    }

}());