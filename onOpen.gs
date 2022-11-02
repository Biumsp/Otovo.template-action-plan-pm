function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Update')
      .addItem('Pull', 'pull')
      .addItem('Push', 'archiveAllData')
      .addItem('Update red-dates', 'updateAllDropdowns')
      .addToUi();
}