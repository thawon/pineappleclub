(function () {

    'use strict';

    angular.module('pineappleclub.navigator', [
        'pineappleclub.app-configuration-service',
        'pineappleclub.navigator-service'
    ])
    .controller('NavigatorController', NavigatorController);

    NavigatorController.$inject = [
        'AppConfigurationService',
        'NavigatorService'
    ];

    function NavigatorController(AppConfigurationService, NavigatorService) {

        this.companyInfo = AppConfigurationService.companyInfo;
        this.menu = NavigatorService.pages.main;
        
        this.toggleSideBar = function() {
            $('.row-offcanvas').toggleClass('active');
        }
    }

}());