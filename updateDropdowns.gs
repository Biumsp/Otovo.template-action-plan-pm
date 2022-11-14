let COLUMN_DATES;

function updateAllDropdowns() {
  /* This script needs a range named "dropdown_key" on the installers and
   * one named "dropdown_dates" on the red_dates. The ranges must start below the header.
   * It collects the available dates from the calendar and struct them by installer.
   * Then, it loops over the dropdown_key and groups their rows and selected dates by installer
   * only if the installer is in the available dates object.
   * It then removes the selected dates from the availabe ones, for every installer.
   * At last, it removes all validation rules from the dates range and adds the new rules
   * in the rows corresponding to the installer, for every installer.
  */

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  clearAllDropdowns(ss);
  
  let calendarSheet = ss.getSheetByName('calendar_installers');
  let projectsSheet = ss.getSheetByName('main');
  
  let calendarSheetValues = calendarSheet.getDataRange().getValues();

  let allInstallersDates = getAllInstallersDates(calendarSheetValues);

  let datesRange = ss.getRangeByName("dropdown_dates");
  COLUMN_DATES = datesRange.getColumn();

  let installers = ss.getRangeByName("dropdown_keys").getValues();

  let updatedInstallers = [];
  installers.forEach(installer => {

    if (!updatedInstallers.includes(installer[0]) && installer[0] && installer in allInstallersDates) {

      console.log("Updating installer", installer[0]);
      updateDropdown(installer[0], installers, projectsSheet, allInstallersDates, datesRange);
      updatedInstallers.push(installer[0]);

    }
  })

}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function getAllInstallersDates(calendarSheetValues) {

  let allInstallersDates = {};
  calendarSheetValues.forEach(row => {
    if (row[0]) allInstallersDates[row.shift()] = row;
  });

  return allInstallersDates;
}

function installerFreeDates(inst, allInstallerDates, installers, dates) {

  let freeDates = [];

  console.log("Converting dates in calendar to str for", inst);

  if (!inst in allInstallerDates) return [];
  allInstallerDates[inst].forEach(d => {
    try {
      freeDates.push(Utilities.formatDate(d, 'Europe/Rome', 'dd/MM/yyyy'));
    }
    catch {
      console.log("Invalid date <", d, ">");
    }
  })

  console.log("Removing selected dates from", inst);
  installers.forEach((installer, j) => {
    if (installer[0] === inst) {
      try {
        freeDates = removeItemOnce(freeDates, Utilities.formatDate(dates[j][0], 'Europe/Rome', 'dd/MM/yyyy'));
      }
      catch {
        console.log("Invalid date <", dates[j][0], ">");
      }
    }
  })
  
  return freeDates;

}

function updateDropdown(inst, installers, projectsSheet, allInstallerDates, datesRange) {

  let freeDates = installerFreeDates(inst, allInstallerDates, installers, datesRange.getValues());

  if (!freeDates.length) return;

  installers.forEach((installer, j) => {
    if (installer[0] === inst) {

      projectsSheet.getRange(j+2, COLUMN_DATES, 1, 1)
      .setDataValidation(SpreadsheetApp.newDataValidation()
      .setAllowInvalid(true)
      .requireValueInList(freeDates, true)
      .build());

    }
  })

}

function clearAllDropdowns(ss) {
  console.log("Cleaning dropdowns");
  ss.getRangeByName("dropdown_dates").setDataValidation(null);
}
