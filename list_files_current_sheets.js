//Membuat menu baru di UI Spreadsheet.
function onUpdate() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var searchMenuEntries = [{ name: "Run", functionName: "getFiles" }];
    //menambahkan menu update untuk update data file
    ss.addMenu("Update", searchMenuEntries);
};

function getFiles() {
    //Get spreadsheet dan sheet aktif
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ssID = ss.getId();

    //Get file dari folder utama dari tempat spreadsheet dan sheet yang aktif
    var ssRoot = DriveApp.getFileById(ssID).getParents();
    var sheet = ss.getActiveSheet();

    //Set display list file data dan header
    var ssHeaders = [["Date", "Owner", "Name", "URL"]];
    sheet.getRange("A1:D").clear();
    sheet.getRange("A1:D1").setValues(ssHeaders);

    //Loop semua file, get data file
    var folder = ssRoot.next();
    var files = folder.getFiles();
    var i = 1;
    while (files.hasNext()) {
        var fileData = files.next();
        if (ss.getId() == fileData.getId()) {
            continue;
        }
        sheet.getRange(i + 1, 1, 1, 4).setValues(
            [[fileData.getDateCreated(), fileData.getOwner().getName(),
            fileData.getName(), fileData.getUrl()
            ]]);
        i++;
    }
}
