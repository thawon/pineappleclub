'use strict';

var httpBackendMock = function () {
    angular.module('httpBackendMock', ['ngMockE2E'])
        .value('config', arguments[0])
        .run(function ($httpBackend, config) {

            $httpBackend
                .when(config.method, config.url)
                .respond(config.header, config.response);

        });
};

module.exports.httpBackendMock = httpBackendMock;