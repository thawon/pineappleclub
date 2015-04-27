describe('Unit: AuthService', function () {

    var service, $cookieStore, $httpBackend, AUTHORISATION, USER_ROLES;

    beforeEach(module('ngCookies', 'pineappleclub.authorisation-constant', 'pineappleclub.auth-service'));    

    beforeEach(inject(function (AuthService, _$cookieStore_, _$httpBackend_, AUTHORISATION) {
        service = AuthService;
        USER_ROLES = AUTHORISATION.USER_ROLES;

        $cookieStore = _$cookieStore_;
        $httpBackend = _$httpBackend_;
    }));

    it('user logins',
    function () {
        var credentials = {
            email: 'tester@unittest.com.au',
            password: 'password'
        },
            user = {
                email: credentials.email,
                password: credentials.password,
                userRole: 'admin'
            },
            url = '/login';

        $httpBackend.when('POST', url)
            .respond({
                success: true,
                user: {
                    local: user
                }
            });

        spyOn($cookieStore, 'put');

        service.login(credentials, function () { });

        $httpBackend.flush();

        $httpBackend.expectPOST(url);
        expect($cookieStore.put).toHaveBeenCalledWith('user', user);
    });

    it('user logout',
    function () {
        var url = '/logout';

        $httpBackend.when('POST', url)
            .respond({
                success: true
            });

        spyOn($cookieStore, 'remove');

        service.logout(function () { });

        $httpBackend.flush();

        $httpBackend.expectPOST(url);
        expect($cookieStore.remove).toHaveBeenCalledWith('user');
    });

    it('user is authenticated, checking authentication',
    function () {
        spyOn($cookieStore, 'get').andCallFake(function () {
            return {
                email: 'tester@unittest.com.au',
                password: 'password'
            };
        });

        expect(service.isAuthenticated()).toBe(true);
    });

    it('user is not authenticated, checking authentication',
    function () {
        spyOn($cookieStore, 'get').andCallFake(function () {
            return null;
        });

        expect(service.isAuthenticated()).toBe(false);
    });

    it('get current authenticated user',
    function () {
        spyOn($cookieStore, 'get');

        service.getCurrentUser();

        expect($cookieStore.get).toHaveBeenCalledWith('user');
    });

    it('admin user accesses url which requires admin permission',
    function () {
        var authorizedRoles = [USER_ROLES.admin];

        spyOn($cookieStore, 'get').andCallFake(function () {
            return {
                email: 'tester@unittest.com.au',
                password: 'password',
                userRole: 'admin'
            };
        });

        expect(service.isAuthorized(authorizedRoles)).toBe(true);
    });

    it('parent user accesses url which requires admin permission',
    function () {
        var authorizedRoles = [USER_ROLES.admin];

        spyOn($cookieStore, 'get').andCallFake(function () {
            return {
                email: 'tester@unittest.com.au',
                password: 'password',
                userRole: 'parent'
            };
        });

        expect(service.isAuthorized(authorizedRoles)).toBe(false);
    });
});