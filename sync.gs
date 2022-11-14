function sync() {
  let userEmail = Session.getActiveUser().getEmail();
  var ui = SpreadsheetApp.getUi();

  if (userEmail !== "enricobu@otovo.com") {
    ui.alert("You are not authorized to pull");
    return;
  }

  var result = ui.alert(
     'Please confirm',
     'Are you sure you want to continue? This will override the data in the sheets.',
      ui.ButtonSet.YES_NO);

  if (result == ui.Button.YES) {
    localBackup();
    updateAllData();
  } else {
    ui.alert('Ok', 'fine', ui.ButtonSet.OK);
  }
}

function updateAllData() {
  /*
     Copies the values from all the ranges named "from.name" to the corresponding
     ranges "to.name"
  */

  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let ranges = ss.getNamedRanges();
  
  let error;
  ranges.forEach(inputRange => {
    let name = inputRange.getName();
    
    if (name.startsWith("from.")) {
      name = name.slice("from.".length);

      try {

        let outputRange = ss.getRangeByName("to." + name);
        console.log("Copy values from", name);
        outputRange.setValues(inputRange.getRange().getValues());

      } catch (err) {
        error = true;
      }

    };

  });

  if (error) {

    errorMessage('GS00');

    console.log("Forwarding the error...")

    let [userName, userEmail] = getUserData(ss);

    let body = `Hi Enrico, 
it's me, the version of you from the past who taught this was a good idea.
We have an error in updateAllData, probably a range-length error.
I know for sure that ${userName} solved the problem, but maybe you should check, just in case ;)
Have fun,

Enrico

P.S.
spreadsheet: ${ss.getUrl()}`;

    if (userEmail) GmailApp.sendEmail("enricobu@otovo.com", `Error in "${ss.getName()}"`, body, {cc: userEmail});
    else GmailApp.sendEmail("enricobu@otovo.com", `Error in ${ss.getName()}`, body); 

  } else {
    record("last_pull");
    updateAllDropdowns();
  }

}
