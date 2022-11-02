function record(success, sheetName, primary_key, cell, value) {
  let records = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("records");
  records.appendRow([success, new Date(), sheetName, primary_key, cell, value]);
}
