﻿/**
 * The application data model describes all of the model classes,
 * the documents (entityTypes) and sub-documents (complexTypes)
 *
 * The metadata (see metadata.js) cover most of the model definition.
 * Here we supplement the model classes with (non-persisted) add/remove methods,
 * property aliases, and sub-document navigation properties that can't be
 * represented (yet) in Breeze metadata.
 *
 * This enrichment takes place once the metadata become available.
 * See `configureMetadataStore()`
 */
(function () {

    'use strict';

    angular.module('pineappleclub.model', [
        'pineappleclub.meta-data',
        'pineappleclub.user-model'
    ])
    .factory('model', factory);

    factory.$inject = [
        'breeze',
        'metadata',
        'UserModelService'
    ];

    function factory(breeze, metadata, UserModelService) {

        var model = {
            getMetadataStore: getMetadataStore
        };

        return model;
        
        // Fill metadataStore with metadata, then enrich the types
        // with add/remove methods, property aliases, and sub-document navigation properties
        // that can't be represented (yet) in Breeze metadata.
        // See OrderItem.product for an example of such a 'synthetic' navigation property
        function getMetadataStore() {

            var metadataStore = metadata.createMetadataStore();

            // convenience method for registering model types with the store
            // these model types contain extensions to the type definitions from metadata.js
            var registerType = metadataStore.registerEntityTypeCtor.bind(metadataStore);

            registerUser();

            return metadataStore;
            ///////////////////////////////

            function registerUser() {
                var User = UserModelService.model;

                registerType('User', UserModelService.model);
            }
                        
        }
    }

}());
