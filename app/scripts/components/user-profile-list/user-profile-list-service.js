(function () {

    'use strict';

    angular.module('pineappleclub.user-profile-list-service', [
        'pineappleclub.entity-manager-factory',
        'pineappleclub.app-configuration-service'
    ])
    .factory('UserProfileListService', UserProfileListService);

    UserProfileListService.$inject = [
        'EntityManagerFactory',
        'AppConfigurationService'
    ];

    function UserProfileListService(EntityManagerFactory, AppConfigurationService) {
        var manager = EntityManagerFactory.getManager(),
            userProfileListService = {
                getUsers: getUsers
            }

        return userProfileListService;

        function getUsers(accountId, pageNumber) {
            var pagination = AppConfigurationService.pagination,
                query = breeze.EntityQuery.from('Users')
                        .where('account_id', '==', accountId)
                        .skip(pagination.itemsPerPage * (pageNumber - 1))
                        .take(pagination.itemsPerPage)
                        .inlineCount();

            return manager.executeQuery(query)
                .then(function (data) {
                    return data;
                })
                .catch(function (error) {
                    console.log(error)
                });

        }

    }

}());