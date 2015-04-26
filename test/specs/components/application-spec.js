'use strict';

describe('Unit: ApplicationController', function () {

    beforeEach(module('pineappleclub.application'));

    var createController, rootScope, $q, ngProgressMock, AuthServiceMock, UserServiceMock;

    beforeEach(inject(function ($controller, $rootScope, _$q_, AppConfigurationService) {
        rootScope = $rootScope;
        $q = _$q_;

        ngProgressMock = {
            color: function (color) { }
        };

        AuthServiceMock = {
            authenticated: function () { },
            getCurrentUser: function () { }
        };

        UserServiceMock = {
            setCurrentUser: function (user) { }
        };

        createController = function () {
            return $controller('ApplicationController', {
                ngProgress: ngProgressMock,
                AppConfigurationService: AppConfigurationService,
                AuthService: AuthServiceMock,
                UserService: UserServiceMock
            });
        };
        
    }));

    it('check authentication when application starts',
    function () {
        var user = {},
            controller;

        spyOn(AuthServiceMock, 'authenticated').andCallFake(function () {
            var deferred = $q.defer();

            deferred.resolve({ success: true });

            return deferred.promise;
        });

        spyOn(AuthServiceMock, 'getCurrentUser').andCallFake(function () {
            return user;
        });

        controller = createController();

        spyOn(controller, "setCurrentUser");

        rootScope.$apply();

        expect(controller.setCurrentUser).toHaveBeenCalledWith(user);
    });

    it('check authentication when application starts, user is not authenticated',
    function () {
        var controller;

        spyOn(AuthServiceMock, 'authenticated').andCallFake(function () {
            var deferred = $q.defer();

            deferred.resolve({ success: false });

            return deferred.promise;
        });

        controller = createController();

        spyOn(controller, "setCurrentUser");

        rootScope.$apply();

        expect(controller.setCurrentUser).not.toHaveBeenCalled();
    });
});