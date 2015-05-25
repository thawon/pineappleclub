(function () {

    'use strict';

    angular.module('pineappleclub.footer-admin', [
        'pineappleclub.authorisation-constant',
        'pineappleclub.user-service'
    ])
    .controller('FooterAdminController', FooterAdminController);

    FooterAdminController.$inject = [
        '$rootScope',
        'AUTHORISATION',
        'UserService'
    ];

    function FooterAdminController($rootScope, AUTHORISATION, UserService) {
        var that = this;

        that.isShown = false;
        
        $rootScope.$on("$stateChangeSuccess", function (event, next) {
            var allowedStates = _.filter(AUTHORISATION.STATES.states,
                                    function (state) {
                                        return state.name === "login"
                                            || state.name === "signout"
                                            || state.data.authorizedRoles.indexOf(AUTHORISATION.USER_ROLES.admin) !== -1;
                                    });

            that.isShown = (_.find(allowedStates, function (state) { return state.name === next.name; }))
                                ? true : false;

            that.currentUser = UserService.getCurrentUser();
        });
    }

}());