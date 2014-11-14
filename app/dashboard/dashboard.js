(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('Dashboard', Dashboard);

    Dashboard.$inject = ['trelloAuthentification'];

    function Dashboard(trelloAuthentification) {
        var vm = this;

        vm.user = trelloAuthentification.getUser();
    }
})();