'use strict';

describe('Unit: LoingController', function () {

    beforeEach(module('pineappleclub.login'));

    var createController, controller, $rootScope, rootScope, cookieStore, $q, AuthServiceMock,
        StateServiceMock, UserServiceMock, AUTH_EVENTS;

    beforeEach(inject(function ($controller, _$rootScope_, _$q_, _$cookieStore_, _AUTH_EVENTS_, STRING) {
        $q = _$q_;
        $rootScope = _$rootScope_;

        cookieStore = _$cookieStore_;
        AUTH_EVENTS = _AUTH_EVENTS_;
        
        StateServiceMock = {
            changeState: function (stateName) { }
        };

        AuthServiceMock = {
            login: function (credentials) { },
            getCurrentUser: function () { },
            isAuthenticated: function () { }
        };

        UserServiceMock = {
            setCurrentUser: function (user) { }
        };
        
        spyOn(StateServiceMock, "changeState");
        spyOn(UserServiceMock, "setCurrentUser");

        createController = function () {
            return $controller("LoginController", {
                $rootScope: rootScope,
                $cookieStore: cookieStore,                
                AuthService: AuthServiceMock,
                StateService: StateServiceMock,
                UserService: UserServiceMock,
                AUTH_EVENTS: AUTH_EVENTS,
                STRING: STRING
            });
        };
    }));

    it("user logins successfully",
    function () {
        var user = {};
        rootScope = $rootScope.$new();

        spyOn(rootScope, "$broadcast");

        spyOn(AuthServiceMock, "login").andCallFake(function () {
            var deferred = $q.defer();

            deferred.resolve({ success: true });

            return deferred.promise;
        });

        spyOn(AuthServiceMock, "getCurrentUser").andCallFake(function () {
            return user;
        });

        controller = createController();

        controller.login();

        rootScope.$apply();

        expect(UserServiceMock.setCurrentUser).toHaveBeenCalledWith(user);
        expect(rootScope.$broadcast).toHaveBeenCalledWith(AUTH_EVENTS.loginSuccess);

        expect(StateServiceMock.changeState).toHaveBeenCalledWith("dashboard");
    });

    it("current user is unable to login",
    function () {
        rootScope = $rootScope.$new();

        spyOn(AuthServiceMock, "login").andCallFake(function (credentials) {
            var deferred = $q.defer();

            rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);

            return deferred.promise;
        });
        
        controller = createController();

        controller.login();

        rootScope.$apply();

        expect(controller.errorMessage).not.toBe(null);
    });

    it("user is authenticated",
    function () {
        spyOn(AuthServiceMock, "isAuthenticated").andCallFake(function () {
            return true;
        });
        
        createController();

        expect(StateServiceMock.changeState).toHaveBeenCalled();
    });

    it("user is not authenticated",
    function () {
        spyOn(AuthServiceMock, "isAuthenticated").andCallFake(function () {
            return false;
        });

        createController();

        expect(StateServiceMock.changeState).not.toHaveBeenCalled();
    });
});