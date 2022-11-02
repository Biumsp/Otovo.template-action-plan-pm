function archiveAllData() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheets = ss.getSheets();

  let error;
  sheets.forEach(s => {

    try {
      let archiveID = getArchiveID(s.getName());
      if (!archiveID) return;

      let namedRanges = ss.getNamedRanges();
      let rangesToArchive = {};
      let valuesToArchive = {};

      namedRanges.forEach(nr => {

        let fullName = nr.getName();

        if (fullName.startsWith("archive.") && fullName.endsWith("." + s.getName())) {

          let name = fullName.slice("archive.".length, fullName.length - s.getName().length - 1);

          rangesToArchive[name] = nr.getRange();
          valuesToArchive[name] = nr.getRange().getValues();
        }

      })

      if (!rangesToArchive.primary_key) return;

      let archiveSpreadsheet = SpreadsheetApp.openById(archiveID);
      let archiveSheet = archiveSpreadsheet.getSheets()[0];
      let archiveValues = archiveSheet.getDataRange().getValues();
      let archiveRangesColumns = {};

      archiveSpreadsheet.getNamedRanges().forEach(nr => {
        archiveRangesColumns[nr.getName()] = nr.getRange().getColumn();
      })

      let archivePKsRange = archiveSpreadsheet.getRangeByName("primary_key");
      let archivePKsValuesRaw = archivePKsRange.getValues();

      for (let i=0; i < valuesToArchive.primary_key.length; i++) {

        let pk = valuesToArchive.primary_key[i][0];
        if (!pk) continue;

        let pkRow = -1;
        for (let i = 0; i < archivePKsValuesRaw.length; i++) {

          if (archivePKsValuesRaw[i][0] === pk) {
            pkRow = i+1; // Il range parte dalla riga 2
            break;
          }
        }

        let newLine = [];

        for (rangeName in rangesToArchive) {
          let col = archiveRangesColumns[rangeName];
          newLine[col-1] = valuesToArchive[rangeName][i][0];
        }

        if (pkRow === -1) {
          archiveValues.push(newLine);
        } else {
          archiveValues[pkRow] = newLine;
        }

        archiveSheet.getRange(1,1, archiveValues.length, archiveValues[0].length).setValues(archiveValues);

      }
    }
    catch {
      error = s.getName();
    }
    
  })



  if (error) {

    errorMessage('GS01');

    console.log("Forwarding the error...")

    let [userName, userEmail] = getUserData(ss);

    let body = `Hi Enrico, 
it's me again, with another error!.
We have an issue in archiveAllData, probably a missing permission or a corrupted ID.
I know ${userName} is already on it, but maybe you should check, just in case ;)
Have fun,

Enrico

P.S.
spreadsheet: ${ss.getUrl()}
sheet: ${error}`;

    if (userEmail) GmailApp.sendEmail("enricobu@otovo.com", `Error in "${ss.getName()}"`, body, {cc: userEmail});
    else GmailApp.sendEmail("enricobu@otovo.com", `Error in ${ss.getName()}`, body); 

    return "error";

  } else {
    return "Ok";
  }

}
