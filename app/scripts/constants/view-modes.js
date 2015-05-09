(function () {

    'use strict';

    var VIEW_MODES = {
        show: "show",
        edit: "edit"
    };

    angular.module('pineappleclub.view-modes-constant', [])
    .constant('VIEW_MODES', VIEW_MODES);

}());