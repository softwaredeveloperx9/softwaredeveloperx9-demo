'use strict';

angular.module('app.frm').config(function ($stateProvider) {
    $stateProvider
        .state('app.frm.poc', {
            url: '/frm/poc',
            data: {
                title: 'POC',
            },
            views: {
                'frmMenu@app': {
                    templateUrl: 'app-frm/_menu/poc.html',
                },
                'content@app': {
                    templateUrl: 'app-frm/views/packages/poc/_WebPage.html',
                },
            },
        })

        .state('app.frm.pocPdf', {
            url: '/frm/poc/Pdf',
            data: {
                title: 'PDF - Processing',
            },
            views: {
                'frmMenu@app': {
                    templateUrl: 'app-frm/_menu/poc.html',
                },
                'content@app': {
                    templateUrl: 'app-frm/views/packages/poc/pdf.html',
                },
            },
        })
        ;
});