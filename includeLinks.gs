function includeLinks() {
  let spreadsheet = SpreadsheetApp.getActive();
  let links = getAllLinks();
  
  spreadsheet.getCurrentCell().setRichTextValue(SpreadsheetApp.newRichTextValue()
  .setText(projectNumber)
  .setLinkUrl(links[projectNumber])
  .build());
};