(function () {

    'use strict';

    angular.module('pineappleclub.side-bar', [
        'pineappleclub.app-configuration-service',
        'pineappleclub.navigator-service',
        'pineappleclub.device-height-directive'
    ])
    .controller('SideBarController', SideBarController);

    SideBarController.$inject = [
        'AppConfigurationService',
        'NavigatorService'
    ];

    function SideBarController(AppConfigurationService, NavigatorService) {
        var that = this;

        that.configs = {
            ELE_SIDEBAR: ".row-offcanvas",
            CONS_ACTIVE: "active",
            CSS_SIDEBARSHOW: "side-bar-show",
            CSS_SIDEBARHIDE: "side-bar-hide"
        };

        that.project = AppConfigurationService.companyInfo;
        that.menu = NavigatorService.pages.main;
        that.toggleSideBar = $.proxy(toggleSideBar, that);

        function toggleSideBar() {
            $(that.configs.ELE_SIDEBAR).toggleClass(that.configs.CONS_ACTIVE);
        }
    }

}());