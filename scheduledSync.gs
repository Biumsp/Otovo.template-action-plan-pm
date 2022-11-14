function scheduledSync() {

  let lastEdit = SpreadsheetApp.getActiveSpreadsheet().getRangeByName("last_edit").getValue();
  let lastPush = SpreadsheetApp.getActiveSpreadsheet().getRangeByName("last_push").getValues();

  for (v of lastPush) {
    if (v[0] <= lastEdit) {
      console.log(v[0]);
      console.log("Skipping pull because the file was edited after pushing");
      return;
    }
  }
  
  updateAllData();
}
