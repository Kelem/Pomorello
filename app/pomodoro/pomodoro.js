(function() {
    'use strict';

    angular
        .module('app.pomodoro')
        .controller('Pomodoro', Pomodoro);

    Pomodoro.$inject = ['trelloDataservice'];

    function Pomodoro(trelloDataservice) {
        var vm = this;

        vm.createCheckList = createCheckList;
        vm.boards = [];
        vm.selectedBoard = {};

        init();

        function init() {
            getBoardsWithCards();
        }

        function createCheckList() {
            trelloDataservice.createCheckList('52f569cd47174f4a786aae7e')
        }

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