function onEditDropdowns(e) {

  if (e.range.getSheet().getName() !== "main") {
    console.log("Invalid worksheet");
    return;
  }

  console.log("Edited cell: ", e.range.getRow(), e.range.getColumn());

  // get the spreadsheet object and the sheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  var editRange = ss.getRangeByName("red_dates");
  COLUMN_DATES = editRange.getColumn();

  // Exit if we're out of range
  var thisRow = e.range.getRow();
  if (thisRow < editRange.getRow() || thisRow > editRange.getLastRow()) {
    console.log("Out of range");
    return;
  }

  var thisCol = e.range.getColumn();
  if (thisCol < editRange.getColumn() || thisCol > editRange.getLastColumn()) {
    console.log("Out of range");
    return;
  }

  var calendarSheet = ss.getSheetByName('calendar_installers');
  var projectsSheet = ss.getSheetByName('main');

  var installer = projectsSheet.getRange(e.range.getRow(), 2, 1, 1).getValue();

  updateDropdown(installer, calendarSheet, projectsSheet);
  console.log("Updated dates: " + installer);
}