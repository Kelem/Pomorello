(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('trelloDataservice', trelloDataservice);

    trelloDataservice.$inject = ['$q'];

    function trelloDataservice($q) {
        var boardsWithCards = {};
        var cacheHttpRequestDelayInMinutes = 5;

        var service = {
            getBoardsWithCards: getBoardsWithCards,
            getLists: getLists,
            getPomorellos: getPomorellos,
            addPomorello: addPomorello
        }

        return service;

        function getBoardsWithCards() {
            var deferred = $q.defer();
            var lastUpdate = boardsWithCards.lastUpdate;

            if (lastUpdate) {
                if (!newHttpRequestRequired(cacheHttpRequestDelayInMinutes, lastUpdate)) {
                    deferred.resolve(boardsWithCards.boards);
                    return deferred.promise;
                }
            }

            console.log('Refresh datas');

            Trello.get("members/me/boards", { organizations: 'all'}, function (boards) {
                var memberBoards = [];
                var nbQueryCards = 0;

                $.each(boards, function (index, board) {
                    var currentBoard = buildBoard(board);

                    Trello.get("boards/" + currentBoard.id + "/cards", function (cards) {
                        $.each(cards, function (index, card) {
                            currentBoard.cards.push(buildCard(card));
                        });

                        nbQueryCards++;
                        memberBoards.push(currentBoard);

                        if (boards.length === nbQueryCards + 1) {
                            boardsWithCards.boards = memberBoards;
                            boardsWithCards.lastUpdate = new Date();

                            deferred.resolve(boardsWithCards.boards);
                        }
                    });
                });
            });

            return deferred.promise;
        }

        function getPomorelloChecklistId(idCard) {
            var deferred = $q.defer();
            var hasPomorellos = false;
            var apiCheckList = "cards/" + idCard + "/checklists";

            Trello.get(apiCheckList, {fields: "name"}, function (checklists) {
                $.each(checklists, function (index, checklist) {
                    if (checklist.name === "Pomorellos") {
                        hasPomorellos = true;
                        deferred.resolve(checklist.id);
                    }
                });

                if (!hasPomorellos)
                    Trello.post(apiCheckList, {name: 'Pomorellos'}, function (checklist) {
                        deferred.resolve(checklist.id);
                    })
            });

            return deferred.promise;
        }

        function getLists(idBoard) {
            var deferred = $q.defer();

            Trello.get('boards/' + idBoard + '/lists', function (data) {
                var lists = [];

                $.each(data, function (index, list) {
                    lists.push(buildList(list));
                });

                deferred.resolve(lists);
            });

            return deferred.promise;
        }

        function getPomorellos(idCard) {
            var deferred = $q.defer();
            var apiCheckList = "cards/" + idCard + "/checklists";
            var hasPomorellos = false;

            Trello.get(apiCheckList, {fields: "name"}, function (checklists) {
                $.each(checklists, function (index, checklist) {
                    if (checklist.name === "Pomorellos") {
                        hasPomorellos = true;
                        getPomorellosOnChecklist(checklist.id).then(function (data) {
                            deferred.resolve(data);
                        });
                    }
                });

                if (!hasPomorellos)
                    deferred.resolve([]);
            });

            return deferred.promise;
        }

        function getPomorellosOnChecklist(idCheckList) {
            var deferred = $q.defer();

            Trello.get("checklists/" + idCheckList + "/checkItems", function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        function addPomorello(idCard, user) {
            var deferred = $q.defer();

            getPomorelloChecklistId(idCard).then(function (checklistId) {
                Trello.post("checklists/" + checklistId + "/checkItems", {name: 'A pomorello - ' + new Date() + ' - ' + user.initials}, function (checkItem) {
                    deferred.resolve();
                });
            });

            return deferred.promise;
        }
    }


    // Fonctions "privées"

    function buildBoard(trelloBoard) {
        return {
            id: trelloBoard.id,
            name: trelloBoard.name,
            closed: trelloBoard.closed,
            cards: []
        }
    };

    function buildCard(trelloCard) {
        return {
            id: trelloCard.id,
            name: trelloCard.name,
            idList: trelloCard.idList
        }
    }

    function buildList(trelloList) {
        return {
            id: trelloList.id,
            name: trelloList.name
        }
    }

    function newHttpRequestRequired(delay, lastUpdate) {
        var now = new Date();
        var checkDate = lastUpdate.getTime() + delay * 60000;

        return checkDate < now;
    }

})();