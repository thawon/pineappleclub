(function () {

    'use strict';

    angular.module('pineappleclub.state-service', [
        'pineappleclub.authorisation-constant'
    ])
    .factory('StateService', StateService);

    StateService.$inject = [
        '$location',
        'AUTHORISATION',
        '$state'
    ];

    function StateService($location, AUTHORISATION, $state) {
        var stateService = {
            changeState: changeState
        };

        return stateService;

        function changeState(name, params) {
            $state.go(name, params)
        };
    }

}());