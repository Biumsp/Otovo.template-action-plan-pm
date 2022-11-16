function freeDates() {

  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let calendarSheet = ss.getSheetByName("calendar_installers");

  let allInstallersDates = getAllInstallersDates(calendarSheet.getDataRange().getValues());
  let installers = ss.getRangeByName("dropdown_keys").getValues();
  let datesRange = ss.getRangeByName("dropdown_dates");

  let values = calendarSheet.getDataRange().getValues();
  values.shift();

  let freeDatesList = [];
  for(i=0; i<values.length; i++){

    let rowValues = values[i];

    let installer = rowValues[0];
    if (!installer) continue;

    let ifd = installerFreeDates(installer, allInstallersDates, installers, datesRange.getValues())

    ifd.forEach(d => {
      freeDatesList.push([installer, d]);
    })

  }

  let freeDatesSheet = ss.getSheetByName("free_dates");

  let oldValues = freeDatesSheet.getDataRange().getValues();
  let cleanValues = [];
  for (let i = 0; i < oldValues.length; i++) {
    cleanValues.push([null, null]);
  }

  freeDatesSheet.getRange(1,1,oldValues.length, 2).setValues(cleanValues);

  let range = freeDatesSheet.getRange(1, 1, freeDatesList.length, 2);
  range.setValues(freeDatesList);
}

