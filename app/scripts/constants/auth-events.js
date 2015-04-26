﻿(function () {

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