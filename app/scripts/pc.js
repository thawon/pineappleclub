(function () {

    'use strict';

    angular.module('pineappleclub', [
        'ui.router',
        'ngResource',
        'ngProgress',
        'ngCookies',
        'pineappleclub.application',
        'pineappleclub.home',
        'pineappleclub.navigator',
        'pineappleclub.contact',
        'pineappleclub.photos',
        'pineappleclub.header-client',
        'pineappleclub.footer',
        'pineappleclub.side-bar',
        'pineappleclub.authorisation-constant'
    ])
    .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', 'AUTHORISATION',
    function ($locationProvider, $stateProvider, $urlRouterProvider, AUTHORISATION) {

        $locationProvider.html5Mode({
            enabled: true
        });

        $urlRouterProvider.otherwise(AUTHORISATION.STATES.otherwise);

        AUTHORISATION.STATES.states.map(function (state) {
            $stateProvider
                .state(state.name, {
                    url: state.url,
                    templateUrl: state.templateUrl,
                    controller: state.controller,
                    data: state.data
                })
        });

    }]);

}());
(function () {

    'use strict';

    angular.module('pineappleclub.application', [
        'ngProgress',
        'pineappleclub.app-configuration-service',
        'pineappleclub.auth-service'
    ])
    .controller('ApplicationController', ApplicationController);

    ApplicationController.$inject = [
        'ngProgress',
        'AppConfigurationService',
        'AuthService'
    ];

    function ApplicationController(ngProgress, AppConfigurationService, AuthService) {
        var that = this;

        that.setCurrentUser = function (user) {
            that.currentUser = user;
        }

        // setting progress bar color
        ngProgress.color(AppConfigurationService.progress.color);

        // check if the user are still logged in from last session.
        AuthService.authenticated()
        .then(function (data) {
            if (data.success) {
                that.setCurrentUser(AuthService.getCurrentUser());
            }
        });

    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.contact', [
        'pineappleclub.app-configuration-service',
        'pineappleclub.google-map-directive'
    ])
    .controller('ContactController', ContactController);

    ContactController.$inject = [
        '$location',
        'AppConfigurationService'
    ];

    function ContactController($location, AppConfigurationService) {

        this.location = $location;
        this.companyInfo = AppConfigurationService.companyInfo;

    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.footer', [
        'pineappleclub.navigator-service'
    ])
    .controller('FooterController', FooterController);

    FooterController.$inject = [
        'NavigatorService'
    ];

    function FooterController(NavigatorService) {
        var that = this;

        that.menu = NavigatorService.pages.about;

    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.header-admin', [])
        .controller('HeaderAdminController', HeaderAdminController);

    HeaderAdminController.$inject = [];

    function HeaderAdminController() {
    }

}());

//define(
//    ["app", "constants/auth-events", "services/future-state-service"],
//    function (app, AUTH_EVENTS) {
//        "use strict";

//        app.controller("HeaderAdminController",
//            ["$scope", "$rootScope", "FutureStateService", "AuthService", 
//            function ($scope, $rootScope, FutureStateService, AuthService) {
//                $scope.logout = function () {
//                    AuthService.logout()
//                    .then(function (res) {
//                        $scope.setCurrentUser(null);

//                        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);

//                        FutureStateService.changeState("signout");
//                    });
//                }
//            }
//        ]);
//    });
(function () {

    'use strict';

    angular.module('pineappleclub.header-client', [
        'pineappleclub.authorisation-constant',
        'pineappleclub.device-sizes-constant',
        'pineappleclub.export-service',
        'pineappleclub.util-service'
    ])
    .controller('HeaderClientController', HeaderClientController);

    HeaderClientController.$inject = [
        '$timeout',
        '$rootScope',
        'AUTHORISATION',
        'DEVICE_SIZES',
        'ExportService',
        'UtilService'
    ];

    function HeaderClientController($timeout, $rootScope,
        AUTHORISATION, DEVICE_SIZES, ExportService, UtilService) {

        var that = this;

        that.configs = {
            IMG_BIGBANNER: "/images/tree-big.png",
            IMG_SMALLBANNER: "/images/tree-small.png"
        };        

        ExportService.addEventListener("resize",
            $.proxy(
                function () {
                    $timeout($.proxy(that.resize, that));
                }, that), false);

        $rootScope.$on("$stateChangeSuccess", function (event, next) {
            var allowedStates = _.filter(AUTHORISATION.STATES.states,
                                    function (state) { return state.name === "login" || state.name === "signout"; });

            that.isShown = (_.find(next.data.authorizedRoles, function (role) { return role === AUTHORISATION.USER_ROLES.admin; })
                                || _.find(allowedStates, function (state) { return state.name === next.name; }))
                                ? false : true;
        });
        
        that.isShown = true;

        resize();

        function resize() {
            that.banner = UtilService.device.isBreakpoint(DEVICE_SIZES.XS) ?
                            that.configs.IMG_SMALLBANNER : that.configs.IMG_BIGBANNER;
        };
    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.home', [])
        .controller('HomeController', HomeController);

    HomeController.$inject = [];

    function HomeController() {}

}());
(function () {

    'use strict';

    angular.module('pineappleclub.navigator', [
        'pineappleclub.app-configuration-service',
        'pineappleclub.navigator-service'
    ])
    .controller('NavigatorController', NavigatorController);

    NavigatorController.$inject = [
        'AppConfigurationService',
        'NavigatorService'
    ];

    function NavigatorController(AppConfigurationService, NavigatorService) {

        this.companyInfo = AppConfigurationService.companyInfo;
        this.menu = NavigatorService.pages.main;
        
        this.toggleSideBar = function() {
            $('.row-offcanvas').toggleClass('active');
        }
    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.photos', [
        'pineappleclub.app-configuration-service',
        'pineappleclub.plus-gallery-directive'
    ])
    .controller('PhotosController', PhotosController);

    PhotosController.$inject = [
        'AppConfigurationService'
    ];

    function PhotosController(AppConfigurationService) {

        var that = this;

        that.userId = AppConfigurationService.googlePlusUserId;

    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.side-bar', [
        'pineappleclub.app-configuration-service',
        'pineappleclub.navigator-service',
        'pineappleclub.device-height-directive'
    ])
    .controller('SideBarController', SideBarController);

    SideBarController.$inject = [
        'AppConfigurationService',
        'NavigatorService'
    ];

    function SideBarController(AppConfigurationService, NavigatorService) {
        var that = this;

        that.configs = {
            ELE_SIDEBAR: ".row-offcanvas",
            CONS_ACTIVE: "active",
            CSS_SIDEBARSHOW: "side-bar-show",
            CSS_SIDEBARHIDE: "side-bar-hide"
        };

        that.project = AppConfigurationService.companyInfo;
        that.menu = NavigatorService.pages.main;
        that.toggleSideBar = $.proxy(toggleSideBar, that);

        function toggleSideBar() {
            $(that.configs.ELE_SIDEBAR).toggleClass(that.configs.CONS_ACTIVE);
        }
    }

}());
(function () {

    'use strict';
    var USER_ROLES, STATES, AUTHORISATION;

    USER_ROLES = {
        admin: 'admin',
        all: '*'
    };

    STATES = {
        otherwise: '/',
        states:
            [
                {
                    name: 'home',
                    url: '/',
                    templateUrl: 'scripts/components/home/home.html',
                    controller: 'HomeController as home',
                    data: {
                        authorizedRoles: [USER_ROLES.all],
                        page: {
                            title: "Child Care Service",
                            description: "We provide high quality child care service supported by Integricare." +
                                            "The service is operated by experienced diploma qualification educator."
                        }
                    }
                },
                {
                    name: 'services',
                    url: '/services',
                    templateUrl: 'scripts/components/services/services.html',
                    data: {
                        authorizedRoles: [USER_ROLES.all],
                        page: {
                            title: "Family Day Care, Before/After school care, Vocation care",
                            description: "We provide Family Day Care, Before/After school care and Vocation care."
                        }
                    }
                },
                {
                    name: 'philosophy',
                    url: '/philosophy',
                    templateUrl: 'scripts/components/philosophy/philosophy.html',
                    data: {
                        authorizedRoles: [USER_ROLES.all],
                        page: {
                            title: "Unlocking child's full potential",
                            description: "We believe early learning is the key to unlocking a child's full potential."
                        }
                    }
                },
                {
                    name: 'photos',
                    url: '/photos',
                    templateUrl: 'scripts/components/photos/photos.html',
                    controller: 'PhotosController as photos',
                    data: {
                        authorizedRoles: [USER_ROLES.all],
                        page: {
                            title: "Playroom, Creative corner, Art and craft and outside playground",
                            description: "Our facilities are Playroom, Creative corner, Art and craft and outside playground."
                        }
                    }
                },
                {
                    name: 'contact',
                    url: '/contact',
                    templateUrl: 'scripts/components/contact/contact.html',
                    controller: 'ContactController as contact',
                    data: {
                        authorizedRoles: [USER_ROLES.all],
                        page: {
                            title: "Near Rockdale and Banksia train station",
                            description: "Our location is near Rockdale and Banksia train station."
                        }
                    }
                }
            ]
    };

    AUTHORISATION = {
        USER_ROLES: USER_ROLES,
        STATES: STATES
    };

    angular.module('pineappleclub.authorisation-constant', [])
    .constant('AUTHORISATION', AUTHORISATION);

}());
(function () {

    'use strict';

    var DEVICE_SIZES = {
        XS: "xs",
        S: "sm",
        M: "md",
        L: "lg"
    };

    angular.module('pineappleclub.device-sizes-constant', [])
    .constant('DEVICE_SIZES', DEVICE_SIZES);

}());
(function () {

    'use strict';

    angular.module('pineappleclub.device-height-directive', [
        'pineappleclub.export-service'
    ])
    .directive('pcdDeviceHeight', DeviceHeightDirective);

    DeviceHeightDirective.$inject = [
        'ExportService'
    ];

    function DeviceHeightDirective(ExportService) {

        var directive = {
            link: function (scope, element, attrs) {
                $(element).height($(ExportService).height());
            }
        }

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                directive.link(scope, element, attrs);
            }
        }

    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.google-map-directive', [])
    .directive('pcdGoogleMap', GoogleMapDirective);

    GoogleMapDirective.$inject = [
        'AppConfigurationService'
    ];

    function GoogleMapDirective(AppConfigurationService) {

        var directive = {
            link: function (scope, element, attrs) {
                var companyInfo = AppConfigurationService.companyInfo,
                    map, options;

                options = {
                    zoom: 17,
                    center: new google.maps.LatLng(companyInfo.location.lat, companyInfo.location.lng)
                };

                map = new google.maps.Map($(element).get(0), options);
            }
        }

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                directive.link(scope, element, attrs);
            }
        }

    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.plus-gallery-directive', [])
    .directive('pcdPlusGallery', GalleryPlusDirective);

    GalleryPlusDirective.$inject = [];

    function GalleryPlusDirective(ExportService) {

        var directive = {
            link: function (scope, element, attrs) {
                $(element).attr('data-userid', attrs.userid);

                $(element).plusGallery();
            }
        }

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                directive.link(scope, element, attrs);
            }
        }

    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.app-configuration-service', [])
    .factory('AppConfigurationService', AppConfigurationService);

    AppConfigurationService.$inject = [];

    function AppConfigurationService() {
        var configuration = {
            project: {
                name: 'Pineapple Club Website'
            },
            page: {
                titlePrefix: 'Pineapple Club'
            },
            googlePlusUserId: '102015599606810374225',
            companyInfo: {
                name: 'Pineapple Club Family Day Care',
                location: {
                    lat: -33.945967,
                    lng: 151.137092
                },
                contact: {
                    phone: '(02) 8041 8101',
                    mobile: '04 6625 0622',
                    email: 'mui@pineappleclub.com.au'
                }
            },
            progress: {
                color: '#1d9ad9'
            }
        };

        return configuration;
    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.auth-service', [])
    .factory('AuthService', AuthService);

    AuthService.$inject = [
        '$cookieStore',
        '$http'
    ];

    function AuthService($cookieStore, $http) {

        var authService = {
            login: login,
            logout: logout,
            authenticated: authenticated,
            isAuthenticated: isAuthenticated,
            isAuthorized: isAuthorized,
            getCurrentUser: getCurrentUser
        };

        return authService;

        function setCurrentUser(user) {
            $cookieStore.put('user', user);
        }

        function login(credentials) {
            return $http.post('/login', credentials)
                .then(function (res) {
                    var data = res.data;

                    if (data.success) {
                        setCurrentUser(data.user.local);
                    }

                    return data;
                });
        };

        function logout() {
            return $http.post('/logout')
                .then(function (res) {
                    var data = res.data;

                    if (data.success) {
                        $cookieStore.remove('user');
                    }

                    return data;
                });
        };

        function authenticated() {

            $cookieStore.remove('user');

            return $http.post('/authenticated')
                .then(function (res) {
                    var data = res.data;

                    if (data.success) {
                        setCurrentUser(data.user.local);
                    }

                    return data;
                });
        };

        function isAuthenticated() {
            return !!authService.getCurrentUser();
        };

        function isAuthorized(authorizedRoles) {
            var currentUser = authService.getCurrentUser()

            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }

            return (authService.isAuthenticated()
                    && authorizedRoles.indexOf(currentUser.userRole) !== -1);
        };

        function getCurrentUser() {
            var user = $cookieStore.get('user');

            return (user) ? user : null;
        }

    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.export-service', [])
    .factory('ExportService', ExportService);

    ExportService.$inject = [];

    function ExportService() {
        return window;
    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.navigator-service', [
        'pineappleclub.app-configuration-service'
    ])
    .factory('NavigatorService', NavigatorService);

    NavigatorService.$inject = ['AppConfigurationService'];

    function NavigatorService(AppConfigurationService) {
        var items = {
            home: { name: 'home', display: 'Home', path: '/' },
            services: { name: 'services', display: 'Services', path: '/services' },
            photos: { name: 'photos', display: 'Photos', path: '/photos' },
            philosophy: { name: 'philosophy', display: 'Philosophy', path: '/philosophy' },
            contact: { name: 'contact', display: 'Contact', path: '/contact' }
        },
        navigator = {
            items: items,
            pages: {
                main: {
                    name: 'main',
                    display: 'Menu',
                    items: [
                        items.home,
                        items.services,
                        items.photos,
                        items.philosophy,
                        items.contact
                    ]
                },
                about: {
                    name: 'about',
                    display: 'About',
                    items: [
                        items.contact,
                        items.philosophy
                    ]
                }
            }
        };


        return navigator;
    }

}());
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