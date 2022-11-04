function includeLinks() {
  let spreadsheet = SpreadsheetApp.getActive();

  
  
  spreadsheet.getCurrentCell().setRichTextValue(SpreadsheetApp.newRichTextValue()
  .setText(projectNumber)
  .setLinkUrl(links[projectNumber])
  .build());
};