function sync() {
  let userEmail = Session.getActiveUser().getEmail();
  var ui = SpreadsheetApp.getUi();

  if (userEmail !== "enricobu@otovo.com") {
    ui.alert("You are not authorized to sync");
    return;
  }

  var result = ui.alert(
     'Please confirm',
     'Are you sure you want to continue? This will override the data in the sheets.',
      ui.ButtonSet.YES_NO);

  if (result == ui.Button.YES) {
    localBackup();
    syncAll();
  } else {
    ui.alert('Ok', 'fine', ui.ButtonSet.OK);
  }
}

function syncAll() {

  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheets = ss.getSheets();

  let error;
  try {
    sheets.forEach(s => {

      let sourceName = s.getName();
      if (!sourceName.endsWith(".export")) return;
      
      let destinationName = sourceName.slice(0, sourceName.length - ".export".length);
      console.log("Updating sheet", destinationName);

      let sourceValues = s.getDataRange().getValues();
      let destinationSheet = ss.getSheetByName(destinationName);
      let oldValues = destinationSheet.getDataRange().getValues();

      let sourceHeaders = sourceValues.shift();
      let destinationHeaders = oldValues.shift();

      for (let i = 0; i < destinationHeaders.length; i++) {

        let column = sourceHeaders.indexOf(destinationHeaders[i]);
        if (column === -1) continue;
    
        console.log("Updating column", destinationHeaders[i]);
        let newCol = [];
        for (row of sourceValues) {
          newCol.push([row[column]]);
        }

        if (oldValues.length > newCol.length) {
          destinationSheet.getRange(2, i+1, oldValues.length).clearContent();
        }
        if (newCol.length !== 0) {
          destinationSheet.getRange(2, i+1, newCol.length).setValues(newCol);
          console.log("Updated");
        } else {
          console.log("Skipped");
        }
      } 
    });

  } catch (err) {
    throw err;
    error = true;
  }

  if (error) {

    errorMessage('GS00');

    console.log("Forwarding the error...")

    let [userName, userEmail] = getUserData(ss);

    let body = `Hi Enrico, 
it's me, the version of you from the past who taught this was a good idea.
We have an error in syncAll. I know for sure that ${userName} solved the problem, but maybe you should check, just in case ;)
Have fun,

Enrico

P.S.
spreadsheet: ${ss.getUrl()}`;

    if (userEmail) GmailApp.sendEmail("enricobu@otovo.com", `Error in "${ss.getName()}"`, body, {cc: userEmail});
    else GmailApp.sendEmail("enricobu@otovo.com", `Error in ${ss.getName()}`, body); 

  } else {
    updateAllDropdowns();
  }

}
