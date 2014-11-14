(function() {
    'use strict';

    angular
        .module('blocks.authentification')
        .run(appRun);

    appRun.$inject = ['routehelper'];

    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url : '/login',
                config : {
                    templateUrl :'app/blocks/authentification/authentification.html',
                    controller : 'Authentification',
                    controllerAs : 'vm',
                    title : 'login'
                }
            }
        ]
    }

})();