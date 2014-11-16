(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .run(appRun);

    appRun.$inject = ['routehelper', 'trelloAuthentification'];

    function appRun(routehelper, trelloAuthentification) {
        routehelper.configureRoutes(getRoutes(routehelper, trelloAuthentification));
    }

    function getRoutes(routehelper, trelloAuthentification) {
        return [
            {
                url : '/',
                config : {
                    templateUrl :'app/dashboard/dashboard.html',
                    controller : 'Dashboard',
                    controllerAs : 'vm',
                    title : 'Dashboard',
                    resolve : {
                        userConnected : function() {
                            return trelloAuthentification.isAuthorized().then(
                                function(data) {},
                                function(error) {
                                    routehelper.$location.path('/login');
                                }
                            )
                        }
                    }
                }
            }
        ]
    }

})();