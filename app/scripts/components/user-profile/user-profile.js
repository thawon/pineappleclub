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