(function() {
    'use strict';

    angular
        .module('app.pomodoro')
        .run(appRun);

    appRun.$inject = ['routehelper'];

    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url : '/pomodoro',
                config : {
                    templateUrl :'app/pomodoro/pomodoro.html',
                    controller : 'Pomodoro',
                    controllerAs : 'vm',
                    title : 'pomodoro'
                }
            }
        ]
    }

})();