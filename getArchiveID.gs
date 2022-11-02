function getArchiveID(sheetName) {

  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let ranges = ss.getNamedRanges();
  
  let id;
  ranges.forEach(r => {
    let name = r.getName();

    if (name.startsWith("archive_id.")) {
      if (name.slice("archive_id.".length) === sheetName) {
        id = r.getRange().getValue();
      }
    };
  });

  return id;

}