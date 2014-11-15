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
        vm.getBoardsWithCards = getBoardsWithCards;

        function getBoardsWithCards() {
            return trelloDataservice.getBoardsWithCards().then(
                function(data) {
                    vm.boards = data;
                    return vm.boards;
                }
            );
        }
    }
})();