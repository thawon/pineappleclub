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