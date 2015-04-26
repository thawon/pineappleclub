exports.config = {
    allScriptsTimeout: 11000,

    // This allows you provide a URL to the Selenium Server that Protractor will use to execute tests. 
    // In this case Selenium Server must be previously started to be able to run tests on Protractor.
    seleniumAddress: "http://localhost:4444/wd/hub",

    capabilities: {
        "browserName": "chrome"
    },

    params: {
        mockedResponse: {
            sampleData: undefined
        }
    },

    // A default URL may be passed to Protractor through the baseURL parameter. 
    // That way all calls by Protractor to the browser will use that URL.
    baseUrl: "http://localhost:3000/",

    onPrepare: function () {

        var templateMock = function () {
            angular.module('httpBackendMock', ['ngMockE2E', 'pineappleclub'])
                .run(function ($httpBackend) {
                    $httpBackend.when("GET", function (url) {                        
                        return url.indexOf(".html") !== -1;
                    }).passThrough();
                });
        };

        browser.addMockModule('httpBackendMock', templateMock);

    },

    // An array of test files can be sent through the specs parameter for Protractor to execute. 
    // The path of the test files must be relative to the config file.
    specs: ["e2e/*spec.js"],
    
    singleRun: false,

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
}