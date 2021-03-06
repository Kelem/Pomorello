(function () {
    'use strict';

    angular.module('blocks.authentification')
        .factory('trelloAuthentification', trelloAuthentification);

    trelloAuthentification.$inject = ['$q', '$rootScope', 'routehelper'];

    function trelloAuthentification($q, $rootScope, routehelper) {
        var user;

        var service = {
            connect: connect,
            isAuthorized: isAuthorized,
            getUser: getUser
        };

        return service;

        function isAuthorized() {
            var deferred = $q.defer();

            if (!user) {
                Trello.authorize({
                    interactive: false,
                    success: function () {
                        getMe(function () {
                            deferred.resolve(user);
                        })
                    },
                    error: function () {
                        deferred.reject('User not connected');
                    }
                });
            } else {
                deferred.resolve(user);
            }

            return deferred.promise;
        }

        function connect() {
            Trello.authorize({
                type: 'popup',
                name: 'Pomorello',
                success: function () {
                    getMe(function () {
                        routehelper.$location.path("/");
                        $rootScope.$apply();
                    })
                },
                interactive: true,
                scope: {
                    write: true,
                    read: true
                }
            });
        }

        function getMe(closure) {
            Trello.members.get("me", function (member) {
                user = member;
                closure();
            });
        }

        function getUser() {
            return user;
        }
    };
})
();