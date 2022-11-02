function updateAllDropdowns() {

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let calendarSheet = ss.getSheetByName('calendar_installers');
  let projectsSheet = ss.getSheetByName('main');
  
  let calendarSheetValues = calendarSheet.getDataRange().getValues();

  let installers = [];

  calendarSheetValues.forEach(row => {
    if (row[0]) installers.push(row[0]);
  });

  var editRange = ss.getRangeByName("red_dates");
  COLUMN_DATES = editRange.getColumn();

  installers.forEach(installer => {
    console.log(installer);
    updateDropdown(installer, calendarSheet, projectsSheet);
  })

}
