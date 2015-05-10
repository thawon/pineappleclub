(function () {

    'use strict';

    angular.module('pineappleclub', [
        'ui.router',
        'breeze.angular',
        'ngResource',
        'ngProgress',
        'ngCookies',
        'pineappleclub.application',
        'pineappleclub.home',
        'pineappleclub.navigator',
        'pineappleclub.contact',
        'pineappleclub.photos',
        'pineappleclub.header-client',
        'pineappleclub.header-admin',
        'pineappleclub.footer',
        'pineappleclub.side-bar',
        'pineappleclub.dashboard',
        'pineappleclub.login',
        'pineappleclub.user-profile',
        'pineappleclub.authorisation-constant',
        'pineappleclub.state-change-service',
        'pineappleclub.auth-interceptor-service'
    ])
    .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider',
        'AUTHORISATION',
    function ($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider,
        AUTHORISATION) {

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

        $httpProvider.interceptors.push("AuthInterceptor");
    }])
    .run(['$rootScope', 'StateChangeService', 'ngProgress',
    function ($rootScope, StateChangeService, ngProgress) {

        $rootScope.$on("$stateChangeStart", function (event, next) {
            StateChangeService.change(next.data.authorizedRoles);
        });

        $rootScope.$on("$stateChangeSuccess", function (event, next) {
            ngProgress.complete();
        });

    }]);;

}());
(function () {

    'use strict';

    angular.module('pineappleclub.application', [
        'ngProgress',
        'pineappleclub.app-configuration-service',
        'pineappleclub.auth-service',
        'pineappleclub.user-service'
    ])
    .controller('ApplicationController', ApplicationController);

    ApplicationController.$inject = [
        'ngProgress',
        'AppConfigurationService',
        'AuthService',
        'UserService'
    ];

    function ApplicationController(ngProgress, AppConfigurationService,
        AuthService, UserService) {

        var that = this;

        that.setCurrentUser = function (user) {
            UserService.setCurrentUser(user);
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

    angular.module('pineappleclub.dashboard', [])
    .controller('DashboardController', DashboardController);

    DashboardController.$inject = [];

    function DashboardController() {

        var that = this;

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

    angular.module('pineappleclub.header-admin', [
        'pineappleclub.state-service',
        'pineappleclub.user-service',
        'pineappleclub.auth-service',
        'pineappleclub.auth-events-constant'
    ])
    .controller('HeaderAdminController', HeaderAdminController);

    HeaderAdminController.$inject = [
        '$rootScope',
        'AuthService',
        'StateService',
        'UserService',
        'AUTH_EVENTS'
    ];

    function HeaderAdminController($rootScope, AuthService, StateService,
        UserService, AUTH_EVENTS) {

        var that = this;

        that.getCurrentUser = UserService.getCurrentUser;

        that.logout = function () {
            AuthService.logout()
            .then(function (res) {
                UserService.setCurrentUser(null);

                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);

                StateService.changeState("signout");
            });
        }
    }

}());
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

    angular.module('pineappleclub.login', [
        'ngCookies',
        'pineappleclub.auth-service',
        'pineappleclub.state-service',
        'pineappleclub.user-service',
        'pineappleclub.auth-events-constant',
        'pineappleclub.string-constant'
    ])
        .controller('LoginController', LoginController);

    LoginController.$inject = [
        '$rootScope', 
        '$cookieStore',
        'AuthService',
        'StateService',
        'UserService',
        'AUTH_EVENTS',
        'STRING'
    ];

    function LoginController($rootScope, $cookieStore, AuthService,
        StateService, UserService, AUTH_EVENTS, STRING) {
        
        var that = this;

        that.credentials = {
            email: STRING.empty,
            password: STRING.empty
        };

        that.errorMessage = null;

        that.login = function (credentials) {
            AuthService.login(credentials)
            .then(function (res) {
                var user = AuthService.getCurrentUser();

                UserService.setCurrentUser(user);

                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

                goDashboard();
            });
        }

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function () {
            that.errorMessage = 'The email or password you entered is incorrect.';
        });

        if (AuthService.isAuthenticated()) {
            // use has signed in, redirect to home page
            goDashboard();
        }

        function goDashboard() {
            StateService.changeState('dashboard');
        }
    }

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
        
        this.toggleSideBar = function () {            
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

    angular.module('pineappleclub.user-profile', [])
    .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = [];

    function UserProfileController() {
        var that = this;

        that.updateFn = function () {
            console.log("A save here.");
        };

        that.updateFnB = function () {
            console.log("B save here.");
        };

        that.saveXX = function () {
            console.log("save here.");
        };
    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.user-profile', [
        'pineappleclub.entity-detail-container',
        'pineappleclub.expandable-container'
    ])
    .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = [
        'UserService'
    ];

    function UserProfileController(UserService) {
        var that = this;

        that.user = null;

        UserService.getUsers()
            .then(function (user) {
                that.user = user;
            });

        that.updateFn = function () {
            UserService.save();
        };

        that.updateFnB = function () {
            console.log('B save here.');
        };

        that.saveXX = function () {
            console.log('save here.');
        };
    }

}());
(function () {

    'use strict';

    var AUTH_EVENTS = {
        loginSuccess: "auth-login-success",
        loginFailed: "auth-login-failed",
        logoutSuccess: "auth-logout-success",
        logoutFailed: "auth-logout-failed",
        sessionTimeout: "auth-session-timeout",
        notAuthenticated: "auth-not-authenticated",
        notAuthorized: "auth-not-authorized"
    };

    angular.module('pineappleclub.auth-events-constant', [])
    .constant('AUTH_EVENTS', AUTH_EVENTS);

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
                },
                {
                    name: 'dashboard',
                    url: '/dashboard',
                    templateUrl: 'scripts/components/dashboard/dashboard.html',
                    controller: 'DashboardController as dashboard',
                    data: {
                        authorizedRoles: [USER_ROLES.admin],
                        page: {
                            title: "Admin Dashboard",
                            description: ""
                        }
                    }
                },
                {
                    name: 'login',
                    url: '/login',
                    templateUrl: 'scripts/components/login/login.html',
                    controller: 'LoginController as login',
                    data: {
                        authorizedRoles: [USER_ROLES.all],
                        page: {
                            title: "Login",
                            description: "admin user authentication"
                        }
                    }
                },
                {
                    name: 'signout',
                    url: '/signout',
                    templateUrl: 'scripts/components/signout/signout.html',
                    data: {
                        authorizedRoles: [USER_ROLES.all],
                        page: {
                            title: "Signout",
                            description: "User is signed out"
                        }
                    }
                },
                {
                    name: 'user-profile',
                    url: '/user-profile',
                    templateUrl: 'scripts/components/user-profile/user-profile.html',
                    controller: 'UserProfileController as userProfile',
                    data: {
                        authorizedRoles: [USER_ROLES.all],
                        page: {
                            title: "User Profile Details",
                            description: "View/Edit user profile"
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

    var STRING = {
        empty: ""
    };

    angular.module('pineappleclub.string-constant', [])
    .constant('STRING', STRING);

}());
(function () {

    'use strict';

    var VIEW_MODES = {
        show: "show",
        edit: "edit"
    };

    angular.module('pineappleclub.view-modes-constant', [])
    .constant('VIEW_MODES', VIEW_MODES);

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

    angular.module('pineappleclub.entity-detail-container', [
        'pineappleclub.view-modes-constant'
    ])
    .directive('pcdEntityDetailContainer', EntityDetailContainerDirective);

    EntityDetailContainerDirective.$inject = [
        'VIEW_MODES'
    ];

    function EntityDetailContainerDirective(VIEW_MODES) {

        return {
            restrict: "E",
            transclude: true,
            scope: {
                updateFn: "&"
            },
            link: function (scope, element, attrs) {
                var getViews = function () {
                    var $this = $(element),
                        views = $this.find(".view-detail").find("[data-mode]");

                    return views;
                },
                changeMode = function (mode) {
                    return function () {
                        var $this = $(element),
                            views = getViews(),
                            view = $this.find(".view-detail").find("[data-mode='" + mode + "']");

                        $(views).hide();
                        $(view).show();

                        scope.mode = mode;
                    }
                },
                showDefaultView = function () {
                    var $this = $(element),
                        views = getViews(),
                        view = $this.find(".view-detail").find("[default]");

                    views.hide();
                    view.show();

                    scope.mode = $(view).attr("data-mode");
                };

                scope.edit = changeMode(VIEW_MODES.edit);
                scope.cancel = changeMode(VIEW_MODES.show);

                showDefaultView();
            },
            templateUrl: "scripts/directives/entity-detail-container/entity-detail-container.html"
        }

    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.expandable-container', [])
    .directive('pcdExpandableContainer', ExpandableContainer);

    ExpandableContainer.$inject = [];

    function ExpandableContainer() {

        return {
            restrict: "E",
            transclude: true,
            scope: {},
            link: function (scope, element, attrs) {

                scope.expandable = "/images/expand.png";
                element.find(".exp-header").html(attrs.header);

                scope.toggle = function () {
                    var $this = $(element),
                        $collapse = $this.find(".collapse-group").find(".collapse");

                    scope.expandable = $collapse.hasClass("collapse in")
                                        ? "/images/expand.png"
                                        : "/images/collapse.png";

                    $collapse.collapse("toggle");
                }
            },
            templateUrl: "scripts/directives/expandable-container/expandable-container.html"
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

    angular.module('pineappleclub.auth-interceptor-service', [
        'pineappleclub.auth-events-constant'
    ])
    .factory('AuthInterceptor', AuthInterceptor);

    AuthInterceptor.$inject = [
        "$rootScope",
        "$q",
        'AUTH_EVENTS'
    ];

    function AuthInterceptor($rootScope, $q, AUTH_EVENTS) {
        return {
            responseError: function (res) {
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                    403: AUTH_EVENTS.notAuthorized,
                    419: AUTH_EVENTS.sessionTimeout,
                    440: AUTH_EVENTS.sessionTimeout
                }[res.status], res);
                return $q.reject(res);
            }
        };
    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.auth-service', [
        'ngCookies'
    ])
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
            localStorage.setItem('user', JSON.stringify(user));
        }

        function login(credentials) {
            return $http.post('/api/login', credentials)
                .then(function (res) {
                    var data = res.data;

                    if (data.success) {
                        setCurrentUser(data.user);
                    }

                    return data;
                });
        };

        function logout() {
            return $http.post('/api/logout')
                .then(function (res) {
                    var data = res.data;

                    if (data.success) {
                        localStorage.removeItem('user');
                    }

                    return data;
                });
        };

        function authenticated() {

            localStorage.removeItem('user');

            return $http.post('/api/authenticated')
                .then(function (res) {
                    var data = res.data;
                    if (data.success) {
                        setCurrentUser(data.user);
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
            var user = localStorage.getItem('user');

            return (user) ? JSON.parse(user) : null;
        }

    }

}());
/*
 * Server delivers a new Breeze EntityManager on request.
 *
 * During service initialization:
 * - configures Breeze for use by this app
 * - gets entity metadata and sets up the client entity model
 * - configures the app to call the server during service initialization
 */
(function() {
    'use strict';

    angular.module('pineappleclub.entity-manager-factory', [
        'pineappleclub.model'
    ])
    .factory('EntityManagerFactory', EntityManagerFactory);

    EntityManagerFactory.$inject = [
        'breeze',
        'model'
    ];

    function EntityManagerFactory(breeze, model) {
        var dataService, masterManager, metadataStore, service;

        configureBreezeForThisApp();
        metadataStore = getMetadataStore();

        service =  {
            getManager: getManager, // get the 'master manager', creating if necessary
            newManager: newManager  // creates a new manager, not the 'master manager'
        };
        return service;
        /////////////////////

        function configureBreezeForThisApp() {
            breeze.config.initializeAdapterInstance('dataService', 'mongo', true);
            initBreezeAjaxAdapter('0');
            dataService = new breeze.DataService({ serviceName: 'api' })
        }

        // get the 'master manager', creating it if necessary
        function getManager(){
            return masterManager || (masterManager = service.newManager());
        }

        function getMetadataStore() {
            // get the metadataStore for the Zza entity model
            // and associate it with the app's Node 'dataService'
            var store = model.getMetadataStore();
            store.addDataService(dataService);
            return store;
        }

        function initBreezeAjaxAdapter(userSessionId) {
            // get the current default Breeze AJAX adapter
            var ajaxAdapter = breeze.config.getAdapterInstance('ajax');
            ajaxAdapter.defaultSettings = {
                headers: {
                    'X-UserSessionId': userSessionId
                },
                timeout: 10000
            };
        }

        // create a new manager, not the 'master manager'
        function newManager() {
            return new breeze.EntityManager({
                dataService: dataService,
                metadataStore: metadataStore
            });
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
/**
 * Fill metadataStore with metadata, crafted by hand using
 * Breeze Labs: breeze.metadata.helper.js
 * @see http://www.breezejs.com/documentation/metadata-by-hand
 */
(function() {
    'use strict';

    angular.module("pineappleclub.meta-data", [])
    .factory('metadata', factory);

    factory.$inject = [
        'breeze'
    ];

    function factory(breeze) {
        return {
            createMetadataStore: createMetadataStore
        };
        /////////////////////
        function createMetadataStore() {

            var namingConvention = createNamingConvention();

            var store = new breeze.MetadataStore({ namingConvention: namingConvention });

            fillMetadataStore(store);

            return store;
        }

        function createNamingConvention() {
            // Translate certain zza property names between MongoDb names and client names
            var convention = new breeze.NamingConvention({
                serverPropertyNameToClient: function(serverPropertyName) {
                    switch (serverPropertyName) {
                        case '_id':   return 'id';
                        default: return serverPropertyName;
                    }
                },
                clientPropertyNameToServer: function(clientPropertyName) {
                    switch (clientPropertyName) {
                        case 'id':   return '_id';
                        default: return clientPropertyName;
                    }
                }
            });
            return convention;
        }

        function fillMetadataStore(store) {
            // Using Breeze Labs: breeze.metadata.helper.js
            // https://github.com/IdeaBlade/Breeze/blob/master/Breeze.Client/Scripts/Labs/breeze.metadata-helper.js
            // The helper reduces data entry by applying common conventions
            // and converting common abbreviations (e.g., 'type' -> 'dataType')

            // 'None' (client-generated) is the default key generation strategy for this app
            var keyGen = breeze.AutoGeneratedKeyType.None;

            // namespace of the corresponding classes on the server
            var namespace = 'Zza.Model';

            var helper = new breeze.config.MetadataHelper(namespace, keyGen);

            /*** Convenience fns and vars ***/

            // addType - make it easy to add the type to the store using the helper
            var addType = function (type) { helper.addTypeToStore(store, type); };

            // DataTypes
            var DT = breeze.DataType;
            var BOOL = DT.Boolean;
            var DATE = DT.DateTime;
            var DECIMAL = DT.Decimal;
            var LUID = DT.Int32; // "Lookup" Id
            var ID = DT.MongoObjectId; // Root entity Id

            addUser();

            function addUser() {
                addType({
                    name: 'User',
                    dataProperties: {
                        id: { type: ID },
                        firstname: { max: 100 },
                        lastname: { max: 100 }
                    }
                });
            }

        }
    }

}());
/**
 * The application data model describes all of the model classes,
 * the documents (entityTypes) and sub-documents (complexTypes)
 *
 * The metadata (see metadata.js) cover most of the model definition.
 * Here we supplement the model classes with (non-persisted) add/remove methods,
 * property aliases, and sub-document navigation properties that can't be
 * represented (yet) in Breeze metadata.
 *
 * This enrichment takes place once the metadata become available.
 * See `configureMetadataStore()`
 */
(function () {

    'use strict';

    angular.module('pineappleclub.model', [
        'pineappleclub.meta-data'
    ])
    .factory('model', factory);

    factory.$inject = [
        'breeze',
        'metadata'
    ];

    function factory(breeze, metadata) {
        var model = {
            getMetadataStore: getMetadataStore,
            User: User
        };

        return model;

        /////////////////////
        // Model classes
        function User() { }

        // Fill metadataStore with metadata, then enrich the types
        // with add/remove methods, property aliases, and sub-document navigation properties
        // that can't be represented (yet) in Breeze metadata.
        // See OrderItem.product for an example of such a 'synthetic' navigation property
        function getMetadataStore() {

            var metadataStore = metadata.createMetadataStore();

            // convenience method for registering model types with the store
            // these model types contain extensions to the type definitions from metadata.js
            var registerType = metadataStore.registerEntityTypeCtor.bind(metadataStore);

            registerUser();

            return metadataStore;
            ///////////////////////////////

            function registerUser() {
                registerType('User', User);
            }
                        
        }
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

    angular.module('pineappleclub.state-change-service', [
        'ngProgress',
        'pineappleclub.state-service',
        'pineappleclub.auth-service',
        'pineappleclub.auth-events-constant',
        'pineappleclub.authorisation-constant'
    ])
    .factory('StateChangeService', StateChangeService);

    StateChangeService.$inject = [
        '$rootScope',
        'AuthService',
        'StateService',
        'AUTH_EVENTS',
        'AUTHORISATION',
        'ngProgress'
    ];

    function StateChangeService($rootScope, AuthService, StateService, 
        AUTH_EVENTS, AUTHORISATION, ngProgress) {

        var stateChangeService = {
            change: change
        };

        return stateChangeService;

        function change(authorizedRoles) {

            if (authorizedRoles[0] === AUTHORISATION.USER_ROLES.all
                || AuthService.isAuthorized(authorizedRoles)) {

                ngProgress.start();

            } else {

                StateService.changeState('login');

                if (AuthService.isAuthenticated()) {
                    // user is not allowed
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                } else {
                    // user is not logged in
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
            }

        }

    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.state-service', [
        'pineappleclub.authorisation-constant'
    ])
    .factory('StateService', StateService);

    StateService.$inject = [
        '$location',
        'AUTHORISATION'
    ];

    function StateService($location, AUTHORISATION) {
        var stateService = {
            changeState: changeState
        };

        return stateService;

        function changeState(name) {
            var target = _.first(_.where(AUTHORISATION.STATES.states, { name: name }));

            $location.path(target.url)
        };
    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.user-service', [
        'pineappleclub.entity-manager-factory',
        'pineappleclub.model'
    ])
    .factory('UserService', UserService);

    UserService.$inject = [
        'EntityManagerFactory',
        'model'
    ];

    function UserService(EntityManagerFactory, model) {
        var currentUser,
            manager = EntityManagerFactory.getManager(),
            userService = {
            getCurrentUser: function () {
                return currentUser;
            },
            setCurrentUser: function (user) {
                currentUser = user;
            },
            getUsers: getUsers,
            save: save
        }

        return userService;

        function getUsers() {
            //var users = manager.getEntities('User');

            return breeze.EntityQuery.from('User')
                    .where('id', 'eq', '54603b40496fba9c2301f5db')
                    //.orderBy('firstname desc')
                    .using(manager).execute()
                    .then(function (data) {
                        return data.results[0];
                    })
                    .catch(function (error) {
                        var x;
                        x = 1;
                    });
            
        }

        function save() {
            return manager.saveChanges()
                .then(function (saveResult) {
                    var x;
                    x = 1;
                })
                .catch(function (error) {
                    var x;
                    x = 1;
                });
        }
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