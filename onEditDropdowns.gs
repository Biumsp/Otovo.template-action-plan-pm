function onEditDropdowns(e) {

  if (e.range.getSheet().getName() !== "main") {
    console.log("Invalid worksheet");
    return;
  }

  console.log("Edited cell: ", e.range.getRow(), e.range.getColumn());

  // get the spreadsheet object and the sheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  var datesRange = ss.getRangeByName("dropdown_dates");
  COLUMN_DATES = datesRange.getColumn();

  // Exit if we're out of range
  var thisRow = e.range.getRow();
  if (thisRow < datesRange.getRow() || thisRow > datesRange.getLastRow()) {
    console.log("Out of range");
    return;
  }

  var thisCol = e.range.getColumn();
  if (thisCol < datesRange.getColumn() || thisCol > datesRange.getLastColumn()) {
    console.log("Out of range");
    return;
  }

  var projectsSheet = ss.getSheetByName('main');
  var installer = projectsSheet.getRange(e.range.getRow(), ss.getRangeByName("dropdown_keys").getColumn(), 1, 1).getValue();

  let allInstallerDates = getAllInstallersDates(ss.getSheetByName("calendar_installers").getDataRange().getValues());
  let installers = ss.getRangeByName("dropdown_keys").getValues();

  updateDropdown(installer, installers, projectsSheet, allInstallerDates, datesRange);
  console.log("Updated dates:", installer);
}