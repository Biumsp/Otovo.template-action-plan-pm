function record(rangeName) {
  SpreadsheetApp
  .getActiveSpreadsheet()
  .getRangeByName(rangeName)
  .setValue(
    new Date()
  );
}
