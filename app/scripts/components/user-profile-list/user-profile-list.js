(function () {

    'use strict';

    angular.module('pineappleclub.user-profile-list', [
        'pineappleclub.user-profile-list-service',
        'pineappleclub.user-service',
        'pineappleclub.app-configuration-service',
        'pineappleclub.state-service',
        'pineappleclub.view-modes-constant'
    ])
    .controller('UserProfileListController', UserProfileListController);

    UserProfileListController.$inject = [
        'UserProfileListService',
        'UserService',
        'AppConfigurationService',
        'StateService',
        'VIEW_MODES'
    ];

    function UserProfileListController(UserProfileListService,
        UserService, AppConfigurationService, StateService, VIEW_MODES) {

        var that = this,
            pagination = AppConfigurationService.pagination,
            defaultPageNumber = 1;

        that.account_id = UserService.getCurrentUser().account_id;

        that.users = null;

        that.itemsPerPage = pagination.itemsPerPage;
        that.totalUsers = 0;
        
        getResultsPage(defaultPageNumber);

        that.pagination = {
            current: defaultPageNumber
        };

        that.pageChanged = function (newPage) {
            getResultsPage(newPage);
        };

        that.showDetails = showDetails;

        function getResultsPage(pageNumber) {
            var currentUser = UserService.getCurrentUser();

            UserProfileListService.getUsers(that.account_id, pageNumber)
            .then(function (data) {
                that.users = data.results;
                that.totalUsers = data.inlineCount;
            });
        }

        function showDetails(user) {            
            var state = 'user-profile',
                params = {
                    userId: user.id,
                    mode: VIEW_MODES.show
                };

            StateService.changeState(state, params);
        }
    }

}());