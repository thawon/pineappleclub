(function () {

    'use strict';

    angular.module('pineappleclub.contact', [
        'pineappleclub.app-configuration-service',
        'pineappleclub.google-map-directive'
    ])
    .controller('ContactController', ContactController);

    ContactController.$inject = [
        '$location',
        'AppConfigurationService'
    ];

    function ContactController($location, AppConfigurationService) {
        var that = this;

        that.location = $location;
        that.companyInfo = AppConfigurationService.companyInfo;
        that.animation = 'zoom-animation';
    }

}());