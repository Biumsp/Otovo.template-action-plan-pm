// get the spreadsheet object and the sheet
const ss = SpreadsheetApp.getActiveSpreadsheet();
const calendarSheet = ss.getSheetByName('CALENDAR INSTALLERS');
const projectsSheet = ss.getSheetByName('Main');

const COLUMN_DATES = 13;

function allInstallerDates(inst) {

  let dates = calendarSheet.getDataRange().getValues();
  dates.shift();


  let installerDates = [];

  dates.forEach(row => {
    let installer = row.shift();

    if (!installer || installer!==inst) return;

    row.forEach(date => {
      if (date) installerDates.push(date);
    });
  });

  return installerDates;
}

function installerSelectedDates (inst) {

  let installers = projectsSheet.getDataRange().getValues();
  installers.shift();

  let installerProjects = [];
  let selectedDates = [];
  installers.forEach((row, i) => {

    let installer = row[1];
    if (!installer || installer !== inst) return;

    let date = row[12];
    if (date) selectedDates.push(date);

    installerProjects.push(i+2);

  });

  return {"selectedDates": selectedDates,
          "installerProjects": installerProjects};

}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function installerFreeDates(inst) {

  let allDates = allInstallerDates(inst);
  let allDatesStr = allDates.map(x => x.valueOf())
  
  let tmp = installerSelectedDates(inst);
  let selectedDates = tmp.selectedDates;
  let selectedDatesStr = selectedDates.map(x => x.valueOf())
  let installerProjects = tmp.installerProjects;

  let availableDates = [];
  const copyDates = allDates.map(x => x);

  copyDates.forEach(date => {

    let dateStr = date.valueOf();

    if (selectedDatesStr.includes(dateStr) && allDatesStr.includes(dateStr)) {
      selectedDatesStr = removeItemOnce(selectedDatesStr, dateStr);
      allDatesStr      = removeItemOnce(allDatesStr, dateStr);
    }
    else {
      let dateDisplayed = Utilities.formatDate(date, 'Europe/Rome', 'dd/MM/yyyy')
      availableDates.push(dateDisplayed);
      allDatesStr = removeItemOnce(allDatesStr, dateStr);
    }
  });

  return {availableDates: availableDates, installerProjects: installerProjects};

}

function updateDropdown(installer) {

  const datesProjects = installerFreeDates(installer);
  const dates    = datesProjects.availableDates;
  const projects = datesProjects.installerProjects;

  for (i in projects) {
    projectsSheet.getRange(projects[i], COLUMN_DATES, 1, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
    .setAllowInvalid(true)
    .requireValueInList(dates, true)
    .build());
  }
}

function onEdit(e) {

  if (e.range.getSheet().getName() !== "Main" && e.range.getSheet().getName() !== "CALENDAR INSTALLERS") return;

  var editRange = ss.getRangeByName("DateDropdown");

  if (e.range.getSheet().getName() === "Main")
  {
    // Exit if we're out of range
    var thisRow = e.range.getRow();
    if (thisRow < editRange.top || thisRow > editRange.bottom) return;
  
    var thisCol = e.range.getColumn();
    if (thisCol < editRange.left || thisCol > editRange.right) return;

    var installer = projectsSheet.getRange(e.range.getRow(), 2, 1, 1).getValue();
  }
  else {
    var installer = calendarSheet.getRange(e.range.getRow(), 1, 1, 1).getValue();
  }

  updateDropdown(installer);
}

