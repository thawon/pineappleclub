'use strict';

describe('permission', function () {
    var httpBackendMock = require('./httpBackendMock.js');

    beforeEach(function () {
        browser.get('/');
    });

    it('admin-pages are not accessible without user authentication', function () {
                
        httpBackendMock.add([
            {
                method: 'POST',
                url: '/authenticated',
                header: 200,
                response: {
                    success: false
                }
            }
        ]);

        browser.get('/dashboard');

        expect(browser.getCurrentUrl()).toContain('login');
    });

    it('admin-pages are accessible when user is authenticated', function () {        
        
        httpBackendMock.add([
           {
               method: 'POST',
               url: '/authenticated',
               header: 200,
               response: {
                   success: true,
                   user: {
                       local: {
                           email: 'email@valid.com',
                           firstname: 'firstname_valid',
                           lastname: 'lastname_valid',
                           userRole: 'admin'
                       }
                   }
               }
           }
        ]);

        browser.get('/dashboard');

        expect(browser.getCurrentUrl()).toContain('dashboard');
    });

    it('admin-pages are accessible after user logins', function () {
        
        httpBackendMock.add([
            {
                method: 'POST',
                url: '/authenticated',
                header: 200,
                response: {
                    success: false
                }
            },
            {
                method: 'POST',
                url: '/login',
                header: 200,
                response: {
                    success: true,
                    user: {
                        local: {
                            email: 'email@valid.com',
                            firstname: 'firstname_valid',
                            lastname: 'lastname_valid',
                            userRole: 'admin'
                        }
                    }
                }
            }
        ]);

        browser.get('/login');

        element(by.model('login.credentials.email')).sendKeys('email@valid.com');
        element(by.model('login.credentials.password')).sendKeys('password');
        element(by.css('.btn')).click();
        
        expect(browser.getCurrentUrl()).toContain('dashboard');
    });
});