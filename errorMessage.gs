function errorMessage(errorCode) {

  let html = HtmlService.createHtmlOutput(ERRORS[errorCode])
            .setWidth(400)
            .setHeight(150);

  SpreadsheetApp.getUi()
    .showModalDialog(html, "Error, I'm sorry");
}
