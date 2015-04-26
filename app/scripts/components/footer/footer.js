(function () {

    'use strict';

    angular.module('pineappleclub.footer', [
        'pineappleclub.navigator-service'
    ])
    .controller('FooterController', FooterController);

    FooterController.$inject = [
        'NavigatorService'
    ];

    function FooterController(NavigatorService) {
        var that = this;

        that.menu = NavigatorService.pages.about;

    }

}());