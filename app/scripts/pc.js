(function () {

    'use strict';

    angular.module('pineappleclub', [
        'ui.router',
        'breeze.angular',
        'ngResource',
        'ngProgress',
        'ngCookies',
        'toaster',
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
        'pineappleclub.user-profile-list',
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
    .run(['breeze', '$rootScope', 'StateChangeService', 'ngProgress',
    function (breeze, $rootScope, StateChangeService, ngProgress) {

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
        'pineappleclub.user-service',
        'pineappleclub.user-profile-service'
    ])
    .controller('ApplicationController', ApplicationController);

    ApplicationController.$inject = [
        'ngProgress',
        'AppConfigurationService',
        'AuthService',
        'UserService',
        'UserProfileService'
    ];

    function ApplicationController(ngProgress, AppConfigurationService,
        AuthService, UserService, UserProfileService) {

        var that = this;
        
        // setting progress bar color
        ngProgress.color(AppConfigurationService.progress.color);

        // check if the user are still logged in from last session.
        AuthService.authenticated()
        .then(function (data) {
            var user;

            if (!data.success)
                return;

            user = data.user;

            // set current user for now so that dashboard can use user-role to verify the page permission
            UserService.setCurrentUser(user);

            // fetch using breezejs manager so the entity is added to the graph            
            UserProfileService.getUser(user._id)
            .then(function (user) {

                // current user is user entity, not a plain javascript object
                UserService.setCurrentUser(user);
            })

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

    angular.module('pineappleclub.dashboard', [
        'pineappleclub.authorisation-constant',
        'pineappleclub.user-service'
    ])
    .controller('DashboardController', DashboardController);

    DashboardController.$inject = [
        'AUTHORISATION',
        'UserService'
    ];

    function DashboardController(AUTHORISATION, UserService) {
        var that = this,
            states, currentUser;

        that.currentUser = UserService.getCurrentUser();

        states = _.filter(AUTHORISATION.STATES.states,
            function (state) {
                return (state.data.authorizedRoles.indexOf(that.currentUser.userRole) !== -1)
                        && state.name !== 'dashboard';
            });

        that.states = states;
    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.footer', [
        'pineappleclub.authorisation-constant'
    ])
    .controller('FooterController', FooterController);

    FooterController.$inject = [
        'AUTHORISATION'
    ];

    function FooterController(AUTHORISATION) {
        var that = this,
            states;

        states = _.filter(AUTHORISATION.STATES.states,
            function (state) {
                return state.name === 'philosophy'
                    || state.name === 'contact';
            });


        that.states = states;
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
        'pineappleclub.auth-service',
        'pineappleclub.state-service',
        'pineappleclub.user-service',
        'pineappleclub.auth-events-constant',
        'pineappleclub.string-constant',
        'pineappleclub.user-profile-service'
    ])
        .controller('LoginController', LoginController);

    LoginController.$inject = [
        '$rootScope', 
        'AuthService',
        'StateService',
        'UserService',
        'AUTH_EVENTS',
        'STRING',
        'UserProfileService',
        'toaster'
    ];

    function LoginController($rootScope, AuthService, StateService,
        UserService, AUTH_EVENTS, STRING, UserProfileService, toaster) {
        
        var that = this,
            waitToastId = 'waitingId',
            successtoasterOptions = {
                type: 'success',
                body: 'logged in successfully',
                timeout: 2000
            },
            waitToasterOptions = {
                type: 'wait',
                body: 'logging in...',
                toastId: waitToastId,
                toasterId: waitToastId
            },
            errorToasterOptions = {
                type: 'error',
                body: 'logged in unsuccessfully'
            };

        that.credentials = {
            email: STRING.empty,
            password: STRING.empty
        };

        that.errorMessage = null;

        that.login = function (credentials) {

            AuthService.login(credentials)
            .then(function (user) {

                toaster.pop(waitToasterOptions);

                // fetch using breezejs manager so the entity is added to the graph            
                UserProfileService.getUser(user._id)
                .then(function (user) {

                    toaster.clear(waitToastId, waitToastId);

                    // current user is user entity, not a plain javascript object
                    UserService.setCurrentUser(user);

                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

                    goDashboard();

                    toaster.pop(successtoasterOptions);
                })
                
            });
        }

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function () {
            toaster.clear(waitToastId, waitToastId);

            toaster.pop(errorToasterOptions);

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
        'pineappleclub.authorisation-constant'
    ])
    .controller('NavigatorController', NavigatorController);

    NavigatorController.$inject = [
        'AppConfigurationService',
        'AUTHORISATION'
    ];

    function NavigatorController(AppConfigurationService, AUTHORISATION) {
        var that = this,
            states;
        
        states = _.filter(AUTHORISATION.STATES.states,
            function (state) {
                return state.name === 'home'
                    || state.name === 'services'
                    || state.name === 'philosophy'
                    || state.name === 'photos'
                    || state.name === 'contact';
            });

        that.companyInfo = AppConfigurationService.companyInfo;
        that.states = states;
        
        that.toggleSideBar = function () {
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
        'pineappleclub.device-height-directive',
        'pineappleclub.app-configuration-service',
        'pineappleclub.auth-service',
        'pineappleclub.authorisation-constant',
        'pineappleclub.auth-events-constant'
    ])
    .controller('SideBarController', SideBarController);

    SideBarController.$inject = [
        '$rootScope',
        'AppConfigurationService',
        'AuthService',
        'AUTHORISATION',
        'AUTH_EVENTS'
    ];

    function SideBarController($rootScope, AppConfigurationService, AuthService,
        AUTHORISATION, AUTH_EVENTS) {

        var that = this,
            states;

        that.configs = {
            ELE_SIDEBAR: ".row-offcanvas",
            CONS_ACTIVE: "active",
            CSS_SIDEBARSHOW: "side-bar-show",
            CSS_SIDEBARHIDE: "side-bar-hide"
        };
        
        states = _.filter(AUTHORISATION.STATES.states,
            function (state) {
                return state.name === 'home'
                    || state.name === 'services'
                    || state.name === 'philosophy'
                    || state.name === 'photos'
                    || state.name === 'contact';
            });

        that.dashboardState = _.filter(AUTHORISATION.STATES.states,
            function (state) {
                return state.name === 'dashboard'
            })[0];

        that.project = AppConfigurationService.companyInfo;
        that.states = states;
        that.isShownDashboard = AuthService.isAuthenticated();
        that.toggleSideBar = $.proxy(toggleSideBar, that);

        $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
            that.isShownDashboard = true;
        });

        $rootScope.$on(AUTH_EVENTS.authenticated, function () {
            that.isShownDashboard = true;
        });

        $rootScope.$on(AUTH_EVENTS.logoutSuccess, function () {
            that.isShownDashboard = false;
        });

        function toggleSideBar() {
            $(that.configs.ELE_SIDEBAR).toggleClass(that.configs.CONS_ACTIVE);
        }        
    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.user-profile-list', [])
    .controller('UserProfileListController', UserProfileListController);

    UserProfileListController.$inject = [];

    function UserProfileListController() {
        var that = this;

       
    }

}());
(function () {

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
                            firstname: { required: true, max: 50 },
                            lastname: { required: true, max: 50 },
                            userRole: { required: true, max: 10 },
                            lastLoggedInDateTime: { type: type.DateTime },
                            email: { required: true, max: 255 }
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
(function () {

    'use strict';

    angular.module('pineappleclub.user-profile-service', [
        'pineappleclub.entity-manager-factory'
    ])
    .factory('UserProfileService', UserProfileService);

    UserProfileService.$inject = [
        'EntityManagerFactory'        
    ];

    function UserProfileService(EntityManagerFactory, UserService) {
        var manager = EntityManagerFactory.getManager(),
            userProfileService = {
                getUser: getUser
            }

        return userProfileService;

        function getUser(id) {
            return manager.fetchEntityByKey('User', id)
                .then(function (data) {
                    return data.entity;
                })
                .catch(function (error) {
                    console.log(error)
                });

        }

    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.user-profile', [
        'pineappleclub.entity-detail-container',
        'pineappleclub.expandable-container',
        'pineappleclub.user-profile-service',
        'pineappleclub.data-service',
        'pineappleclub.user-service'
    ])
    .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = [
        'UserProfileService',
        'DataService',
        'UserService'
    ];

    function UserProfileController(UserProfileService, DataService, UserService) {
        var that = this;

        that.user = UserService.getCurrentUser();

        that.save = DataService.saveChanges();

        that.validate = validate;

        that.cancel = cancel;

        function validate() {
            var user = that.user,
                errors = user.entityAspect.getValidationErrors(),
                result = {
                    hasError: (errors.length > 0) ? true : false,
                    Errors: _.pluck(errors, 'errorMessage')
                };

            return result;
        }

        function cancel() {
            that.user.entityAspect.rejectChanges();
        }

    }

}());
(function () {

    'use strict';

    var AUTH_EVENTS = {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        logoutFailed: 'auth-logout-failed',
        sessionTimeout: 'auth-session-timeout',
        authenticated: 'auth-authenticated',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
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
                    display: 'Home',
                    url: '/',
                    templateUrl: 'scripts/components/home/home.html',
                    controller: 'HomeController as home',
                    data: {
                        authorizedRoles: [USER_ROLES.all],
                        page: {
                            title: 'Child Care Service',
                            description: 'We provide high quality child care service supported by Integricare.' +
                                            'The service is operated by experienced diploma qualification educator.'
                        }
                    }
                },
                {
                    name: 'services',
                    display: 'Services',
                    url: '/services',
                    templateUrl: 'scripts/components/services/services.html',
                    data: {
                        authorizedRoles: [USER_ROLES.all],
                        page: {
                            title: 'Family Day Care, Before/After school care, Vocation care',
                            description: 'We provide Family Day Care, Before/After school care and Vocation care.'
                        }
                    }
                },
                {
                    name: 'philosophy',
                    display: 'Philosophy',
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
                    display: 'Photos',
                    url: '/photos',
                    templateUrl: 'scripts/components/photos/photos.html',
                    controller: 'PhotosController as photos',
                    data: {
                        authorizedRoles: [USER_ROLES.all],
                        page: {
                            title: 'Playroom, Creative corner, Art and craft and outside playground',
                            description: 'Our facilities are Playroom, Creative corner, Art and craft and outside playground.'
                        }
                    }
                },
                {
                    name: 'contact',
                    display: 'Contact',
                    url: '/contact',
                    templateUrl: 'scripts/components/contact/contact.html',
                    controller: 'ContactController as contact',
                    data: {
                        authorizedRoles: [USER_ROLES.all],
                        page: {
                            title: 'Near Rockdale and Banksia train station',
                            description: 'Our location is near Rockdale and Banksia train station.'
                        }
                    }
                },
                {
                    name: 'dashboard',
                    display: 'Dashboard',
                    url: '/dashboard',
                    templateUrl: 'scripts/components/dashboard/dashboard.html',
                    controller: 'DashboardController as dashboard',
                    data: {
                        authorizedRoles: [USER_ROLES.admin],
                        page: {
                            title: 'Admin Dashboard',
                            description: ''
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
                            title: 'Login',
                            description: 'admin user authentication'
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
                            title: 'Signout',
                            description: 'User is signed out'
                        }
                    }
                },
                {
                    name: 'user-profile',
                    display: 'My Profile',
                    url: '/user-profile',
                    templateUrl: 'scripts/components/user-profile/user-profile.html',
                    controller: 'UserProfileController as userProfile',
                    data: {
                        authorizedRoles: [USER_ROLES.admin],
                        page: {
                            title: 'User Profile Details',
                            description: 'View/Edit user profile'
                        }
                    },
                    icon: '/images/user-profile.png'
                },
                {
                    name: 'user-profile-list',
                    display: 'Users',
                    url: '/user-profile-list',
                    templateUrl: 'scripts/components/user-profile-list/user-profile-list.html',
                    controller: 'UserProfileListController as userProfileList',
                    data: {
                        authorizedRoles: [USER_ROLES.admin],
                        page: {
                            title: 'Users',
                            description: 'List of users'
                        }
                    },
                    icon: '/images/user-profile-list.png'
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
        'pineappleclub.view-modes-constant',
        'pineappleclub.export-service'
    ])
    .directive('pcdEntityDetailContainer', EntityDetailContainerDirective);

    EntityDetailContainerDirective.$inject = [
        'toaster',
        'VIEW_MODES',
        'ExportService'
    ];

    function EntityDetailContainerDirective(toaster, VIEW_MODES, ExportService) {

        return {
            restrict: 'E',
            transclude: true,
            scope: {
                saveFn: '&',
                validateFn: '&',
                cancelFn: '&'
            },
            link: function (scope, element, attrs) {
                var errorDiv = element.find('.view-detail-error');

                scope.edit = changeMode(VIEW_MODES.edit);
                scope.cancel = cancel;

                scope.save = save(afterSave);

                scope.saveAndClose = save(afterSaveAndClose);

                showDefaultView();

                function afterSave() {
                    changeMode(VIEW_MODES.show)();
                }

                function afterSaveAndClose() {
                    ExportService.history.back();
                }

                function getViews() {
                    var $this = $(element),
                        views = $this.find('.view-detail').find('[data-mode]');

                    return views;
                }

                function changeMode(mode) {
                    return function () {
                        var $this = $(element),
                            views = getViews(),
                            view = $this.find('.view-detail').find("[data-mode='" + mode + "']");

                        $(views).hide();
                        $(view).show();

                        scope.mode = mode;
                    }
                }

                function showDefaultView() {
                    var $this = $(element),
                        views = getViews(),
                        view = $this.find('.view-detail').find('[default]');

                    views.hide();
                    view.show();

                    scope.mode = $(view).attr('data-mode');
                }

                function save(after) {
                    return function () {
                        var waitToastId = 'waitingId',
                            errorToasterId = 'errorId',
                            successtoasterOptions = {
                                type: 'success',
                                body: 'saved successfully',
                                timeout: 2000
                            },
                            waitToasterOptions = {
                                type: 'wait',
                                body: 'saving...',
                                toastId: waitToastId,
                                toasterId: waitToastId
                            },
                            errorToasterOptions = {
                                type: 'error',
                                body: 'saved unsuccessfully'
                            };
                        
                        var error = scope.validateFn();

                        if (error.hasError) {

                            toaster.pop(errorToasterOptions);

                            showErrorMessage(error.Errors);

                            return;
                        }

                        errorDiv.html('');

                        toaster.pop(waitToasterOptions);

                        scope.saveFn()
                            .then(function (saveResult) {
                                toaster.clear(waitToastId, waitToastId);
                                
                                toaster.pop(successtoasterOptions);

                                after();

                                return saveResult;
                            })
                            .catch(function (error) {
                                toaster.clear(waitToastId, waitToastId);

                                toaster.pop(errorToasterOptions);
                                
                                console.log(error);

                                return error;
                            });
                    }
                }

                function cancel() {
                    scope.cancelFn();
                    changeMode(VIEW_MODES.show)();
                }

                function showErrorMessage(errors) {
                    var message = errors.join('</br>');

                    errorDiv.html(message);
                }

            },
            templateUrl: 'scripts/directives/entity-detail-container/entity-detail-container.html'
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

                scope.expandable = "/images/collapse.png";
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
            },
            getServiceName: getServiceName,
            breezejs: {
                httpTimeout: 10000
            }
        };

        return configuration;

        function getServiceName(endpoint) {
            return 'api' + endpoint
        }
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
        'pineappleclub.cookie-service',
        'pineappleclub.app-configuration-service'
    ])
    .factory('AuthService', AuthService);

    AuthService.$inject = [
        // Cookie Service is used instead of $cookieStore because it does not work after load the breezejs library        
        'CookieService',
        '$http',
        'AppConfigurationService'
    ];

    function AuthService(CookieService, $http, AppConfigurationService) {

        var authService = {
                login: login,
                logout: logout,
                authenticated: authenticated,
                isAuthenticated: isAuthenticated,
                isAuthorized: isAuthorized,
                getCurrentUser: getCurrentUser
            },
            serviceName = AppConfigurationService.getServiceName;

        return authService;
        
        function setCurrentUser(user) {
            var cookie = {
                id: user.id,
                userRole: user.userRole
            };

            CookieService.setCookie('user', cookie);
        }

        function login(credentials) {
            return $http.post(serviceName('/login'), credentials)
                .then(function (res) {
                    var data = res.data;

                    setCurrentUser(data.user);

                    return data.user;

                });
        };

        function logout() {
            return $http.post(serviceName('/logout'))
                .then(function (res) {
                    var data = res.data;

                    if (data.success) {                        
                        CookieService.removeCookie('user');
                    }

                    return data;
                });
        };

        function authenticated() {

            CookieService.removeCookie('user');
            
            return $http.post(serviceName('/authenticated'))
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
            return CookieService.getCookie('user');
        }

    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.cookie-service', [])
    .factory('CookieService', CookieService);

    CookieService.$inject = [];

    function CookieService() {

        var cookieService = {
            getCookie: getCookie,
            setCookie: setCookie,
            removeCookie: removeCookie
        };

        return cookieService;

        function getCookie(name) {
            var cookie = localStorage.getItem(name);

            return (cookie) ? JSON.parse(cookie) : null;
        }

        function setCookie(name, cookie) {
            localStorage.setItem(name, JSON.stringify(cookie));
        }

        function removeCookie(name) {
            localStorage.removeItem(name);
        }

    }

}());
(function () {

    'use strict';

    angular.module('pineappleclub.data-service', [
        'pineappleclub.entity-manager-factory'
    ])
    .factory('DataService', DataService);

    DataService.$inject = [
        'EntityManagerFactory'
    ];

    function DataService(EntityManagerFactory) {
        var manager = EntityManagerFactory.getManager(),
            dataService = {                
                saveChanges: saveChanges
            }

        return dataService;

        function saveChanges(fn) {
            return function () {
                return manager.saveChanges();
            }
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
        'pineappleclub.model',
        'pineappleclub.app-configuration-service'
    ])
    .factory('EntityManagerFactory', EntityManagerFactory);

    EntityManagerFactory.$inject = [
        'model',
        'AppConfigurationService'
    ];

    function EntityManagerFactory(model, AppConfigurationService) {
        var dataService, masterManager, metadataStore, service,
            config = AppConfigurationService.breezejs;

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
            dataService = new breeze.DataService({ serviceName: AppConfigurationService.getServiceName('') })
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
                timeout: config.httpTimeout
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

    angular.module("pineappleclub.meta-data", [
        'pineappleclub.user-model'
    ])
    .factory('metadata', Metadata);

    Metadata.$inject = [
        'UserModelService'
    ];

    function Metadata(UserModelService) {
        return {
            createMetadataStore: createMetadataStore
        };
        /////////////////////
        function createMetadataStore() {

            var namingConvention = createNamingConvention();

            var store = new breeze.MetadataStore({ namingConvention: namingConvention });

            fillMetadataStore(store, UserModelService);

            return store;
        }

        function createNamingConvention() {
            // Translate certain property names between MongoDb names and client names
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

        function fillMetadataStore(store, UserModelService) {
            // Using Breeze Labs: breeze.metadata.helper.js
            // https://github.com/IdeaBlade/Breeze/blob/master/Breeze.Client/Scripts/Labs/breeze.metadata-helper.js
            // The helper reduces data entry by applying common conventions
            // and converting common abbreviations (e.g., 'type' -> 'dataType')

            // 'None' (client-generated) is the default key generation strategy for this app
            var keyGen = breeze.AutoGeneratedKeyType.None;

            // namespace of the corresponding classes on the server
            var namespace = 'Pineapple.Model';

            var helper = new breeze.config.MetadataHelper(namespace, keyGen);

            /*** Convenience fns and vars ***/

            // addType - make it easy to add the type to the store using the helper
            var addType = function (type) { helper.addTypeToStore(store, type); };
            
            addType(UserModelService.getType());

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
        'pineappleclub.meta-data',
        'pineappleclub.user-model'
    ])
    .factory('model', factory);

    factory.$inject = [
        'metadata',
        'UserModelService'
    ];

    function factory(metadata, UserModelService) {

        var model = {
            getMetadataStore: getMetadataStore
        };

        return model;
        
        // Fill metadataStore with metadata, then enrich the types
        // with add/remove methods, property aliases, and sub-document navigation properties
        // that can't be represented (yet) in Breeze metadata.
        // See OrderItem.product for an example of such a 'synthetic' navigation property
        function getMetadataStore() {

            var metadataStore = metadata.createMetadataStore();

            // convenience method for registering model types with the store
            // these model types contain extensions to the type definitions from metadata.js
            var registerType = metadataStore.registerEntityTypeCtor.bind(metadataStore);

            registerType('User', UserModelService.model);

            return metadataStore;
                        
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

    angular.module('pineappleclub.user-service', [])
    .factory('UserService', UserService);

    UserService.$inject = [];

    function UserService() {

        // current user stores breeze user entity
        var currentUser,
            userService = {
            getCurrentUser: function () {
                return currentUser;
            },
            setCurrentUser: function (user) {
                currentUser = user;
            }
        }

        return userService;
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
                },
                defineProperty: defineProperty
            };

        return util;

        function isBreakpoint (size) {
            return $('.device-' + size).is(':visible');
        }

        // Assist in adding an ECMAScript 5 "definedProperty" to a class
        function defineProperty(klass, propertyName, getter, setter) {
            var config = {
                enumerable: true,
                get: getter
            };
            if (setter) {
                config.set = setter;
            }
            Object.defineProperty(klass.prototype, propertyName, config);
        }
    }

}());