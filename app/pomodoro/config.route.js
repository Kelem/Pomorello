(function() {
    'use strict';

    angular
        .module('app.pomodoro')
        .run(appRun);

    appRun.$inject = ['routehelper','trelloAuthentification'];

    function appRun(routehelper, trelloAuthentification) {
        routehelper.configureRoutes(getRoutes(routehelper, trelloAuthentification));
    }

    function getRoutes(routehelper, trelloAuthentification) {
        return [
            {
                url : '/pomodoro',
                config : {
                    templateUrl :'app/pomodoro/pomodoro.html',
                    controller : 'Pomodoro',
                    controllerAs : 'vm',
                    title : 'Pomodoro',
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