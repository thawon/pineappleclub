(function () {

    'use strict';

    angular.module('pineappleclub', [
        'ui.router',
        'breeze.angular',
        'ngResource',
        'ngProgress',
        'ngCookies',
        'ncy-angular-breadcrumb',
        'toaster',
        'angularUtils.directives.dirPagination',
        'pineappleclub.application',
        'pineappleclub.home',
        'pineappleclub.navigator',
        'pineappleclub.contact',
        'pineappleclub.philosophy',
        'pineappleclub.services',
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
        '$breadcrumbProvider', 'AUTHORISATION',
    function ($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider,
        $breadcrumbProvider, AUTHORISATION) {

        $breadcrumbProvider.setOptions({
            templateUrl: 'scripts/breadcrumb.html'
        });

        //$breadcrumbProvider.setOptions({
        //    template: '<div><a ng-repeat="step in steps" ui-sref="{{step.name}}"> > </a> </div>'
        //});

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
                    ncyBreadcrumb: {
                        label: state.label,
                        parent: state.parent
                    },
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