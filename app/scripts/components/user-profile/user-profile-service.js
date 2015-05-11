(function () {

    'use strict';

    angular.module('pineappleclub.user-profile-service', [
        'pineappleclub.entity-manager-factory'
    ])
    .factory('UserProfileService', UserProfileService);

    UserProfileService.$inject = [
        'EntityManagerFactory'
    ];

    function UserProfileService(EntityManagerFactory) {
        var manager = EntityManagerFactory.getManager(),
            userProfileService = {
                getUsers: getUsers,
                save: save
            }

        return userProfileService;

        function getUsers() {
            return manager.fetchEntityByKey('User', '554f16df58bec36013467c9c')
                .then(function (data) {
                    return data.entity;
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