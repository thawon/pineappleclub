(function () {

    'use strict';

    angular.module('pineappleclub.side-bar', [
        'pineappleclub.device-height-directive',
        'pineappleclub.app-configuration-service',        
        'pineappleclub.authorisation-constant'
    ])
    .controller('SideBarController', SideBarController);

    SideBarController.$inject = [
        'AppConfigurationService',
        'AUTHORISATION'
    ];

    function SideBarController(AppConfigurationService, AUTHORISATION) {
        var that = this,
            states;

        that.configs = {
            ELE_SIDEBAR: ".row-offcanvas",
            CONS_ACTIVE: "active",
            CSS_SIDEBARSHOW: "side-bar-show",
            CSS_SIDEBARHIDE: "side-bar-hide"
        };
        
        states = _.filter(AUTHORISATION.STATES.states,
            function (state) {
                return state.name === 'home'
                    || state.name === 'services'
                    || state.name === 'philosophy'
                    || state.name === 'photos'
                    || state.name === 'contact';
            });

        that.project = AppConfigurationService.companyInfo;
        that.states = states;
        that.toggleSideBar = $.proxy(toggleSideBar, that);

        function toggleSideBar() {
            $(that.configs.ELE_SIDEBAR).toggleClass(that.configs.CONS_ACTIVE);
        }
    }

}());