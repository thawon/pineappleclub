(function () {

    'use strict';

    angular.module('pineappleclub.footer', [
        'pineappleclub.authorisation-constant'
    ])
    .controller('FooterController', FooterController);

    FooterController.$inject = [
        '$rootScope',
        'AUTHORISATION'
    ];

    function FooterController($rootScope, AUTHORISATION) {
        var that = this,
            states;

        states = _.filter(AUTHORISATION.STATES.states,
            function (state) {
                return state.name === 'philosophy'
                    || state.name === 'contact';
            });

        that.isShown = false;

        $rootScope.$on("$stateChangeSuccess", function (event, next) {
            var allowedStates = _.filter(AUTHORISATION.STATES.states,
                                    function (state) {
                                        return state.data.authorizedRoles.indexOf(AUTHORISATION.USER_ROLES.admin) === -1
                                                && state.name !== 'login'
                                                && state.name !== 'signout';
                                    });

            that.isShown = (_.find(allowedStates, function (state) { return state.name === next.name; }))
                                ? true : false;
        });

        that.states = states;
    }

}());