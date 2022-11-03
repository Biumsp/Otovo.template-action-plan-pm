function scheduledPull() {

  let lastEdit = SpreadsheetApp.getActiveSpreadsheet().getRangeByName("last_edit").getValue();
  let lastPush = SpreadsheetApp.getActiveSpreadsheet().getRangeByName("last_push").getValue();

  if (lastPush <= lastEdit) {
    console.log("Skipping pull because the file was edited after pushing");
    return;
  }
  updateAllData();
}
