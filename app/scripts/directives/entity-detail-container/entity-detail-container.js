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
                failFn: '&'
            },
            link: function (scope, element, attrs) {

                scope.edit = changeMode(VIEW_MODES.edit);
                scope.cancel = changeMode(VIEW_MODES.show);

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
                                
                                // not sure why i need to the function like this ()(error)
                                scope.failFn()(error);

                                return error;
                            });
                    }
                }

            },
            templateUrl: 'scripts/directives/entity-detail-container/entity-detail-container.html'
        }
        
    }
}());