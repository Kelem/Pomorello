(function () {
    'use strict';

    angular
        .module('app.pomodoro')
        .controller('Pomodoro', Pomodoro);

    Pomodoro.$inject = ['trelloDataservice'];

    function Pomodoro(trelloDataservice) {
        var vm = this;

        vm.boards = [];
        vm.selectedBoard = {};
        vm.selectedList = {};
        vm.createCheckList = createCheckList;
        vm.loadLists = loadLists;

        init();

        function init() {
            getBoardsWithCards();
        }

        function createCheckList() {
            trelloDataservice.createCheckList('52f569cd47174f4a786aae7e')
        }

        function getBoardsWithCards() {
            return trelloDataservice.getBoardsWithCards().then(
                function (data) {
                    vm.boards = data;
                    return vm.boards;
                }
            );
        }

        function loadLists(board) {
            if (!board.lists)
                trelloDataservice.getLists(board.id).then(
                    function (data) {
                        board.lists = data;
                    });
        }
    }
})();