﻿(function () {

    'use strict';

    angular.module('pineappleclub.user-model', [
        'pineappleclub.util-service'
    ])
    .factory('UserModelService', UserModelService);

    UserModelService.$inject = [
        'UtilService'
    ];

    function UserModelService(UtilService) {
        var type = breeze.DataType,
            userModelService = {
                model: function () { },
                getType: function () {
                    return {
                        name: 'User',
                        dataProperties: {
                            id: { type: type.MongoObjectId },
                            firstname: { required: true, max: 10 },
                            lastname: { required: true, max: 50 },
                            userRole: { required: true, max: 10 },
                            lastLoggedInDateTime: { type: type.DateTime }
                        }
                    };
                }
            };

        UtilService.defineProperty(userModelService.model, 'fullname', function () {
            return this.firstname + ' ' + this.lastname;
        });

        return userModelService;
    }

}());