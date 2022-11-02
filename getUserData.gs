function getUserData(ss) {
  let userName = "the user";
  let userEmail;
  
  ss.getNamedRanges().forEach(r => {
    if (r.getName() === "user_name") userName = r.getRange().getValue();
    if (r.getName() === "user_email") userEmail = r.getRange().getValue();
  })

  return [userName, userEmail]
}
