function scheduledPushPull() {
  let resultOfPush = push();
  if (resultOfPush !== "Ok") {
    console.log("Failed to push");
    return;
  }
  updateAllData();
}
