function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Update')
      .addItem('Sync', 'sync')
      .addItem('Update red-dates', 'updateAllDropdowns')
      .addItem('Count Free Dates', 'freeDates')
      .addToUi();

  updateAllDropdowns();
}
