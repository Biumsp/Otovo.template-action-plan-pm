let COLUMN_DATES;

function allInstallerDates(inst, calendarSheet) {

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

function installerSelectedDates (inst, projectsSheet) {

  let installers = projectsSheet.getDataRange().getValues();
  installers.shift();

  let installerProjects = [];
  let selectedDates = [];
  let projectsWithDate = [];
  installers.forEach((row, i) => {

    let installer = row[1];
    if (!installer || installer !== inst) return;

    let date = row[COLUMN_DATES-1];
    if (date) {
      selectedDates.push(date);
      projectsWithDate.push(i+2);
    }
    else installerProjects.push(i+2);

  });

  return {"selectedDates": selectedDates,
          "installerProjects": installerProjects,
          "projectsWithDate": projectsWithDate};

}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function installerFreeDates(inst, calendarSheet, projectsSheet) {

  let allDates = allInstallerDates(inst, calendarSheet);
  let allDatesStr = allDates.map(x => x.valueOf())
  
  let tmp = installerSelectedDates(inst, projectsSheet);
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

  return {availableDates: availableDates, installerProjects: installerProjects, projectsWithDate: tmp.projectsWithDate};

}

function updateDropdown(installer, calendarSheet, projectsSheet) {

  const datesProjects = installerFreeDates(installer, calendarSheet, projectsSheet);
  const dates    = datesProjects.availableDates;
  const projects = datesProjects.installerProjects;
  const projectsWithDate = datesProjects.projectsWithDate;

  console.log("Available dates: ", dates);
  console.log("Blank projects rows: ", projects);
  console.log('Projects with date: ', projectsWithDate);

  if (!dates.length) return;

  for (i in projects) {
    projectsSheet.getRange(projects[i], COLUMN_DATES, 1, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
    .setAllowInvalid(true)
    .requireValueInList(dates, true)
    .build());
  }
  for (i in projectsWithDate) {
    projectsSheet.getRange(projectsWithDate[i], COLUMN_DATES, 1, 1)
    .setDataValidation(SpreadsheetApp.newDataValidation()
    .setAllowInvalid(true)
    .requireValueInList(dates, true)
    .build());
  }
}
