'use strict';

describe('permission', function () {
    var Mocks = require('./httpBackendMock.js');

    beforeEach(function () {
        browser.get('/');
    });

    //it('admin-pages are not accessible without user authentication', function () {

    //    var config;

    //    config = {
    //        method: 'POST',
    //        url: '/authenticated',
    //        header: 200,
    //        response: {
    //            success: false
    //        }
    //    };

    //    browser.addMockModule('httpBackendMock', Mocks.httpBackendMock, config);

    //    browser.get('/dashboard');

    //    expect(browser.getCurrentUrl()).toContain('login');
    //});

    //it('admin-pages are accessible when user is authenticated', function () {        
        
    //    var config;

    //    config = {
    //        method: 'POST',
    //        url: '/authenticated',
    //        header: 200,
    //        response: {
    //            success: true,
    //            user: {
    //                local: {
    //                    email: 'email@valid.com',
    //                    firstname: 'firstname_valid',
    //                    lastname:'lastname_valid',
    //                    userRole: 'admin'                                
    //                }
    //            }
    //        }
    //    };

    //    browser.addMockModule('httpBackendMock', Mocks.httpBackendMock, config);

    //    browser.get('/dashboard');

    //    expect(browser.getCurrentUrl()).toContain('dashboard');
    //});

    it('admin-pages are accessible after user logins', function () {

        var authenticatedMock = function () {
            angular.module('authenticatedMock', ['ngMockE2E'])
                .run(function ($httpBackend) {
                    $httpBackend.whenPOST(/authenticated/).respond(200, { success: false });
                });
        };

        var loginMock = function () {
            angular.module('loginMock', ['ngMockE2E'])
                .run(function ($httpBackend) {
                    var response = {
                        success: true,
                        user: {
                            local: {
                                email: 'email@valid.com',
                                firstname: 'firstname_valid',
                                lastname: 'lastname_valid',
                                userRole: 'admin'
                            }
                        }
                    };

                    $httpBackend.whenPOST(/login/).respond(200, response);
                });
        };

        browser.addMockModule('authenticatedMock', authenticatedMock);
        browser.addMockModule('loginMock', loginMock);

        browser.get('/login');

        element(by.model('login.credentials.email')).sendKeys('email@valid.com');
        element(by.model('login.credentials.password')).sendKeys('password');
        element(by.css('.btn')).click();
        
        expect(browser.getCurrentUrl()).toContain('dashboard');

        browser.sleep(30000);
    });
});