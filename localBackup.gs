function localBackup() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheets = ss.getSheets();

  sheets.forEach(s => {
    let fullName = s.getName();
    
    if (fullName.endsWith(".backup")) {
      let name = fullName.slice(0, fullName.length - ".backup".length);
      
      try {
        let source = ss.getSheetByName(name).getDataRange().getValues();
        s.getRange(1, 1, source.length, source[0].length).setValues(source);
      } catch {
        console.log("No source sheet", name, "for backup sheet", fullName);
      }

    }
  });
}
