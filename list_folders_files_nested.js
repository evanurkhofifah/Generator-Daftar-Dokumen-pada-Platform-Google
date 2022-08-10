// Membuat menu baru di UI spreadsheet
function onOpen() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ui = SpreadsheetApp.getUi();
    // Buat menu untuk menjalankan scipt
    ui.createMenu('List')
        .addItem('Run', 'getFolderId')
        .addToUi();
};

// Get list berdasarkan id folder
function getFolderId() {
    // Membuat input box untuk mengisi id folder
    var folderId = Browser.inputBox('Masukan ID Folder', Browser.Buttons.OK_CANCEL);
    if (folderId === "") {
        Browser.msgBox('Invalid ID Folder');
        return;
    }
    getAllFolder(folderId, true);
};

// Get Folder dan Sub-folder
function getAllFolder(folderId, listAll) {
    try {
        // Get folder berdasarkan id folder
        var parentFolder = DriveApp.getFolderById(folderId);

        // Inisialisasi
        var data, sheet = SpreadsheetApp.getActiveSheet();
        sheet.clear();
        sheet.appendRow(["Full Path", "Name", "Type", "Date", "URL"]);

        // Get files and folders
        getRootFiles(parentFolder.getName(), parentFolder, data, sheet);
        getChildFolders(parentFolder.getName(), parentFolder, data, sheet, listAll);
    } catch (e) {
        Logger.log(e.toString());
    }
};

// Get files dari folder induk/utama
function getRootFiles(parentName, parent, data, sheet) {
    var files = parent.getFiles();
    // List files di dalam folder utama
    while (files.hasNext()) {
        var rootFile = files.next();
        data = [
            parentName + "/" + rootFile.getName(),
            rootFile.getName(),
            "Files",
            rootFile.getDateCreated(),
            rootFile.getUrl(),
        ];
        //Write data
        sheet.appendRow(data);
    }
};

// Get list semua file dan sub-folder
function getChildFolders(parentName, parent, data, sheet, listAll) {
    var childFolders = parent.getFolders();

    // List folder di dalam folder (sub-folder)
    while (childFolders.hasNext()) {
        var childFolder = childFolders.next();
        var folderId = childFolder.getId();
        data = [
            parentName + "/" + childFolder.getName(),
            childFolder.getName(),
            "Folder",
            childFolder.getDateCreated(),
            childFolder.getUrl(),
        ];
        // Write data
        sheet.appendRow(data);

        // List files di dalam sub-folder
        var files = childFolder.getFiles();
        while (listAll & files.hasNext()) {
            var childFile = files.next();
            data = [
                parentName + "/" + childFolder.getName() + "/" + childFile.getName(),
                childFile.getName(),
                "File",
                childFile.getDateCreated(),
                childFile.getUrl(),
            ];
            // Write data
            sheet.appendRow(data);
        }
        // Rekursif memanggil sub-folder
        getChildFolders(parentName + "/" + childFolder.getName(), childFolder, data, sheet, listAll);
    }
};