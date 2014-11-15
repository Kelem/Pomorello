(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('trelloDataservice', trelloDataservice);

    trelloDataservice.$inject = ['$q'];

    function trelloDataservice($q) {
        var service = {
            getBoards: getBoards,
            createCheckList: createCheckList
        }

        return service;

        function getBoards() {
            var deferred = $q.defer();

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
                            deferred.resolve(memberBoards);
                        }
                    });
                });
            });

            return deferred.promise;
        }
    }

    function createCheckList(idCard) {
        var hasPomorellos = false;
        var apiCheckList = "cards/" + idCard + "/checklists";

        Trello.get(apiCheckList, {fields : "name"}, function (checklists) {
            $.each(checklists, function (index, checklist) {
                if(checklist.name === "Pomorellos")
                    hasPomorellos = true;
            });

            if(!hasPomorellos)
                Trello.post(apiCheckList, {name : 'Pomorellos'}, function(data) {
                    console.log('Creation OK');
                })
        });


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
            name: trelloCard.name
        }
    }
})
();