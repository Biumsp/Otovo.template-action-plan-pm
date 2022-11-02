function updateAllData() {

  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let ranges = ss.getNamedRanges();
  
  let error;
  ranges.forEach(r0 => {
    let name = r0.getName();

    if (name.startsWith("from.")) {
      name = name.slice("from.".length);

      ranges.forEach(r1 => {

        if (r1.getName() === `to.${name}`) {

          console.log("Copy values from", name)

          let values = r0.getRange().getValues();
          try {
            r1.getRange().setValues(values);
          } catch (err) {
            error = true;
          }

        };

      });

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

  }

}

