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