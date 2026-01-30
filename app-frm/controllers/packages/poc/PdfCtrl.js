angular.module('app.frm').controller('PdfCtrl', function ($rootScope, $scope, Utility_Frm, Pdf_Service) {
    // Dummy data, just for "Table: paging and searching"
    $scope.dt = {};
    $scope.dt.pageLength = 20;
    $scope.searchKeyword = '';

    // Data to View
    $scope.pagesOptions = [10, 20, 50, 100];
    $scope.activeOptions = [
        { Value: null, Text: 'All' },
        { Value: 'Active', Text: 'Yes' },
        { Value: 'InActive', Text: 'No' },
    ];

    $scope.still_processing = false;

    // filter
    $scope.filters = {
        Active: { PropertyName: 'Status', Operator: '=', Value: null },
    };

    // some Functions
    $scope.CreateTable = function () {
        $scope.dt = Pdf_Service.Table($scope);

        // format: Title, DbField, SortField, Format, Show
        let columns = [
            ['Name', 'Name', 'Name', 'Text', true],
            ['File', 'File', 'File', 'File', true],
        ];

        Utility_Frm.ProcessColumnsY($scope.dt, columns);
    };

    $scope.showData = async function () {
        Utility_Frm.Still_Processing($scope, true);
        //await $scope.dt.loadData();

        $scope.dt.data = [
            {
                "Name": "001 - contoh",
                "File": "PDF - Bank Mandiri.pdf",
                "Url": "contoh-1.pdf",
            },
            {
                "Name": "002 - contoh",
                "File": "PDF - Bank BCA.pdf",
                "Url": "contoh-2.pdf",
            }
        ];

        Utility_Frm.Still_Processing($scope, false);

        $rootScope.SaveFilterState('Application', $scope);
    };

    async function Override_some_Filters() { }

    $scope.initialize_Page = async function () {
        Utility_Frm.Still_Processing($scope, true);

        $rootScope.LoadFilterState('Application', $scope);

        await Override_some_Filters();

        $scope.CreateTable();

        $rootScope.Proces_CheckBox_Kiri($scope);

        $scope.showData();
    };

    $scope.form = {};
    $scope.form.submitted = false;
    $scope.model = { PDF: { Data: null, FileName: null } };
    $scope.data_PDF = '';

    window.hehehe = function (base64Data, fileName) {
        $scope.$apply(function () {
            $scope.model.PDF.Data = base64Data;
            $scope.model.PDF.FileName = fileName;
        });
    }

    $scope.processPDF = async function (skipConfirmation = false) {
        //if ($scope.still_processing) return;

        $scope.data_PDF = '';

        $scope.form.submitted = true;
        Utility_Frm.Still_Processing($scope, true);

        let data = {
            dataInput: { ...$scope.model }
        };

        let resultData = await Pdf_Service.Process(data);

        if (!resultData.success) {
            Utility_Frm.Still_Processing($scope, false);
            $scope.form.submitted = false;

            return;
        }

        messageInfo('Data berhasil diproses');

        $scope.data_PDF = { ...resultData.data.Value.Data };

        Utility_Frm.Still_Processing($scope, false);

        $('a[href="#dvTAB2"]').tab('show');
    };

    function messageInfo(content) {
        let alreadyBack = false;

        $.bigBox(
            {
                title: 'Informasi',
                content: content,
                color: '#739E73',
                timeout: $rootScope.Timeout_Save(),
                icon: 'fa fa-check',
                number: '',
            },
            function () {
                Utility_ERP.Still_Processing($scope, false);
                $scope.form.submitted = false;
            }
        );

        setTimeout(() => {
            Utility_ERP.Still_Processing($scope, false);
            $scope.form.submitted = false;
        }, $rootScope.Timeout_Save());
    }

    $scope.initialize_Page();
});

var sdr_processFile = function (id_HTML_Input, onDataReady) {
    const fileInput = document.getElementById(id_HTML_Input);
    const file = fileInput.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        messageValidasi('File size exceeds 5 MB. Please choose a smaller file.');
        fileInput.value = ''; // Clear the input
        return;
    }

    // Read file as base64
    const reader = new FileReader();
    reader.onload = function (e) {
        const base64Data = e.target.result;
        const fileName = file.name;

        // ✅ CALLBACK: Send data back to caller
        if (typeof onDataReady === 'function') {
            onDataReady(base64Data, fileName);
        }
    };

    reader.readAsDataURL(file);
};