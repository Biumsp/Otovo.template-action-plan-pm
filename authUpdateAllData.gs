function authUpdateAllData() {
  let userEmail = Session.getActiveUser().getEmail();

  if (userEmail !== "enricobu@otovo.com") {
    ui.alert("You are not authorized to pull");
    return;
  }

  var ui = SpreadsheetApp.getUi(); // Same variations.

  var result = ui.alert(
     'Please confirm',
     'Are you sure you want to continue? This will override the data in the sheets.',
      ui.ButtonSet.YES_NO);

  // Process the user's response.
  if (result == ui.Button.YES) {
    updateAllData();
  } else {
    ui.alert('Ok', 'fine', ui.ButtonSet.OK);
  }

}
