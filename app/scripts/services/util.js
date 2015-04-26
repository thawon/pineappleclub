(function () {

    'use strict';

    angular.module('pineappleclub.util-service', [])
    .factory('UtilService', UtilService);

    UtilService.$inject = [];

    function UtilService() {
        var util = {
                device: {
                    isBreakpoint: isBreakpoint
                }
            };

        return util;

        function isBreakpoint (size) {
            return $('.device-' + size).is(':visible');
        }
    }

}());