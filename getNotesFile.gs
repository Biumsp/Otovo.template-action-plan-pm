NOTES_FOLDER = "1vVIVYNCbSbkR0kDGLrrCpDBZ02wRro4i";

function getNotesFile(id) {

  let notesFolder = DriveApp.getFolderById(NOTES_FOLDER);

  // Check if file exists. If so, return it

  // Otherwise create it
  var doc = DocumentApp.create(id);
  docFile = DriveApp.getFileById( doc.getId() );
  notesFolder.addFile( docFile );
  DriveApp.getRootFolder().removeFile(docFile);

  // Then get the file in the folder and return it...
  // maybe write a function for this and use it also above 

}
