(function() {
    'use strict';

    angular.module('blocks.router')
        .provider('routehelperConfig', routehelperConfig)
        .factory('routehelper', routehelper);

    routehelper.$inject = ['$location', '$rootScope', '$route', 'routehelperConfig'];

    function routehelperConfig() {
        this.config =  {
            // Ici on va setter différentes propriétés
            // $routeProvider
            // docTitle
            // resolveAlways
        };

        this.$get = function() {
            return {
                config: this.config
            }
        }
    }

    function routehelper($location, $rootScope, $route, routehelperConfig) {
        var handlingRouteChangeError = false;
        var routeCounts = {
            errors : 0,
            changes : 0
        };
        var routes = [];
        var $routeProvider = routehelperConfig.config.$routeProvider;

        var service = {
            configureRoutes : configureRoutes,
            getRoutes : getRoutes,
            routeCounts : routeCounts,
            $location : $location
        };

        init();

        return service;
        ///////////////

        function configureRoutes(routes) {
            routes.forEach(function(route) {
                route.config.resolve =
                    angular.extend(route.config.resolve || {}, routehelperConfig.resolveAlways);
                $routeProvider.when(route.url, route.config);
            });
            $routeProvider.otherwise({redirectTo : '/'});
        }

        function handleRountingErrors() {
            $rootScope.$on('$routeChangeError',
                function(event, current, previous, rejection) {
                   if(handlingRouteChangeError)  {
                       return;
                   }
                    routeCounts.errors++;
                    handlingRouteChangeError = true;
                    var destination = (current && (current.title || current.name || current.loadedTemplateUrl)) || 'unknown target';
                    var msg = 'Error routing to ' + destination + '. ' + (rejection.msg || '');
                    console.log('Error : ' + msg);
                    console.log(current);
                    $location.path('/');
                });
        }

        function init() {
            handleRountingErrors();
            updateDocTitle();
        }

        function getRoutes() {
            for(var prop in $route.routes) {
                if($route.routes.hasOwnProperty(prop)) {
                    var route = $route.routes[prop];
                    var isRoute = !!route.title;
                    if(isRoute) {
                        routes.push(route);
                    }
                }
            }

            return routes;
        }

        function updateDocTitle() {
            $rootScope.$on('$routeChangeSuccess',
                function(event, current, previous) {
                    routeCounts.changes++;
                    handlingRouteChangeError = false;
                    var title = routehelperConfig.config.docTitle + ' ' + (current.title || '');
                    $rootScope.title = title;
;                })
        }
    }
})();