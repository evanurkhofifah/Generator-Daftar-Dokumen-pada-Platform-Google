//Membuat menu baru di UI Spreadsheet.
function onUpdate() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var searchMenuEntries = [{ name: "Run", functionName: "getFiles" }];
    //menambahkan menu update untuk update data file
    ss.addMenu("Update", searchMenuEntries);
};

// Get list berdasarkan id folder
function getFolderId() {
    // Deklarasi variable id folder
    var folderId = '1234567890abcdefghijklmnopqrstuvwxyz'
    getFolders(folderId, true);
};

// Get Folder 
function getFolders(folderId) {
    try {
        // Get folder berdasarkan id folder
        var parentFolder = DriveApp.getFolderById(folderId);

        // Inisialisasi
        var data, sheet = SpreadsheetApp.getActiveSheet();
        sheet.clear();
        sheet.appendRow(["Date", "Owner", "Name", "URL"]);

        // Get files
        getFiles(parentFolder.getName(), parentFolder, data, sheet);
    } catch (e) {
        Logger.log(e.toString());
    }
};

// Get files dari folder utama
function getFiles(parentName, parent, data, sheet) {
    var files = parent.getFiles();
    // List files di dalam folder
    while (files.hasNext()) {
        var rootFile = files.next();
        data = [
            rootFile.getDateCreated(),
            rootFile.getOwner().getName(),
            rootFile.getName(),
            rootFile.getUrl(),
        ];
        //Write data
        sheet.appendRow(data);
    }
};
