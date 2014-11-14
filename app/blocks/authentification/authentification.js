(function() {
    'use strict';

    angular.module('blocks.authentification')
        .controller('Authentification', Authentification);

    Authentification.$inject = ['trelloAuthentification'];

    function Authentification(trelloAuthentification) {
        var vm = this;

        vm.connect = connect;

        function connect() {
            trelloAuthentification.connect();
        }
    }

})();