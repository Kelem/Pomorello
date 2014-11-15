(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('Dashboard', Dashboard);

    Dashboard.$inject = ['$q', 'trelloAuthentification', 'trelloDataservice'];

    function Dashboard($q, trelloAuthentification, trelloDataservice) {
        var vm = this;

        vm.user = trelloAuthentification.getUser();
        vm.boards = [];
        vm.getBoards = getBoards;

        function getBoards() {
            return trelloDataservice.getBoards().then(
                function(data) {
                    vm.boards = data;
                    return vm.boards;
                }
            );
        }
    }
})();