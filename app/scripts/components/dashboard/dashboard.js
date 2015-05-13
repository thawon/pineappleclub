(function () {

    'use strict';

    angular.module('pineappleclub.dashboard', [
        'pineappleclub.authorisation-constant',
        'pineappleclub.user-service'
    ])
    .controller('DashboardController', DashboardController);

    DashboardController.$inject = [
        'AUTHORISATION',
        'UserService'
    ];

    function DashboardController(AUTHORISATION, UserService) {
        var that = this,
            states, currentUser;

        that.currentUser = UserService.getCurrentUser();

        states = _.filter(AUTHORISATION.STATES.states,
            function (state) {
                return (state.data.authorizedRoles.indexOf(that.currentUser.userRole) !== -1)
                        && state.name !== 'dashboard';
            });

        that.states = states;
    }

}());