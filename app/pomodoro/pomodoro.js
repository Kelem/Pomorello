(function () {
    'use strict';

    angular
        .module('app.pomodoro')
        .controller('Pomodoro', Pomodoro);

    Pomodoro.$inject = ['trelloDataservice', 'trelloAuthentification'];

    function Pomodoro(trelloDataservice, trelloAuthentification) {
        var vm = this;

        vm.boards = [];
        vm.selectedBoard = {};
        vm.selectedList = {};
        vm.loadBoardDatas = loadBoardDatas;
        vm.addPomorello = addPomorello;
        vm.user = trelloAuthentification.getUser();

        init();

        function init() {
            getBoardsWithCards();
        }

        function getBoardsWithCards() {
            return trelloDataservice.getBoardsWithCards().then(
                function (data) {
                    vm.boards = data;
                    return vm.boards;
                }
            );
        }

        function loadBoardDatas(board) {
            loadLists(board);
            getPomorellos(board);
        }

        function loadLists(board) {
            if (!board.lists)
                trelloDataservice.getLists(board.id).then(
                    function (data) {
                        board.lists = data;
                    });
        }

        function getPomorellos(board) {
            $.each(board.cards, function (index, card) {
                trelloDataservice.getPomorellos(card.id).then(
                    function (data) {
                        card.pomorellos = data;
                    }
                );
            });
        }

        function addPomorello(card) {
            trelloDataservice.addPomorello(card.id, vm.user).then(function(data) {
                trelloDataservice.getPomorellos(card.id).then(
                    function (data) {
                        card.pomorellos = data;
                    }
                );
            });
        }
    }
})();