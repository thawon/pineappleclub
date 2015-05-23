(function () {

    'use strict';

    angular.module('pineappleclub.services', [])
    .controller('ServicesController', ServicesController);

    ServicesController.$inject = [];

    function ServicesController() {
        var that = this;

        that.animation = 'zoom-animation';
    }

}());