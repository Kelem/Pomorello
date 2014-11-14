(function() {
    'use strict';

    var core = angular.module('app.core');

    core.config(configure);

    function configure ($routeProvider, routehelperConfigProvider) {
        // Configure the common route provider
        routehelperConfigProvider.config.$routeProvider = $routeProvider;
        routehelperConfigProvider.config.docTitle = 'Pomorello: ';
    }
})();